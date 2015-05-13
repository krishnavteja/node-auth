///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/express/express.d.ts"/>

// =======================
// get the packages we need ============
// =======================
import * as express from "express";
var app: express.Express = express();

import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as mongoose from "mongoose";

import * as jwt from "jsonwebtoken"; // used to create, sign, and verify tokens
import { config } from "./config"; // get our config file
import { User } from "./app/models/user"; // get our mongoose model
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/',(req, res) => {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
app.get('/setup', (req, res) => {
    
  // create a sample user
  var newUser = new User({ 
    email: 'ktvonline@live.com',
    displayName: 'Krishna V', 
    password: 'P@ssword1',
    admin: true 
  });

  // save the sample user
  newUser.save((err) => {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
 });
 
});

// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', (req, res) => {

  // find the user
  User.findOne({
    email: req.body.email
  }, (err, user) => {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

// route middleware to verify a token
apiRoutes.use((req:any, res, next) => {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), (err, decoded) => {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
});  

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.delete('/users', (req, res) => {
  User.find({}).remove((err, delRes) =>{
    res.json({ message: 'Deleted successfully.'});
  })
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);



// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
