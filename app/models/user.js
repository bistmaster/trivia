// Model for User
module.exports = function(mongoose, crypto) {

	var UserSchema = new mongoose.Schema({ firstname: String, lastname: String, email: String, username: String, password: String, id: Number, date_register: { type: Date, default: Date.now } });
	var User = mongoose.model('User', UserSchema);
	var self = this;

	self.saveUser = function(query, callback) {
		var hash = crypto.createHash('sha256');
		var user = new User();
		user.firstname = query.firstname;
		user.lastname = query.lastname;
		user.email = query.email;
		user.username = query.username;
		user.password = hash.update(query.password).digest('hex');
		user.save(function(err) {
			if(err){
				return callback(new Error('Cannot save to database'), false);
			} else {
				return callback(true, user);
			}
		});
	};

	self.findUser = function(username, password, callback) {
		var hash = crypto.createHash('sha256');
		var hashPassword = hash.update(password).digest('hex');		
		User.findOne({username: username, password: hashPassword}, function(err, user){
			if(err) { 
				callback(err, false); 
			} else {  			
				callback(null, user);
			}
		});
	};

	self.updateUser = function(id, query){
		//User.findAndModify(_id: id,)
	};

	self.deleteUser = function(id){

	};

	
}
