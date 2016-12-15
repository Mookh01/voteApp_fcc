var expressValidator = require('express-validator');
var express = require("express");
var path = require("path");
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var Localstrategy = require('passport-local').Strategy;
var app = express();
var Url = require('./models/url.js');
var bodyParser = require("body-parser");
var passport = require("passport");
var base58 = require('./base58.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://' + process.env.DATABASE_URL + process.env.DB_DOCUMENT);
//CONNECT FLASH
var flash = require('connect-flash');


//VIEW ENGINE
app.set("views", "./views");
app.set("view engine", "jade");
app.use(require("./logging.js"));

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jQuery/dist'));
app.use(express.static("node_modules/canvasjs/dist"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//PORT CONNECTION
app.set('port', (process.env.PORT || 3330))
    //EXPRESS SESSIONS
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());


//EXPRESS VALIDATOR
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());

//GLOBAL VARIABLES
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.get('/home', ensureAuthenticated, function(req, res) {
    res.render("home", { title: "Home" });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}


var authRouter = require("./auth");
app.use('/auth', authRouter);

var adminRouter = require("./admin");
app.use('/admin', adminRouter);

var chartRouter = require("./chart");
app.use('/chart', chartRouter);

var voteRouter = require("./vote");
app.use('/vote', voteRouter);

var shortenRouter = require("./shorten");
app.use('/shorten', shortenRouter);


app.listen(app.get('port'), function() {
    console.log("Node app is running on port", app.get('port'));
});