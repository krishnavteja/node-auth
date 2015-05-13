///<reference path="typings/node/node.d.ts"/>
///<reference path="typings/express/express.d.ts"/>
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var config_1 = require("./config");
var user_1 = require("./app/models/user");
var port = process.env.PORT || 8080;
mongoose.connect(config_1.config.database);
app.set('superSecret', config_1.config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
app.get('/setup', function (req, res) {
    var newUser = new user_1.User({
        email: 'ktvonline@live.com',
        displayName: 'Krishna V',
        password: 'P@ssword1',
        admin: true
    });
    newUser.save(function (err) {
        if (err)
            throw err;
        console.log('User saved successfully');
        res.json({ success: true });
    });
});
var apiRoutes = express.Router();
apiRoutes.post('/authenticate', function (req, res) {
    user_1.User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else if (user) {
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
            else {
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});
apiRoutes.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});
apiRoutes.get('/users', function (req, res) {
    user_1.User.find({}, function (err, users) {
        res.json(users);
    });
});
apiRoutes.delete('/users', function (req, res) {
    user_1.User.find({}).remove(function (err, delRes) {
        res.json({ message: 'Deleted successfully.' });
    });
});
app.use('/api', apiRoutes);
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
//# sourceMappingURL=server.js.map