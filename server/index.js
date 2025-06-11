require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("cors")());


const userRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes')

app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes)


app.listen(2022, () => {
  console.log("listening on port 2022");
});


module.exports = app