var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var InquirySchema = new mongoose.Schema({
	userID: String,
	inquiryID: String,
	message: String,
	//When isInquiry is false it means this message is a comment.
	isInquiry: Boolean,
	haveBeenRepledTo: Boolean
});

module.exports = mongoose.model('Inquiry', InquirySchema);