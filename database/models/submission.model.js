const { Schema, model } =  require( "mongoose" );

const submissionSchema = new Schema({
  contributors: {
    type: Array,
    required: true,
  },
  name : {
    type: String,
    required: true
  },
  leaderboard : {
    type: String,
    required: true
  },
  elo: {
    type: Int,
    required: true,
    default: 0
  },
  rank: {
    type: Int,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: "No Description Provided"
  }, 
  images: {
    type: Object, 
    required: true,
    default: {} //Either raw image data or links to S3 buckets (likely) or some other online hosting platform
  },
  links: {
    type: Object,
    required: true,
    default: {}
  },
  data: {
    type: Object, 
    required: true,
    default: {} //This is what would go into pinecone alongside description, might be mandatory based on what's specified by host
  }

 
});

const Submission = model("submissions", submissionSchema);

module.exports = Submission;