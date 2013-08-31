
var express = require('express');
var util = require('util')
var	_ = require('underscore');
var	mongoose = require('mongoose');
var sanitize = require('validator').sanitize;
//var	expressValidator = require('express-validator');

var	passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var crypto = require('crypto');
var flash = require('connect-flash');

var UserRoutes = require('./routes/user');
var QuestionRoutes = require('./routes/user');
var HelperRoutes = require('./routes/helper');

var User = require('./models/user');
var	userModel= new User(mongoose, crypto, sanitize);

var Question = require('./models/question');
var	questionModel = new Question(mongoose, crypto, sanitize);

var user = new UserRoutes(passport, LocalStrategy, _, userModel, sanitize);
var question = new QuestionRoutes(passport, LocalStrategy, _, questionModel);
var helper = new HelperRoutes();
var dbPath = 'mongodb://127.0.0.1/trivia';
var port = 9999;

var FB_CREDENTIALS = {
		clientID : "515120998569772",
		clientSecret : "4f94374127d7362bd1178cf9fabc20fd",
		callbackURL : "/auth/facebook/callback"
}		

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var app = express();
app.configure(function () {
	app.set('view engine', 'ejs'); 
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public/'));
	app.use(express.logger('dev'));
	app.use(express.cookieParser());		
	app.use(express.bodyParser());
	//app.use(expressValidator());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);	
	
	mongoose.connect(dbPath, function onMongooseError(err){
		if (err) throw err;
		console.log('Connected to db');
	});

});	

//Login using saved users
passport.use(new LocalStrategy(user.setAuthenticationLocal));
app.post('/login', passport.authenticate('local', helper.redirect));
// Login using facebook
passport.use(new FacebookStrategy(FB_CREDENTIALS, user.setAuthenticationFacebook));
app.get('/auth/facebook/callback', passport.authenticate('facebook', helper.redirect));

// Handle all the user interaction routes
app.get('/', user.getIndex);
app.get('/login', user.getLogin);
app.post('/register', user.postRegister);
//app.post('/update/:id', )
app.get('/home', user.isAuthenticated, user.getHome);
app.get('/logout', user.getLogout);


//handle unavailable site
app.get('/*', helper.index);


app.listen(port, function(){
	console.log('Listening on localhost:' + port); 
});

