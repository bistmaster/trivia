var mongoose = require('mongoose');
var crypto = require('crypto');

exports.Trivia = Trivia;

function Trivia(options){
	this.name = options.name;
	this.host = options.host;
	this.db = options.db;
	this.connected = false;
	if (this.connect()) {
		console.log('model and schema created');

		
	}														
}

Trivia.prototype.connect = function() {
	var self = this;
	mongoose.connect('mongodb://127.0.0.1/trivia');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log('DB connected');
		self.connected = true;
		self.Schema = mongoose.Schema;
		self.UserSchema = new self.Schema({ firstname: String, lastname: String, email: String, username: String, password: String, id: Number, date_register: { type: Date, default: Date.now } });
		self.QuestionSchema = new self.Schema({ question: String, answer: String, id: Number, date_register: { type: Date, default: Date.now } });	
		self.User = mongoose.model('User', self.UserSchema);
		self.Question = mongoose.model('Question', self.QuestionSchema);	  
	});

	return self.connected;
};

Trivia.prototype.saveUser = function(query, callback) {
	var self = this;
	console.log('connection is ' + this.connected);
	if(this.connected){
		var hash = crypto.createHash('sha256');
		hash.update(query.password);

		var user = new self.User();
		user.firstname = query.firstname;
		user.lastname = query.lastname;
		user.email = query.email;
		user.username = query.username;
		user.password = hash.digest('hex');
		user.save(function(err) {
			if(err){
				return callback(new Error('Cannot save to database'), false);
			} else {
				return callback(user, true);
			}
		});
	} else {
		return callback(new Error('Cannot save to database'), false);
	}
};

Trivia.prototype.findUser = function(username, password, callback) {
	var self = this;
	if(this.connected){
		var hash = crypto.createHash('sha256');
		hash.update(password);
		var hashPassword = hash.digest('hex');		
		self.User.findOne({username: username, password: hashPassword}, function(err, user){
			if(err) { 
				callback(err, false); 
			} else {  			
				callback(null, user);
			}
		});
	} else {
		callback(new Error('Cannot save to database'), false);
	}
};


Trivia.prototype.deleteUser = function(first_argument) {
	// body...
};

Trivia.prototype.getUser = function(first_argument) {
	// body...
};

Trivia.prototype.getQuestion = function(first_argument) {
	// body...
};

Trivia.prototype.saveQuestion = function(first_argument) {
	// body...
};

Trivia.prototype.getQuestion = function(first_argument) {
	// body...
};

Trivia.prototype.deleteQuestion = function(first_argument) {
	// body...
};

Trivia.prototype.callbackHandler = function(err, data) {
	// body...
};