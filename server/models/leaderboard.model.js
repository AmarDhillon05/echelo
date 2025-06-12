const { Schema, model } = require("mongoose");

const leaderboardSchema = new Schema({

  // User ID that owns the leaderboard 
  host: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  required: {
    type: Array,
    required: true,
    default: [] //Would include type info, array of objects like {"field1" : "text"}
  },
  submissions: {
    type: Object,
    required: false,
    default: {} //To be sorted easily for extraction, is {id : {elo: 0, rank: 0}} (not all info to keep things light)
  },
  locked: {
    type: Boolean, 
    required: false,
    default: false //Locked - cannot be submitted to
  }
});

const Leaderboard = model("leaderboards", leaderboardSchema);

module.exports = Leaderboard;
