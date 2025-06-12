require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Ld = require("../models/leaderboard.model.js");
const Sub = require("../models/submission.model.js");
const User = require("../models/user.model.js");
const { Pinecone } = require("@pinecone-database/pinecone");

const app = express.Router();

// Dummy embeddings method placeholder
function embed(input, size = 1024) {
  return new Array(size).fill(0.1);
}

// Initialize Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PC_KEY,
});

require("../config/db.config")();

app.get("/", (req, res) => {
  res.send("Hello from the leaderboard API!");
});

// Clear all leaderboards and submissions (commented out by default)
async function clearDb() {
  await Ld.deleteMany({});
  await Sub.deleteMany({});
}
// clearDb();




app.post("/createLeaderboard", async (req, res) => {
  try {
    const { name, host } = req.body;

    if (!name || !host) {
      return res.status(400).json({
        error: "Must fill out all fields! Requires appropriate name and host.",
      });
    }

    // Check for duplicate leaderboard name in MongoDB
    const existingLd = await Ld.findOne({ name });
    if (existingLd) {
      return res
        .status(409)
        .json({ error: "Leaderboard name already taken, pick a new one." });
    }

    // Check for duplicate leaderboard name in Pinecone indexes
    const existingIndexes = (await pc.listIndexes()).indexes.map((x) => x.name);
    if (existingIndexes.includes(name)) {
      return res
        .status(409)
        .json({ error: "Leaderboard name already taken, pick a new one." });
    }

    // Create leaderboard document in MongoDB
    const ld = await Ld.create({ name, host });

    // Create Pinecone index
    await pc.createIndex({
      name,
      dimension: 1024,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    // Add leaderboard ID to user's leaderboardIds array
    const user = await User.findOne({ username: host });
    if (user) {
      const existingIds = user.leaderboardIds || [];
      await User.findByIdAndUpdate(user._id, {
        leaderboardIds: [...existingIds, ld._id],
      });
    }

    res.status(201).json({ leaderboard: ld, success: true });
  } catch (e) {
    // Cleanup on error
    const { name, host } = req.body;

    if (name && host) {
      await Ld.findOneAndDelete({ name, host });
      const existingIndexes = (await pc.listIndexes()).indexes.map((x) => x.name);
      if (existingIndexes.includes(name)) {
        await pc.deleteIndex(name);
      }
    }

    res.status(500).json({ error: e.message });
  }
});





app.post("/createSubmission", async (req, res) => {
  try {
    const { name, leaderboard, contributors, data } = req.body;

    if (!name || !leaderboard || !contributors || !data) {
      return res.status(400).json({
        error:
          "Must fill out all fields! Requires name, target leaderboard, one or more contributor, and other required fields.",
      });
    }

    // Check for duplicate submission name in this leaderboard
    const existingSub = await Sub.findOne({ name, leaderboard });
    if (existingSub) {
      return res.status(409).json({
        error: "Submission with this name already exists for this leaderboard.",
      });
    }

    // Check if leaderboard exists
    let ld = await Ld.findOne({ name: leaderboard });
    if (!ld) {
      return res.status(404).json({ error: "This leaderboard doesn't exist!" });
    }

    if (ld.locked) {
      return res.status(403).json({ error: "This leaderboard is locked for submissions." });
    }

    // Validate required fields
    const mandatoryKeys = ld.required.map((x) => Object.keys(x)[0]);
    const dataKeys = Object.keys(data);
    for (const key of mandatoryKeys) {
      if (!dataKeys.includes(key)) {
        return res.status(400).json({
          error: `Must fill out all required fields: ${mandatoryKeys.join(", ")}`,
        });
      }
    }

    const index = pc.Index(leaderboard);

    // Prepare metadata: flatten data and add elo, rank
    const newSublist = ld.submissions || {};
    const rank = Object.keys(newSublist).length + 1;
    const metadata = { ...data, elo: 0, rank };
    delete metadata.name; // remove name if present

    // Upsert vector to Pinecone
    await index.upsert([
      {
        id: name,
        values: embed(metadata),
        metadata,
      },
    ]);

    // Update leaderboard submissions and save
    newSublist[name] = { elo: 0, rank };
    await Ld.updateOne({ _id: ld._id }, { $set: { submissions: newSublist } });

    // Create submission document in MongoDB
    const entry = { ...req.body, elo: 0, rank };
    const sub = await Sub.create(entry);

    // Add submission ID to each contributor's submissions list
    for (const contributor of sub.contributors) {
      const user = await User.findOne({ username: contributor });
      if (user) {
        user.submissions = user.submissions || [];
        user.submissions.push(sub._id);
        await User.findByIdAndUpdate(user._id, { submissions: user.submissions });
      }
    }

    res.status(201).json({ submission: sub, success: true });
  } catch (e) {
    // On error, attempt cleanup
    try {
      const { name, leaderboard } = req.body;
      const index = pc.Index(leaderboard);
      await index.deleteOne(name);

      const ld = await Ld.findOne({ name: leaderboard });
      if (ld) {
        const subList = ld.submissions || {};
        if (name in subList) delete subList[name];
        await Ld.updateOne({ _id: ld._id }, { $set: { submissions: subList } });
      }

      const sub = await Sub.findOne({ name: req.body.name, leaderboard: req.body.leaderboard });
      if (sub) {
        for (const contributor of sub.contributors) {
          const user = await User.findOne({ username: contributor });
          if (user) {
            user.submissions = user.submissions.filter((id) => id.toString() !== sub._id.toString());
            await User.findByIdAndUpdate(user._id, { submissions: user.submissions });
          }
        }
        await Sub.findByIdAndDelete(sub._id);
      }
    } catch {
      // Swallow cleanup errors
    }

    res.status(500).json({ error: e.message });
  }
});




app.post("/poll", async (req, res) => {

    //Null checks
    const { leaderboard, targetElo, previousPicks } = req.body
    if(!leaderboard){
        res.status(500).json({ error: "Requires leaderboard to pick from" })
    }


    //Reversing previousPicks so when we can't find anything unique, we pick the oldest
    //Non-unique one, since that is the one we'd want to assign
    previousPicks.reverse()


    //Getting submissions
    const ld = await Ld.find({ "name" : leaderboard })
    if(!ld){
        res.status(404).json({ error: "Leaderboard not found" })
    }


    const allSubmissions = ld[0].submissions
    if(Object.keys(allSubmissions).length < 2){ //Could increase this later - what do you think?
        res.status(404).json({ error: "This leaderboard doesn't have enough submissions for ranked play" })
    }


    //Repeatedly get the best match until its not in lastPicks or there aren't any submissions left
    function useTargetElo(allSubmissions){
        let firstPick = allSubmissions[Object.keys(allSubmissions)[0]]

        let elos = Object.keys(allSubmissions).map(x => allSubmissions[x].elo)
        let bestMatchIdx = elos.map(x => Math.abs(x - targetElo))
            .reduce((maxIdx, curr, idx, array) => 
            curr > array[maxIdx] ? idx : maxIdx
        , 0);
        firstPick = Object.keys(allSubmissions)[bestMatchIdx]

        return firstPick
    }

    let firstPicks = []
    while(true){
        if(Object.keys(allSubmissions).length == 0){
            break
        }

        let choice = useTargetElo(allSubmissions)
        firstPicks.push(choice)
        if(!previousPicks || !previousPicks.includes(choice)){
            break
        }

        delete allSubmissions[choice]
    }


    //Getting the most similar option within an elo range via pinecone
    const firstSub = (await Sub.find({ "name" : firstPicks.at(-1) }))[0]
    const embedding = embed(firstSub.data)
    const index = pc.Index(leaderboard)

    //TODO - come up with a solution to what happens if there are no vectors remotely close
    let args = {
        topK : 5,
        vector : embedding,
        includeMetadata: true
    }
    if(targetElo){
        args['filter'] = { elo: { "$gte": elo - 200, "$lte": elo + 200 } }
    }

    const matches = (await index.query(args)).matches.filter(x => x.id != firstPicks.at(-1))


    //Finding the most similar that's ideally not repeated, and 
    let secondSub = null
    for(sub of matches){
        if(!previousPicks.includes(sub.id)){
            secondSub = sub.id
            break
        }
    }
    if(secondSub == null){
        secondSub = matches[0].id
    }

    secondSub = (await Sub.find({ "name" : secondSub, "leaderboard" : leaderboard }))[0]


    res.status(200).json({ "choice1" : firstSub, "choice2" : secondSub })

})




module.exports = app;
