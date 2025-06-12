require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const Ld = require("../models/leaderboard.model.js");
const Sub = require("../models/leaderboard.model.js")
const User = require("../models/user.model.js")
const { Pinecone } = require("@pinecone-database/pinecone")


const app = express.Router()



//Embeddings method placeholder
function embed(input, size=1024){
    return new Array(size).fill(0.1)
}


//Everything assumes mongodb and vectordb are updated 
//simlultaneously, which SHOULD be the case

const pc = new Pinecone({
  apiKey: process.env.PC_KEY
});

require("../config/db.config")();

app.get("/", (req, res) => {
  res.send("Hello from the leaderboard api!");
});



app.post("/createLeaderboard", async (req, res) => {

    if(req.body && req.body.name && req.body.host){

        //Duplicate name check
        let ld = await Ld.find({"name" : req.body.name})
        if(ld.length > 0){
            res.status(500).json({ "error" : "Leaderboard name already taken, pick a new one" })
        }
        else{
            //TODO : Add monitoring how many leaderboards someone has created + needing payment for extra
            const existing = (await pc.listIndexes()).indexes.map(x => x.name)
            if(existing && existing.includes(req.body.name)){
                res.status(500).json({ "error" : "Leaderboard name already taken, pick a new one" })
            }
            else{
                try{ 

                    ld = await Ld.create({"name" : req.body.name, "host" : req.body.host})
                    await pc.createIndex({
                        name : req.body.name,
                        dimension : 1024, 
                        metric : "cosine",
                        spec: {
                            serverless: {
                            cloud: "aws",
                            region: "us-east-1"
                            }
                        }
                    })

                    const user = await User.find({"name" : req.body.host})
                    const existingIds = user.leaderboardIds ? user.leaderboardIds : []
                    await User.findByIdAndUpdate(user._id, {
                        "leaderboardIds" : [...existingIds, ld._id]
                    })


                    res.status(200).json({ "leaderboard" : ld, "success" : true })
                }
                catch(e){
                    await Ld.findOneAndDelete({"name" : req.body.name, "host" : req.body.host})
                    const existing = (await pc.listIndexes()).indexes.map(x => x.name)
                    if(existing && existing.includes(req.body.name)){
                        await pc.deleteIndex(req.body.name)
                    }
                    res.status(500).json({ "error" : e.message })
                }
            }
        }
    }
    else{
        res.status(500).json({ "error" : "Must fill out all fields! Requires appropriate name and host" })
    }
})



app.post("/createSubmission", async (req, res) => {

    //Contributors existing should be verified via other routes before this
    if(req.body && req.body.name && req.body.leaderboard && req.body.contributors && req.body.data){
        //Duplicate entry check + Leaderboard exists check
        let sub = await Sub.find({"name" : req.body.name, "leaderboard" : req.body.leaderboard})
        if(sub.length > 0){
            res.status(500).json({ "error" : "Submission with this name already exists for this leaderboard" })
        }
        else{
            let ld = await Ld.find({"name" : req.body.leaderboard})
            if(ld.length > 0){
                //TODO : enforce required fields
                try{
                    //most likely going to have to provide functionality for having image encodings too
                    //might need inference of how big a index should be so it can all be compressed well
                    await pc.waitUntilReady(req.body.leaderboard)
                    let newSublist = ld.submissions

                    const index = pc.Index(req.body.leaderboard)
                    const metadata = { ... req.body, "elo" : 0, "rank" :  Object.keys(newSublist).length + 1}
                    delete metadata.name
                    await index.upsert([{
                        id : req.body.name,
                        values: embed(metadata),
                        metadata: metadata
                    }])


                    newSublist[req.body.name] = {'elo' : 0, 'rank' : Object.keys(newSublist).length + 1}
                    await Ld.updateOne({ "_id" : ld._id }, { $set : { "submissions" : newSublist } })

                    sub = await Sub.create(req.body)
                    res.status(200).json({ "submission" : sub, "success" : true })
                }
                catch(e){
                    //TODO : Reversing all changes on failure
                    res.status(500).json({ "error" : e.message })
                }
            }
            else{
                res.status(500).json({ "error" : "This leaderboard doesn't exist!" })
            }
        }
    }
    else{
        res.status(500).json({ "error" : "Must fill out all fields! Requires name, target leaderboard, one or more contributor, and other required fieldsd"})
    }
})







module.exports = app