
var express = require('express');
var	_ = require('underscore');
var	mongoose = require('mongoose');
var	expressValidator = require('express-validator');
var	passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var Render = require('./routes/routes');
var app = express();
var Model = require('./models/model');
var	trivia = new Model(mongoose, crypto);
var routes = new Render(passport, LocalStrategy, _, trivia);
var dbPath = 'mongodb://127.0.0.1/trivia';
var port = 9292;

passport.use(new LocalStrategy(routes.setAuthentication));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

app.configure(function () {
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public/'));
	app.use(express.logger('dev'));	
	app.use(express.bodyParser());
	app.use( express.cookieParser());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());	
	app.use(expressValidator([]));
	app.use(app.router);

	mongoose.connect(dbPath, function onMongooseError(err){
		if (err) throw err;
		console.log('Connected to db');
	});

});	

app.get('/', routes.getIndex);
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}), routes.postLogin);
app.post('/register', routes.postRegister);

app.listen(port, function(){
	console.log('Listening on localhost:' + port);
})