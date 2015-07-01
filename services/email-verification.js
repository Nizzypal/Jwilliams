// var _ = require('underscore');
// var fs = require('fs');
// var jwt = require('services/jwt.js');

// var model = {
// 	verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
// 	title: 'psJw',
// 	subTitle: 'Thanks for signing up',
// 	body: 'Please verify your email address by clicking the button below.'
// }
// exports.sendMail = function(email){
// 	var payload = {
// 		sub: email
// 	}

// 	var token = jwt.encode(payload, config.EMAIL_SECRET);

// 	console.log(getHtml(token));
// }

// _.templateSettings = {
//   interpolate: /\{\{(.+?)\}\}/g
// };

// function getHtml(token){
// 	var path = '/views/createUnit.html';
// 	var html = fs.readFileSync(path, encoding = 'utf8');

// 	var template = _.template(html);

// 	model.verifyUrl += token;

// 	return template(model);
// }