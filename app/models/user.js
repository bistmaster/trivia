// Model for User
module.exports = function(mongoose, crypto) {

	var UserSchema = new mongoose.Schema({ firstname: String, lastname: String, email: String, username: String, password: String, id: Number, date_register: { type: Date, default: Date.now } });
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
		User.findOne({_id : id}, function(err, oldUser){
			if(oldUser) { 
				callback(null, oldUser); 
			} else {
				var fbUser = new User();
				fbUser._id = new ObjectID(id);
				fbUser.firstname = profile.name.givenName;
				fbUser.lastname = profile.name.familyName;
				fbUser.save(function onSaveError(err){
					if(err) {
						return callback(new Error('Unable to save Facebook User'));
					} else {
						return callback(null, fbUser);
					}
				});
			}
		});		
	};

	self.encryptPassword = function(textPassword){
		var hash = crypto.createHash('sha256');
		return hash.update(textPassword).digest('hex');
	};

	self.updateUser = function(id, query, callback){
		User.findAndModify();
	};

	self.deleteUser = function(id){

	};

	
}
