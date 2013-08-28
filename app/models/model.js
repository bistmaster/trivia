
module.exports = function(mongoose, crypto) {

	var UserSchema = new mongoose.Schema({ firstname: String, lastname: String, email: String, username: String, password: String, id: Number, date_register: { type: Date, default: Date.now } });
	var QuestionSchema = new mongoose.Schema({ question: String, answer: String, id: Number, date_register: { type: Date, default: Date.now } });
	var User = mongoose.model('User', UserSchema);
	var Question = mongoose.model('Question', QuestionSchema);
	var self = this;

	self.saveUser = function(query, callback) {
		var hash = crypto.createHash('sha256');
		hash.update(query.password);
		var user = new User();
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
	};

	self.findUser = function(username, password, callback) {
		var hash = crypto.createHash('sha256');
		hash.update(password);
		var hashPassword = hash.digest('hex');		
		User.findOne({username: username, password: hashPassword}, function(err, user){
			if(err) { 
				callback(err, false); 
			} else {  			
				callback(null, user);
			}
		});
	};
}
