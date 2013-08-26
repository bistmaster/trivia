var db = require('../models/trivia');

var trivia = new db.Trivia({host: '127.0.0.1', name: 'trivia' , db: 'trivia'});

module.exports = function() { 
	
	this.getIndex = function(req, res) {
		var data = { title: 'Online Real-time Trivia'};
		res.render('index', data);
	};

	this.postLogin = function(req, res) {
		var data = {name: 'Sample Site1'};
		res.render('login', data);
	};

	this.postRegister = function(req, res) {
		var data = {name: 'Sample Site2'};
		console.log('Called here');
		trivia.saveUser({}, function(err, record){
			if(!err){
				res.render('index', r);
			} else {
				res.statusCode = 500;
				res.end('something is wrong');
			}
		});	
	};

	this.getLogout = function(req, res) {
		var data = {title: 'Sample Site4'};
		res.render('register', data);
	};

}
