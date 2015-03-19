var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: String,
  type: String,
  floor: String,
  floorCount: String,
  price: String,
  size: String,
  bedroomCount: String,
  bathroomCount: String,
  quartersCount: String,
  powderCount: String,
  forShortTerm: Boolean,
  forLongTerm: Boolean,
  forSale: Boolean,
  condominiumName: String,
  city: String,
  address: String,
  photos: []
},{ collection : 'items' });


module.exports = mongoose.model('Item', ItemSchema);
