//Model for Questions
module.exports = function(mongoose, crypto) {

	var QuestionSchema = new mongoose.Schema({ question: String, answer: String, id: Number, date_register: { type: Date, default: Date.now } });
	var Question = mongoose.model('Question', QuestionSchema);
	var self = this;

	self.saveQuestion = function(query, callback) {
		var hash = crypto.createHash('sha256');
		hash.update(query.password);
		var question = new Question();
		question.firstname = query.firstname;
		question.lastname = query.lastname;
		question.email = query.email;
		question.username = query.username;
		question.password = hash.digest('hex');
		question.save(function(err) {
			if(err){
				return callback(new Error('Cannot save to database'), false);
			} else {
				return callback(user, true);
			}
		});
	};

	self.findQuestion = function(id, callback) {
		var hash = crypto.createHash('sha256');
		hash.update(password);
		var hashPassword = hash.digest('hex');		
		Question.findOne({id: id, password: hashPassword}, function(err, user){
			if(err) { 
				callback(err, false); 
			} else {  			
				callback(null, user);
			}
		});
	};

	self.updateQuestion = function(id, query){
		//User.findAndModify(_id: id,)
	};

	self.deleteQuestion = function(id){

	};

	
}
