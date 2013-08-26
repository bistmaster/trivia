var mongoose = require('mongoose');

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
		self.User.firstname = "bethoveen";
		self.User.lastname = "todino";
		self.User.email = "bistmaster@hotmail.com";
		self.User.username = "bistmaster@hotmail.com";
		self.User.password = "pass123";
		self.User.find({}, function(err, users){
			console.log('finding', users);	
		});
	}
};

Trivia.prototype.updateUser = function(first_argument) {
	// body...
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