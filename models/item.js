var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: String,
  floor: String,
  floorCount: String,
  price: String,
  size: String,
  roomCount: String,
  bathroomCount: String,
  forShortTerm: Boolean,
  forLongTerm: Boolean,
  forSale: Boolean,
})


module.exports = mongoose.model('Item', ItemSchema);
