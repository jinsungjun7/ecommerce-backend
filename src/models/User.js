const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    // firstName: {type:String, required:true},
    // lastName: {type:String, required:true},
    username: {type: String, required:true, unique:true}, // requires email to be unique
    password: {type: String, required:true},
    // phone: {type:Number, required:true},
  }, 
  {timestamps: true, collection: 'user-data'})

module.exports = mongoose.model("User", UserSchema);