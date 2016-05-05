var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  job_title: String,
  hashed_password: String
});

mongoose.model('User', UserSchema);
