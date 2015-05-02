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

module.exports = mongoose.model('Inquiry', InquirySchema, 'inquiries');

	// 'use strict';

	// angular.module('jwilliams').service('CommentModel', function(){
	// 	function commentModel(inquiryID, userID, message){
 //            this.inquiryID = inquiryID;
	// 		this.userID = userID;
 //            this.message = message;
 //            this.isInquiry = false;
 //            this.haveBeenRepledTo = false;			
	// 	}
	// 	return	commentModel;		
	// });