var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  name: String,
  date: String,
  message: String,
  email: String,
  phone: String,
  replied: Boolean
});

MessageSchema.methods.generateDate = function(){
    // var user = this.toObject();
    // delete user.password;
    
    // return user;
}

module.exports = mongoose.model('Message', MessageSchema);
