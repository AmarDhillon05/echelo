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
  description: {
    type: String,
    required: true,
    default: "",
  },
  submissions: {
    type: Array,
    required: false,
    default: {}, //To be sorted easily for extraction, is {id : {elo: 0, rank: 0}}
  },
});

const Leaderboard = model("leaderboards", leaderboardSchema);

module.exports = Leaderboard;
