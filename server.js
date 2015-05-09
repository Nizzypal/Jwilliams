var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Model Requires
var User = require('./models/user.js');
var Item = require('./models/item.js');
var Message = require('./models/message.js');
var Rent = require('./models/rent.js');
var Inquiry = require('./models/inquiry.js');

var path = require('path');
var request = require('request');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var jwt = require('./services/jwt.js');
var aws = require('aws-sdk');
var q = require('q');

//Mailschimp API related code
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var apiKey = '7c9449737b73d44ba6fd130fba22a56b-us10';
try {
  var api = new MailChimpAPI(apiKey, {
    version: '2.0'
  });
} catch (error) {
  console.log(error.message);
}

var token = {
  accessToken: 'ya29.ZAHYSpol4rskXjz9EvSWlyjZfL1VlEZ1eqJntWW47LWoeU0geBleD42wQKIm0SWpNNTuW_cDOPSR8w'
};

var nodemailer = require('nodemailer');
var generator = require('xoauth2').createXOAuth2Generator({
  user: 'info@jwmgi.com',
  clientId: '742485133843-k257r4pf5nt3fcj2gtqpuqid2s4p9ucl.apps.googleusercontent.com',
  clientSecret: 'mc5CgjlA3VeKViQEsVSqDf1w',
  refreshToken: '1/byh8wlguUxsZ6AVkgd2q-YCmiGwgYbMkINPZjtqdCgwMEudVrK5jSpoR30zcRFq6',
  accessToken: token.accessToken // optional
});


// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token) {
  console.log('New token for %s: %s', token.user, token.accessToken);
  token.accessToken = token.accessToken;;
});




var app = express();

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAJK42ZM2U5NOUDDFQ';
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'jwilliams-s3bucket';

app.use(bodyParser.urlencoded({
  extended: false
}));
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
    address1: user.address1,
    subscribed: false,
    role: 'user'
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
    sub: user.id,
    name: user.name,
    type: user.role
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

app.get('/sign_s3', function(req, res) {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });
  var s3 = new aws.S3();
  console.log(S3_BUCKET);
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: req.query.s3_object_name,
    Expires: 60,
    ContentType: req.query.s3_object_type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var return_data = {
        signed_request: data,
        url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.s3_object_name
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});

app.post('/submitItem', function(req, res) {
  var photoUrl = req.body.photoUrl;
  var itemName = req.body.itemName;
  var itemPrice = req.body.price;
  var description = req.body.description;
  var serving = req.body.serving;
  var type = req.body.type;
  var availability = req.body.availability;
  var dateStart = req.body.dateStart;
  var dateEnd = req.body.dateEnd;

  //console.log(req.body);

  var searchItem = {
    name: itemName
  };

  Item.findOne(searchItem, function(err, existingItem) {

    if (existingItem) {
      res.status(401).send({
        message: 'Item already exists'
      });
      return;
    }
  });

  var newItem = new Item({
    name: itemName,
    price: itemPrice,
    photoUrl: photoUrl,
    description: description,
    serving: serving,
    type: type,
    availability: availability,
    dateStart: new Date(dateStart),
    dateEnd: new Date(dateEnd)
  });

  newItem.save(function(err) {
    if (err) {
      res.status(401).send({
        message: 'problem with database encountered'
      });
      return;
    }
    res.status(200).send();
    return;
  });

});

//Server endpoint for creating units
app.post('/createUnit', function(req, res) {

  //console.log(req.body);

  var newItem = new Item({
    name: req.body.unit.name,
    // type: String,
    floor: req.body.unit.floor,
    // floorCount: String,
    // price: String,
    // size: String,
    size: req.body.unit.size,
    bedroomCount: req.body.unit.bedroomCount,
    bathroomCount: req.body.unit.bathroomCount,
    // quartersCount: String,
    powderCount: req.body.unit.powderCount,
    //forShortTerm: Boolean,
    //forLongTerm: Boolean,
    // forSale: Boolean,
    // condominiumName: String,
    city: req.body.unit.city,
    address: req.body.unit.address,
    photos: req.body.unit.photos
  });

  var newRent = new Rent({
    monthlyRate: req.body.rentInfo.monthlyRate,
    dailyRate: req.body.rentInfo.dailyRate,
    blockDateStart: req.body.rentInfo.blockDateStart,
    blockDateEnd: req.body.rentInfo.blockDateEnd,
    // blockDates: [Date],
    currentRenter: req.body.rentInfo.currentRenter,
    numberMonthsAdvance: req.body.rentInfo.numberMonthsAdvance,
    numberMonthsDeposit: req.body.rentInfo.numberMonthsDeposit,
    cancellationFeeLT: req.body.rentInfo.cancellationFeeLT,
    cancellationFeeST: req.body.rentInfo.cancellationFeeST,
    terminationFee: req.body.rentInfo.terminationFee,
    includeUtilities: req.body.rentInfo.includeUtilities,
    includeInternet: req.body.rentInfo.includeInternet,
    requirePassport: req.body.rentInfo.requirePassport,
    requireAlienCard: req.body.rentInfo.requireAlienCard,
    requireID: req.body.rentInfo.requireID,
    unitId: newItem._id.toString()
    //unitId: newItem._id.toString(),
    // unitAmenities: [String],
    // buildingAmenities: [String]
  });

  newItem.save(function(err) {
    if (err) {
      res.status(401).send({
        message: 'problem with item database encountered'
      });
      return;
    }
    res.status(200).send();
    return;
  });

  newRent.save(function(err) {
    if (err) {
      res.status(401).send({
        message: 'problem with rent database encountered'
      });
      return;
    }
    res.status(200).send();
    return;
  });

});

app.get('/getInquiries', function(req, res) {

  //Authentication stuff
  // if (!req.headers.authorization) {
  //   return res.status(401).send({
  //     message: 'You are not authorized, please login'
  //   });
  // }

  // var token = req.headers.authorization.split(' ')[1];
  // var payload = jwt.decode(token, "shh..");

  // if (!payload.sub) {
  //   res.status(401).send({
  //     message: 'Authentication failed'
  //   });
  // }

  var stringId = req.query.q;
  var userStringID = req.query.userID;

  var baseInquiry = {};
  var returnInquiries = {
    baseInquiry: {},
    comments: []
  };

  //Get all inquiries
  //if (stringId == ""){
  if (userStringID != null){
    //Find all inquiries made by this user
    Inquiry.find({'userID': '111', isInquiry: true}).lean().exec(function(err, inquiries) {
      if (err) return console.error(err);
      //  console.log(items);

      res.json(inquiries);
      return;
    });    
  } else {
    var inquiryID = mongoose.Types.ObjectId(stringId);
    Inquiry.findById(inquiryID, function(err, foundInquiry) {

      baseInquiry.id = foundInquiry._id.toString();
      baseInquiry.userID = foundInquiry.userID;
      baseInquiry.unitID = foundInquiry.unitID;
      baseInquiry.message = foundInquiry.message;
      baseInquiry.dateOfInquiry = foundInquiry.dateOfInquiry;
      baseInquiry.isInquiry = foundInquiry.isInquiry;
      baseInquiry.haveBeenRepledTo = foundInquiry.haveBeenRepledTo;

      returnInquiries.baseInquiry = baseInquiry;

      Inquiry.find({'inquiryID': baseInquiry.id}, function(err, foundComments){
        if (err) {
          res.status(500).send({
            message: 'problem with getting inquiries encountered'
          });
          return;
        }      

        if (foundComments.length > 0) {
          returnInquiries.comments = foundComments;

          console.log(foundComments);
          res.status(200).send(returnInquiries); 
          return;       
        }
        
        console.log(foundComments);
        res.status(200).send(returnInquiries);          

      });

      // } 

      // if (foundInquiry) {
      //   var foundInquiryView = {};
      //   foundInquiryView._id = foundInquiry._id.toString();
      //   foundInquiryView.name = foundInquiry.name;
      //   foundInquiryView.address = foundInquiry.address;
      //   foundInquiryView.size = foundInquiry.size;
      //   foundInquiryView.bathroomCount = foundInquiry.bathroomCount;
      //   foundInquiryView.powderCount = foundInquiry.powderCount;

      //   console.log(foundInquiryView);
      //   res.status(200).send(foundInquiryView);
      //   return;
      // }

      //console.log(messages);
      //res.status(200).send(messages);
    });    
  }
})

//Server endpoint for creating inquiries
app.post('/createInquiry', function(req, res) {

  var newInquiry = new Inquiry({
    userID: req.body.userID,
    inquiryID:  req.body.inquiryID,
    unitID: req.body.unitID,
    message: req.body.message,
    dateOfInquiry: req.body.dateOfInquiry,
    isInquiry: req.body.isInquiry,
    haveBeenRepledTo: req.body.haveBeenRepledTo
  });

  //TODO - Data Integirty/Validation
  //Business Rule - If isInquiry = true, then inquiryID should be null

  newInquiry.save(function(err, inquiry) {
    if (err) { 
      res.status(401).send({
        message: 'problem with inquiry database encountered'
      });
      return;
    }
    res.status(200).send({
      newInquiryID: inquiry.id
    });
    return;
  });

});

// app.post('/lists/:id/subscribe', lists.subscribe);

app.post('/editItem', function(req, res) {
  var photoUrl = req.body.photoUrl;
  var itemPrice = req.body.price;
  var description = req.body.description;
  var serving = req.body.serving;
  var type = req.body.type;
  var availability = req.body.availability;
  var dateStart = req.body.dateStart;
  var dateEnd = req.body.dateEnd;

  console.log(req.body);

  var itemId = mongoose.Types.ObjectId(req.body.id);

  Item.update({
    _id: itemId
  }, {
    $set: {
      photoUrl: photoUrl,
      price: itemPrice,
      description: description,
      serving: serving,
      type: type,
      availability: availability,
      dateStart: dateStart,
      dateEnd: dateEnd
    }
  }, function(err, numAffected) {
    if (err) {
      res.status(401).send();
    }

    res.status(200).send();
    return;
  });

});

app.post('/editUser', function(req, res) {

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

  var contact1 = req.body.editFields.contact1;
  var address1 = req.body.editFields.address1;
  var address2 = '';
  var address3 = '';
  var subscribed = false;

  if (req.body.editFields.address2) address2 = req.body.editFields.address2;
  if (req.body.editFields.address3) address3 = req.body.editFields.address3;

  var itemId = mongoose.Types.ObjectId(payload.sub);

  User.update({
    _id: itemId
  }, {
    $set: {
      contact1: contact1,
      address1: address1,
      address2: address2,
      address3: address3
    }
  }, function(err, numAffected) {
    if (err) {
      console.log(err);
      res.status(401).send();
    }

    res.status(200).send();
    return;
  });

});

app.post('/sendMessage', function(req, res) {
  var name = req.body.name;
  var message = req.body.message;
  var email = req.body.email;
  var phone = req.body.phone;
  var replied = false;
  var date = req.body.date;

  var user = req.body;
  var searchUser = {
    name: name
  };

  //BUSINESS RULE - they can't send to us without being registered users first?
  // User.findOne(searchUser, function(err, user) {

  //   if (!user) {
  //     res.status(401).send({
  //       message: 'User not found!'
  //     });
  //     return;
  //   }
  // });

  var newMessage = new Message({
    name: name,
    date: date,
    message: message,
    email: email,
    phone: phone,
    replied: replied
  });

  newMessage.save(function(err) {

    //createSendToken(newMessage, res);
    return;
  });

    // login
var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));

// send mail
  transporter.sendMail({
    from: 'hil123rami@gmail.com',
    to: 'richfabros@jwmgi.com',
    subject: 'Sent Message',
    text: message
  }, function(err, response) {
    console.log(err || response.response);
  });
    
    
  //mailing functionality
//  var nodemailer = require('nodemailer');
//  var transporter = nodemailer.createTransport({
//    service: 'gmail',
//    auth: {
//      user: 'hil123rami@gmail.com',
//      pass: '123P@ssw0rd'
//    }
//  });
//  transporter.sendMail({
//    from: 'hil123rami@gmail.com',
//    to: 'richfabros@jwmgi.com',
//    subject: 'Sent Message',
//    text: message
//  }, function(err, response) {
//    console.log(err || response.response);
//  });


  // var campaignID;

  // var campaign = api.call('campaigns', 'list', { filters: {subject:'testCamp'} }, function (error, data) {
  //       if (error)
  //           console.log(error.message);
  //       else
  //           console.log(JSON.stringify(data)); // Do something with your data!
  //         campaignID = data.data[0].id;

  //     api.call('campaigns', 'send', { cid: campaignID}, function (error, data) {
  //         if (error)
  //             console.log(error.message);
  //         else
  //             console.log(JSON.stringify(data)); // Do something with your data!
  //     });
  // });




});

app.post('/subscriber', function(req, res) {

  var subscribed = true;

  var user = req.body.name;
  var email = req.body.email;

  // var searchUser = {
  //   email: email
  // };

  // User.findOne(searchUser, function(err, user) {

  //   if (user) {
  //     res.status(401).send({
  //       message: 'Email already used by another account'
  //     });
  //     return;
  //   }
  // });

  var newUser = new User({
    name: user,
    email: email,
    contact1: '',
    password: '',
    address1: '',
    subscribed: true,
    role: 'user'
  })

  newUser.save(function(err) {
    createSendToken(newUser, res);
  });

  api.call('lists', 'subscribe', {
    id: '776869c525',
    email: {
      email: newUser.email
    },
    double_optin: false
  }, function(error, data) {
    if (error)
      console.log(error.message);
    else
      console.log(JSON.stringify(data)); // Do something with your data!
  });

});

app.get('/items', function(req, res) {
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

  Item.find().lean().exec(function(err, items) {
    if (err) return console.error(err);
    //  console.log(items);

    res.json(items);
    return;
  });

})


app.get('/getItemsByCity/:cityCode', function(req, res) {
  console.log(req.body);
  var cityCode = req.params.cityCode;

  Item.find({
    city: cityCode
  }, function(err, items) {
    if (err) return console.error(err);
    //console.log(items);
    //   console.log(typeCode);
    res.json(items);
    return;
  });

})

app.get('/getItemsByRentalType/:rentalType', function(req, res) {
  console.log(req.body);
  var rentalType = req.params.rentalType;

  if (rentalType == "shortTerm") {
    getItemsBy('forShortTerm');  
  } else if (rentalType == 'longTerm') {

    var temp = true;
  
  Item.find({
      forLongTerm: temp
    }, function(err, items) {
      if (err) return console.error(err);
      return res.json(items);
  });  

    //getItemsBy({'forLongTerm': true});  
  } else {
    getItemsBy('forSale');
  } 

})


//Gets Items according to specificparameter
//TODO: make this generalized
function getItemsBy( parameterObject ) {

  //var stringParam = parameterObject.toString();
  Item.find(parameterObject, function(err, items) {
    if (err) return console.error(err);
    return items;
  });  

};

var mealTypes = [{
  title: "Main",
  typeCode: 'main',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/roastchicken.jpg'
}, {
  title: "Drink",
  typeCode: 'drink',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/lemonade.png'
}, {
  title: "Extra",
  typeCode: 'extra',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/cup.jpg'
}, {
  title: "Side",
  typeCode: 'side',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/dessert.jpg'
}, {
  title: "Appetizer",
  typeCode: 'appetizer',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/salad.jpg'
}, {
  title: "Snack",
  typeCode: 'snack',
  thumb: 'https://skitchen-s3bucket.s3.amazonaws.com/pancit.jpg'
}];

app.get('/typeOfMeals', function(req, res) {
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


  res.json(mealTypes);
  return;

})

var availabilityTypes = [{
  title: "Breakfast",
  typeCode: 'breakfast'
}, {
  title: "Lunch",
  typeCode: 'lunch'
}, {
  title: "Merienda",
  typeCode: 'snacktime'
}, {
  title: "Dinner",
  typeCode: 'dinner'
}, {
  title: "Late night",
  typeCode: 'midnight'
}];

app.get('/typeOfAvailability', function(req, res) {
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


  res.json(availabilityTypes);
  return;

})

app.post('/userInfo', function(req, res) {
  if (!req.headers.authorization) {

    console.log("You are not authorized, please login, to get user info");
    return res.status(401).send({
      message: 'You are not authorized, please login'
    });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shh..");

  if (!payload.sub) {

    console.log("You are not authorized, please login, to get user info");
    res.status(401).send({
      message: 'Authentication failed'

    });
  }

  var userId = mongoose.Types.ObjectId(payload.sub);
  User.findById(userId, function(err, foundUser) {
    //        console.log("payload:"+payload.sub);
    //    console.log("foundUser:"+foundUser);
    if (foundUser) {
      //                console.log(foundUser);
      res.status(200).send({
        user: foundUser
      });
    }
  })




})

function buildOrder(orders) {
  var deferred = q.defer();
  var i = 0;
  var successCounter = 0;
  var totalPrice = 0;
  var lunchTotal = 0;
  var dinnerTotal = 0;
  var breakfastTotal = 0;
  var snackTotal = 0;
  var midnightTotal = 0;
  var dates = {};
  var payload = {
    dates: dates,
    totalPrice: 0,
    totalTax: 0.00
  }
  for (i = 0; i < orders.length; ++i) {

    var origDate = new Date(orders[i].date);
    var userDate = origDate.toDateString();

    if (!dates[userDate]) {
      var structure = {
        date: orders[i].date,
        userDate: userDate,
        lunchTotal: lunchTotal,
        dinnerTotal: dinnerTotal,
        breakfastTotal: breakfastTotal,
        snackTotal: snackTotal,
        midnightTotal: midnightTotal,
        content: {
          lunch: {
            orders: []
          },
          dinner: {
            orders: []
          },
          breakfast: {
            orders: []
          },
          snack: {
            orders: []
          },
          midnight: {
            orders: []
          }
        }
      };

      dates[orders[i].date] = structure;
    }
  }

  var uniqueItemIds = [];
  var mealDetailsFlatList = [];
  for (i = 0; i < orders.length; ++i) {
    var itemId = orders[i].itemInfo._id;

    var mealDetails = {
      id: itemId,
      name: '',
      description: '',
      photoUrl: '',
      price: ''
    };

    mealDetailsFlatList.push(mealDetails);

    if (uniqueItemIds.indexOf(itemId) == -1) {
      uniqueItemIds.push(itemId);
    }

    if (orders[i].availability.typeCode == 'lunch') {
      if (dates[orders[i].date]) {
        dates[orders[i].date].content.lunch.orders.push(mealDetails);
      }
    }
    if (orders[i].availability.typeCode == 'dinner') {
      if (dates[orders[i].date]) {
        dates[orders[i].date].content.dinner.orders.push(mealDetails);
      }
    }
    if (orders[i].availability.typeCode == 'breakfast') {
      if (dates[orders[i].date]) {
        dates[orders[i].date].content.breakfast.orders.push(mealDetails);
      }
    }
    if (orders[i].availability.typeCode == 'snack') {
      if (dates[orders[i].date]) {
        dates[orders[i].date].content.snack.orders.push(mealDetails);
      }
    }
    if (orders[i].availability.typeCode == 'midnight') {
      if (dates[orders[i].date]) {
        dates[orders[i].date].content.midnight.orders.push(mealDetails);
      }
    }
  }

  var j = 0;
  for (j = 0; j < uniqueItemIds.length; j++) {
    var mealId = mongoose.Types.ObjectId(uniqueItemIds[j]);
    Item.findById(mealId, function(err, meal) {
      var index = 0;
      for (var key in dates) {

        var mealDetails = {
          id: meal._id.toString(),
          name: meal.name,
          description: meal.description,
          photoUrl: meal.photoUrl,
          price: meal.price
        };

        var mealIndex = 0;
        for (mealIndex = 0; mealIndex < dates[key].content.breakfast.orders.length; mealIndex++) {
          if (dates[key].content.breakfast.orders[mealIndex].id == mealDetails.id) {
            dates[key].content.breakfast.orders[mealIndex].name = mealDetails.name;
            dates[key].content.breakfast.orders[mealIndex].description = mealDetails.description;
            dates[key].content.breakfast.orders[mealIndex].photoUrl = mealDetails.photoUrl;
            dates[key].content.breakfast.orders[mealIndex].price = mealDetails.price;
            dates[key].breakfastTotal += parseFloat(mealDetails.price);
            totalPrice += parseFloat(mealDetails.price);
          }
        }

        for (mealIndex = 0; mealIndex < dates[key].content.lunch.orders.length; mealIndex++) {
          if (dates[key].content.lunch.orders[mealIndex].id == mealDetails.id) {
            dates[key].content.lunch.orders[mealIndex].name = mealDetails.name;
            dates[key].content.lunch.orders[mealIndex].description = mealDetails.description;
            dates[key].content.lunch.orders[mealIndex].photoUrl = mealDetails.photoUrl;
            dates[key].content.lunch.orders[mealIndex].price = mealDetails.price;
            dates[key].lunchTotal += parseFloat(mealDetails.price);
            totalPrice += parseFloat(mealDetails.price);
          }
        }

        for (mealIndex = 0; mealIndex < dates[key].content.dinner.orders.length; mealIndex++) {
          if (dates[key].content.dinner.orders[mealIndex].id == mealDetails.id) {
            dates[key].content.dinner.orders[mealIndex].name = mealDetails.name;
            dates[key].content.dinner.orders[mealIndex].description = mealDetails.description;
            dates[key].content.dinner.orders[mealIndex].photoUrl = mealDetails.photoUrl;
            dates[key].content.dinner.orders[mealIndex].price = mealDetails.price;
            dates[key].dinnerTotal += parseFloat(mealDetails.price);
            totalPrice += parseFloat(mealDetails.price);
          }
        }

        for (mealIndex = 0; mealIndex < dates[key].content.snack.orders.length; mealIndex++) {
          if (dates[key].content.snack.orders[mealIndex].id == mealDetails.id) {
            dates[key].content.snack.orders[mealIndex].name = mealDetails.name;
            dates[key].content.snack.orders[mealIndex].description = mealDetails.description;
            dates[key].content.snack.orders[mealIndex].photoUrl = mealDetails.photoUrl;
            dates[key].content.snack.orders[mealIndex].price = mealDetails.price;
            dates[key].snackTotal += parseFloat(mealDetails.price);
            totalPrice += parseFloat(mealDetails.price);
          }
        }

        for (mealIndex = 0; mealIndex < dates[key].content.midnight.orders.length; mealIndex++) {
          if (dates[key].content.midnight.orders[mealIndex].id == mealDetails.id) {
            dates[key].content.midnight.orders[mealIndex].name = mealDetails.name;
            dates[key].content.midnight.orders[mealIndex].description = mealDetails.description;
            dates[key].content.midnight.orders[mealIndex].photoUrl = mealDetails.photoUrl;
            dates[key].content.midnight.orders[mealIndex].price = mealDetails.price;
            dates[key].midnightTotal += parseFloat(mealDetails.price);
            totalPrice += parseFloat(mealDetails.price);
          }
        }



        //            console.log(successCounter);
        //            console.log(orders);


      }
      ++successCounter;
      console.log("WHAT THE");
      console.log(dates);

      if (successCounter >= uniqueItemIds.length) {
        console.log('FUCK');
        console.log(dates);
        payload.totalPrice = totalPrice;
        payload.totalTax = parseFloat(payload.totalPrice) * 0.12;
        payload.dates = dates;
        deferred.resolve(payload);
      }
    });




  }
  return deferred.promise;
}

app.post('/order', function(req, res) {
  //  if (!req.headers.authorization) {
  //
  //    console.log("You are not authorized, please login, to get user info");
  //    return res.status(401).send({
  //      message: 'You are not authorized, please login'
  //    });
  //  }
  //  var token = req.headers.authorization.split(' ')[1];
  //  var payload = jwt.decode(token, "shh..");
  //
  //  if (!payload.sub) {
  //
  //    console.log("You are not authorized, please login, to get user info");
  //    res.status(401).send({
  //      message: 'Authentication failed'
  //
  //    });
  //  }


  buildOrder(req.body.orders).then(function(payload) {
      console.log("IHO DE PUTA");
      var dates = payload.dates;
      console.log(dates);
      var orders = [];

      for (var key in dates) {
        console.log(dates[key]);
        var order = {
          date: '',
          lunch: {},
          dinner: {},
          breakfast: {},
          snack: {},
          midnight: {},
          midnightTotal: 'XXX',
          lunchTotal: 'XXX',
          breakfastTotal: 'XXX',
          dinnerTotal: 'XXX',
          snackTotal: 'XXX'
        }

        if (dates[key]) {
          order.date = dates[key].date;
          order.userDate = dates[key].userDate;
          order.lunch = JSON.stringify(dates[key].content.lunch.orders);
          order.dinner = JSON.stringify(dates[key].content.dinner.orders);
          order.breakfast = JSON.stringify(dates[key].content.breakfast.orders);
          order.snack = JSON.stringify(dates[key].content.snack.orders);
          order.midnight = JSON.stringify(dates[key].content.midnight.orders);
          order.midnightTotal = dates[key].midnightTotal;
          order.lunchTotal = dates[key].lunchTotal;
          order.breakfastTotal = dates[key].breakfastTotal;
          order.snackTotal = dates[key].snackTotal;
          order.dinnerTotal = dates[key].dinnerTotal;


          orders.push(order);
        }
      }

      var i = 0;

      //      for (i = 0; i < dates.length; i++) {
      //
      //      }

      res.send({
        totalPrice: payload.totalPrice,
        totalTax: payload.totalTax,
        dates: orders
      });
    },
    function(err) {
      res.status(401).send("ERROR KA");
    });
})

app.post('/isAdmin1', function(req, res) {
  if (!req.headers.authorization) {

    console.log("You are not authorized, please login, to get user info");
    return res.status(401).send({
      message: 'You are not authorized, please login'
    });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shh..");

  if (!payload.sub) {

    console.log("You are not authorized, please login, to get user info");
    res.status(401).send({
      message: 'Authentication failed'

    });
  }

  if (payload.type === 'admin' || payload.type === 'superadmin') {
    res.status(200).send({
      result: true
    });
  }

  res.status(401).send({
    result: false
  });
})

app.post('/isAdmin2', function(req, res) {
  if (!req.headers.authorization) {

    console.log("You are not authorized, please login, to get user info");
    return res.status(401).send({
      message: 'You are not authorized, please login'
    });
  }
  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, "shh..");

  if (!payload.sub) {

    console.log("You are not authorized, please login, to get user info");
    res.status(401).send({
      message: 'Authentication failed'

    });
  }

  if (payload.type === 'superadmin') {
    res.status(200).send({
      result: true
    });
  }

  res.status(401).send({
    result: false
  });
})

app.get('/getUnit', function(req, res) {
  var stringId = req.query.q;
  var mealId = mongoose.Types.ObjectId(stringId);
  Item.findById(mealId, function(err, foundMeal) {

    if (foundMeal) {
      var foundMealView = {};
      foundMealView._id = foundMeal._id.toString();
      foundMealView.name = foundMeal.name;
      foundMealView.address = foundMeal.address;
      foundMealView.size = foundMeal.size;
      foundMealView.bathroomCount = foundMeal.bathroomCount;
      foundMealView.powderCount = foundMeal.powderCount;
      foundMealView.bedroomCount = foundMeal.bedroomCount;
      foundMealView.photos = foundMeal.photos;
      console.log(foundMealView);
      res.status(200).send(foundMealView);
      return;
    }

    console.log(foundMealView);
    res.status(200).send(foundMealView);
  });
});


app.get('/getRent', function(req, res) {
  var stringId = req.query.q;
  Rent.findOne({
    unitId: stringId
  }, function(err, foundRent) {
    res.status(200).send(foundRent)
  });
})

app.post('/auth/google/auth/google', function(req, res) {

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
      User.findOne({
        googleId: profile.sub
      }, function(err, foundUser) {
        if (foundUser)
          return createSendToken(foundUser, res);

        var newUser = new User();
        newUser.googleId = profile.sub;
        newUser.email = profile.email;
        newUser.name = profile.name;
        newUser.save(function(err) {
          if (err) return next(err);
          createSendToken(newUser, res);
        });

      })
    });

  });
})

mongoose.connect('mongodb://jwmgiadmin:WYNE012!!!@ds041561.mongolab.com:41561/jwmgi');

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
