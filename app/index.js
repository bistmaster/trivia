
var express = require('express'),
	expressValidator = require('express-validator');
	passport = require('passport'),
 	LocalStrategy = require('passport-local').Strategy,
 	crypto = require('crypto');
 	Render = require('./routes/routes'),
 	app = express(),
 	routes = new Render(passport, LocalStrategy);

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
});	




app.get('/', routes.getIndex);
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}), routes.postLogin);
app.post('/register', routes.postRegister);


app.listen(9333, function(){
	console.log('Listening on localhost:9292');
})