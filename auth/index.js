require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("cors")());

const User = require("./models/user.model.js");
const bcrypt = require("bcrypt");


const DBNAME = "Echelon"


require("./config/db.config")();

app.get("/api", (req, res) => {
  res.send("Hello from AP!");
});



app.post("/api/users/create", async (req, res) => {
  console.log("Got a create request")
  try {
    console.log(req.body)
    if (req.body.username && req.body.password && req.body.email) {
      let password = await bcrypt.hash(req.body.password, 3);
      const body = {
        username: req.body.username,
        password : password,
        email : req.body.email,
        entries : []
      };

      const user = await User.create(body);
      res.status(200).json({ user, success: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/users/sign-in", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(404).json({ error: "user cannot be found" });

    if (req.body.username && req.body.password) {
      if (!(await bcrypt.compare(req.body.password, user.password)))
        return res.status(401).json({ error: "unauthorized access" });
      else {
        res.status(200).json({ user, success: true });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/users/get-user-data", async (req, res) => {
  try {
    if (req.body.email) {
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).json({ error: "user cannot be found" });
      res.status(200).json({ user, success: true });
    }
    else if(req.body.username){
      let user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(404).json({ error: "user cannot be found" });
      res.status(200).json({ user, success: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})

app.put("/api/users/update/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ user, success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.listen(2022, () => {
  console.log("listening on port 2022");
});


module.exports = app