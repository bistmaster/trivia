module.exports = function(clientio, fs, config) {
	var self = this;
	var name, socket, answer, interval_id, answered_correctly, idx, question ;

	self.connect = function(callback) {
		this.answer = '';
		this.intervals = [];
		this.idx = 0;
		this.name = 'BotNode';
		this.socket = clientio.connect( config.host, {port: config.port}); 	
		this.socket.on('connect', function(){ 
			this.socket.emit('join', this.name);
		});		
	};

	self.isConnected = function() {
		return this.connected;
	}

	self.sendMessage = function(name){
		this.socket.emit('messagebot', { name: this.name, message: "This is from the bot " + name});
	};

	self.checkAnswer = function(data){
		if(this.answer == data.answer && !this.answered_correctly){
			this.socket.emit('messagebot', { name: this.name, message: "You got it right " + data.name + "!"});
			this.answered_correctly = true;
		}
	};

	self.greet = function(name){
		this.socket.emit('greetbot', {name : this.name, message: 'Hi ' + name + '!, How are you doing? I am going to start asking questions in few seconds from now. Good Luck!', client_name: name});
	};

	self.startTrivia = function(){
		var self = this;
		var data = self.getQuestion();
		var count = 0;
		var intervalId = setInterval(function(question) {
			count++;
			self.setAnswer(question.answer);
			if(count >= 4 || self.answered_correctly == true){ 
				clearInterval(intervalId);			
				if(!self.answered_correctly){
					self.socket.emit('noanswer', {name: self.name, message: 'Nobody got it right. The correct answer is <b>' + self.answer + '</b>' });
				} 
				self.answered_correctly = false;
				self.idx++;
				if(self.idx == data.length)
					self.idx = 0;
				self.startTrivia();
			} else {
				self.socket.emit('trivia', question);
			}
		}, 5000, data[self.idx]);			
	};

	self.setAnswer = function(correctAnswer) {
		this.answer = correctAnswer;
	};

	self.setIntervalId = function(id){
		this.interval_id = id;
	};
	//TODO: read a file or from database
	self.getQuestion = function() {
		return [ { name: self.name , question : "Who killed Magellan? ", answer: "lapu-lapu" , points: 5 },
				{ name: self.name , question : "What is the capital city of the Phillipines? ", answer: "manila" , points: 5 },
				{ name: self.name , question : "What is the highest mountain of the world? ", answer: "mt.everest" , points: 5 },
				{ name: self.name , question : "What is the national fruit of the Philippines?  ", answer: "mango" , points: 5 },						
		];
	};
}