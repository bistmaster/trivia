// Model for User
module.exports = function(mongoose, crypto) {

	var UserSchema = new mongoose.Schema({ _id: Number, firstname: String, lastname: String, email: String, username: String, password: String, id: Number, date_register: { type: Date, default: Date.now } });
	var User = mongoose.model('User', UserSchema);
	var self = this;

	self.saveUser = function(query, callback) {
		var user = new User();
		user.firstname = query.firstname;
		user.lastname = query.lastname;
		user.email = query.email;
		user.username = query.username;
		user.password = self.encryptPassword(query.password);
		user.save(function(err) {
			if(err){
				return callback(new Error('Cannot save to database'), false);
			} else {
				return callback(true, user);
			}
		});
	};

	self.findUser = function(username, password, callback) {	
		var hashPassword = self.encryptPassword(password);		
		User.findOne({username: username, password: hashPassword}, function(err, user){
			if(err) { 
				callback(err, false); 
			} else {  			
				callback(null, user);
			}
		});
	};

	self.findUserById = function(id, profile, callback) {
		User.findById(id, function(err, oldUser){
			if(oldUser){
			 	return callback(null, oldUser);
			} else {
				var user = new User();
				user._id = id;
				user.firstname = profile.name.givenName;
				user.lastname = profile.name.familyName;
				user.save(function onSaveError(err, newUser, number){
					if(err) {
						return callback(err);
					} else {
						return callback(null, newUser);
					}
				});
			}
		});		
	};

	self.encryptPassword = function(textPassword){
		var hash = crypto.createHash('sha256');
		return hash.update(textPassword).digest('hex');
	};

	self.updateUserById = function(id, query, callback){
		User.findByIdAndUpdate(id, { $set: query }, function(err, user){
				if(err) { return callback(err); }
				return callback(null, user);
			});
	};

	self.deleteUser = function(id){

	};

	
}
