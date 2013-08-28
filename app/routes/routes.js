var db = require('../models/trivia'),
 	_ = require('underscore'),
 	trivia = new db.Trivia({host: '127.0.0.1', name: 'trivia' , db: 'trivia'});

module.exports = function(passport, LocalStrategy) { 
	var self = this;

	self.setAuthentication = function (username, password, done) {
		trivia.findUser(username, password, function (err, user) {
			if (err instanceof Error) { 
				return done(err); 
			}
			return done(user, null);
		});
	};

	self.getIndex = function (req, res) {
		var data = { title: 'Online Real-time Trivia'};
		res.render('index', data);
	};

	self.postLogin = function (req, res) {
		var data = {name: 'Sample Site1'};
		res.render('index', data);
	};

	self.postRegister = function (req, res) {
		self.sanitize(req);
		trivia.saveUser(req.body, function(err, record){
			if(err instanceof Error){
				res.statusCode = 500;
				res.end('Something is wrong');			
			} else {
				res.redirect('/');
			}
		});
	};

	self.getLogin = function (req, res) {
		console.log('redirected here');
		var data = {title: 'Login'};
		res.render('login', data);
	};

	self.getLogout = function (req, res) {
		var data = {title: 'Sample Site4'};
		res.render('register', data);
	};

	self.sanitize = function (req) {
		_.each(req.body, function(elem, idx){	
			return req.sanitize(elem).xss(true);
		});		
	}; 

	self.authenticate = function () {
		passport.authenticate('local', { successRedirect: 'www.google.com', failureRedirect: '/loginadad', failureFlash: true });
	};
}
