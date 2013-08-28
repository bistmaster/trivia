
var express = require('express');
var	_ = require('underscore');
var	mongoose = require('mongoose');
var	expressValidator = require('express-validator');
var	passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var flash = require('connect-flash');

var UserRoutes = require('./routes/user');
var QuestionRoutes = require('./routes/user');

var User = require('./models/user');
var	userModel= new User(mongoose, crypto);

var Question = require('./models/question');
var	questionModel = new Question(mongoose, crypto);

var user = new UserRoutes(passport, LocalStrategy, _, userModel);
var question = new QuestionRoutes(passport, LocalStrategy, _, questionModel);

var dbPath = 'mongodb://127.0.0.1/trivia';
var port = 9999;


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
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);	
	app.use(expressValidator([]));
	

	mongoose.connect(dbPath, function onMongooseError(err){
		if (err) throw err;
		console.log('Connected to db');
	});

});	

passport.use(new LocalStrategy(user.setAuthentication));


// Handle all the user interaction routes
app.get('/', user.getIndex);
app.get('/login', user.getLogin);
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/home', failureFlash: true }));
app.post('/register', user.postRegister);
app.get('/home', user.isAuthenticated, user.getHome);
app.get('/logout', user.isAuthenticated, user.getLogout);

app.listen(port, function(){
	console.log('Listening on localhost:' + port); 
});

