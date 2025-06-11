const { Schema, model } = require("mongoose");

const submissionSchema = new Schema({
  // Leaderboard it is assocated with (Leaderboard ID)
  leaderboard: {
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
    default: "No Description Provided",
  },
  elo: {
    type: Number,
    required: true,
    default: 0,
  },
  rank: {
    type: Number,
    required: true,
  },
  images: {
    type: Object,
    required: false,
    default: {}, //Either raw image data or links to S3 buckets (likely) or some other online hosting platform
  },
  links: {
    type: Object,
    required: false,
    default: {},
  },
  data: {
    type: Object,
    required: false,
    default: {}, //This is what would go into pinecone alongside description, might be mandatory based on what's specified by host
  },
  // Only for submissions that are user-linked (like for competitions) (List of user IDs)
  contributors: {
    type: Array,
    required: false,
  },
});

const Submission = model("submissions", submissionSchema);

module.exports = Submission;
