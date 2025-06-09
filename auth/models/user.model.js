const { Schema, model } =  require( "mongoose" );

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  entries : {
    type: Array,
    required: true
  } 
  //Entries will be what you've submitted to be ranked, and will contain 
  //id infos that can be looked up in the database of ranked items
});

const User = model("users", userSchema);

module.exports = User;