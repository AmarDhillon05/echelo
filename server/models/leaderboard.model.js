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
    default: [] //Would include type info, array of objects
  },
  submissions: {
    type: Object,
    required: false,
    default: {} //To be sorted easily for extraction, is {id : {elo: 0, rank: 0}}
  },
});

const Leaderboard = model("leaderboards", leaderboardSchema);

module.exports = Leaderboard;
