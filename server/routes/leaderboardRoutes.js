require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");

const app = express.Router();

const Ld = require("../models/leaderboard.model.js");
const Sub = require("../models/leaderboard.model.js")


//Everything assumes mongodb and vectordb are updated 
//simlultaneously, which SHOULD be the case

require("../config/db.config")();

app.get("/", (req, res) => {
  res.send("Hello from the leaderboard api!");
});



app.post("/createLeaderboard", async (req, res) => {

    if(req.body && req.body.name && req.body.host){
        //Duplicate name check
        let ld = await Ld.findOne({"name" : req.body.name})
        if(ld){
            res.status(500).json({ "error" : "Leaderboard name already taken, pick a new one" })
        }
        else{
            //TODO : Add monitoring how many leaderboards someone has created + needing payment for extra
            //TODO : Creating Index in VectorDB
            try{
                ld = await Ld.create(req.body)
                res.status(200).json({ "leaderboard" : ld, "success" : true })
            }
            catch(e){
                res.status(500).json({ "error" : e.message })
            }
        }
    }
    else{
        res.status(500).json({ "error" : "Must fill out all fields! Requires appropriate name and host" })
    }
})



app.post("/createSubmission", async (req, res) => {

    //Contributors existing should be verified via other routes before this
    if(req.body && req.body.name && req.body.leaderboard && req.body.contributors && req.body.description){
        //Duplicate entry check + Leaderboard exists check
        let sub = await Sub.findOne({"name" : req.body.name, "leaderboard" : req.body.leaderboard})
        if(sub){
            res.status(500).json({ "error" : "Submission with this name already exists for this leaderboard" })
        }
        else{
            let ld = await Ld.findOne({"name" : req.body.leaderboard})
            if(ld){
                //TODO : add submission to the pinecone database
                try{
                    let newSublist = ld.submissions
                    newSublist[req.body.name] = {'elo' : 0, 'rank' : Object.keys(newSublist).length + 1}
                    await Ld.updateOne({ "_id" : ld._id }, { $set : { "submissions" : newSublist } })

                    sub = await Sub.create(req.body)
                    res.status(200).json({ "submission" : sub, "success" : true })
                }
                catch(e){
                    res.status(500).json({ "error" : e.message })
                }
            }
            else{
                res.status(500).json({ "error" : "This leaderboard doesn't exist!" })
            }
        }
    }
    else{
        res.status(500).json({ "error" : "Must fill out all fields! Requires name, target leaderboard, one or more contributor, and description"})
    }
})


module.exports = app