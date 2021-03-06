
var express = require('express');
var util = require('util')
var	_ = require('underscore');
var sio = require('socket.io');
var http = require('http');
var	mongoose = require('mongoose');
var crypto = require('crypto');
var flash = require('connect-flash');
var fs = require('fs');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string'); 

var	passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var UserRoutes = require('./routes/user');
var QuestionRoutes = require('./routes/user');
var HelperRoutes = require('./routes/helper');
var User = require('./models/user');
var Question = require('./models/question');
var clientio = require('socket.io-client');

var	userModel= new User(mongoose, crypto);
var	questionModel = new Question(mongoose, crypto);

var user = new UserRoutes(passport, LocalStrategy, _, userModel);
var question = new QuestionRoutes(passport, LocalStrategy, _, questionModel);
var helper = new HelperRoutes();
var config = {  dbPath : 'mongodb://127.0.0.1/trivia', 
				http_port : 9999, 
				FB_CREDENTIALS : {
					clientID : "515120998569772",
					clientSecret : "4f94374127d7362bd1178cf9fabc20fd",
					callbackURL : "/auth/facebook"
				},
				chat :{
					port : 9090,
					host: "http://192.168.1.110"
				}
			};

var app = express();
var chat_server = http.createServer(app).listen(config.chat.port);
var Bot = require('./routes/bot');
var trivia_bot = new Bot(clientio, fs, config.chat);
var chat = require('./routes/chat')(sio, chat_server, _, trivia_bot);

app.configure(function () {

	passport.serializeUser(function(user, done) {
	    done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	    done(null, user);
	});	

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

	//Login using saved users
	passport.use(new LocalStrategy(user.setAuthenticationLocal));
	// Login using facebook
	passport.use(new FacebookStrategy(config.FB_CREDENTIALS, user.setAuthenticationFacebook));

	mongoose.connect(config.dbPath, function onMongooseError(err){
		if (err instanceof Error) throw err;
		console.log('Connected to db');
	});

});	



app.post('/login', passport.authenticate('local', helper.redirect));
app.get('/auth/facebook', passport.authenticate('facebook', helper.redirect));

// Handle all the user interaction routes
app.get('/', user.getIndex);
app.get('/login', user.getLogin);
app.post('/register', user.postRegister);
app.post('/update', user.postUpdate);
app.get('/home', user.isAuthenticated, user.getHome);
app.get('/logout', user.getLogout);

//Redirect user if url is not found
app.get('/*', helper.index);


app.listen(config.http_port, function(){
	console.log('Listening on localhost:' + config.http_port); 
});

