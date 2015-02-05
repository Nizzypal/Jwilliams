var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var path = require('path');
var request = require('request');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var jwt = require('./services/jwt.js');

var app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
})

app.post('/register', function(req, res) {
  var user = req.body;


  var searchUser = {
    email: user.email
  };


  User.findOne(searchUser, function(err, user) {

    if (user) {
      res.status(401).send({
        message: 'Email already used by another account'
      });
      return;
    }
  });



  var newUser = new User({
    name: user.name,
    email: user.email,
    contact1: user.contact1,
    password: user.password,
    address1: user.address1
  })



  newUser.save(function(err) {
    createSendToken(newUser, res);
  });

})


app.post('/login', function(req, res) {
  var reqUser = req.body;

  var searchUser = {
    email: reqUser.email
  };

  User.findOne(searchUser, function(err, user) {

    if (!user)
      res.status(401).send({
        message: 'Wrong email/password'
      });

    user.comparePasswords(reqUser.password, function(err, isMatch) {


      if (!isMatch)
        return res.status(401).send({
          message: 'Wrong email/password'
        });

      createSendToken(user, res);

    });
  })
});

function createSendToken(user, res) {
  var payload = {
    sub: user.id
  }

  var token = jwt.encode(payload, "shh..");

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });
}

var meals = [
  'Chicken Adobo',
  'Beef Mechado',
  'Mongo'
];

app.get('/meals', function(req, res) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authorized, please login'
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shh..");

  if (!payload.sub) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }


  res.json(meals);
})

app.post('/auth/google', function(req, res) {

  var url = 'https://accounts.google.com/o/oauth2/token';
  var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    code: req.body.code,
    grant_type: 'authorization_code',
    client_secret: 'qrNX4dJzuhWykiBelIifznY5'
  }

  request.post(url, {
    json: true,
    form: params
  }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = {
      Authorization: 'Bearer ' + accessToken
    }

    request.get({
      url: apiUrl,
      headers: headers,
      json: true
    }, function(err, response, profile) {
//      console.log(profile)
        User.findOne({googleId: profile.sub}, function(err,foundUser){
            if(foundUser)
                return createSendToken(foundUser, res);
            
            var newUser = new User();
            newUser.googleId = profile.sub;
            newUser.email = profile.email;
            newUser.name = profile.name;
            newUser.save(function(err){
                      if(err) return next(err);
                      createSendToken(newUser,res);
                      });
        
        })
    });

  });
})

mongoose.connect('mongodb://skitchenAdmin:WYNE012!!!@ds053678.mongolab.com:53678/skitchen');

//app.set('views', __dirname + '/app/');
//app.set('view engine','jade');
app.use(express.static(__dirname + '/'));

// Serve static files
app.use(express.static('./app'));
//app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(path.join(__dirname, 'bower_components')));

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port);
