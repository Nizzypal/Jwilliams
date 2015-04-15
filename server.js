var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Model Requires
var User = require('./models/user.js');
var Item = require('./models/item.js');
var Message = require('./models/message.js');

var path = require('path');
var request = require('request');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var jwt = require('./services/jwt.js');
var aws = require('aws-sdk');
var q = require('q');

var app = express();

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIAJK42ZM2U5NOUDDFQ';
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || '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';
var S3_BUCKET = process.env.S3_BUCKET || 'skitchen-s3bucket';

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
  var replied = false;
  var date = req.body.date;

  var user = req.body;
  var searchUser = {
    name: name
  };

  //BUSINESS RULE - they can't send to us without being registered users first?
  User.findOne(searchUser, function(err, user) {

    if (!user) {
      res.status(401).send({
        message: 'User not found!'
      });
      return;
    } 
  });

  var newMessage= new Message({
  name: name,
  date: date,
  message: message,
  replied: replied
  });

  newMessage.save(function(err) {

    createSendToken(newMessage, res);
    return;
  });

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

app.get('/meal', function(req, res) {
  var stringId = req.query.q;
  var mealId = mongoose.Types.ObjectId(stringId);
  Item.findById(mealId, function(err, foundMeal) {

    if (foundMeal) {
      var foundMealView = {};
      foundMealView._id = foundMeal._id.toString();
      foundMealView.name = foundMeal.name;
      foundMealView.price = foundMeal.price;
      foundMealView.photoUrl = foundMeal.photoUrl;
      foundMealView.description = foundMeal.description;
      foundMealView.serving = foundMeal.serving;
      foundMealView.dateStart = foundMeal.dateStart;
      foundMealView.dateEnd = foundMeal.dateEnd;

      for (var i = 0; i < availabilityTypes.length; i++) {
        if (availabilityTypes[i].typeCode === foundMeal.availability) {
          foundMealView.availability = availabilityTypes[i];
        }
      }

      for (var i = 0; i < mealTypes.length; i++) {
        if (mealTypes[i].typeCode === foundMeal.type) {
          foundMealView.type = mealTypes[i];
        }
      }
      console.log(foundMealView);
      res.status(200).send(foundMealView);
    }
  })
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
