module.exports = function(clientio, fs, config) {
	var self = this;
	var name, socket, answer, interval_id;

	self.connect = function() {
		this.answer = '';
		this.name = 'BotNode';
		this.socket = clientio.connect( config.host, {port: config.port}); 	
		this.socket.on('connect', function(){ 
			this.socket.emit('join', this.name);
			console.log('bot connected');
		});		
	};

	self.sendMessage = function(name){
		this.socket.emit('messagebot', { name: this.name, message: "This is from the bot " + name});
	};

	self.checkAnswer = function(data){
		console.log('Interval id ' + this.interval_id);
		if(this.answer == data.answer){
			this.socket.emit('messagebot', { name: this.name, message: "You got it right " + data.name + "!"});
			clearInterval(this.interval_id);
		}
	};

	self.greet = function(name){
		this.socket.emit('greetbot', {name : this.name, message: 'Hi ' + name + '!, How are you doing? I am going to start asking questions in few seconds from now. Good Luck!', client_name: name});
	};

	self.startTrivia = function(){
		var self = this;
		var id = setInterval(function() {
			var correct_answer = "lapu-lapu";
			self.setAnswer(correct_answer);
			self.socket.emit('trivia', {name: self.name ,question : "Who killed Magellan? ", answer: self.answer , points: 5});
		}, 50000);

		self.setIntervalId(id);
	};

	self.setAnswer = function(correctAnswer) {
		this.answer = correctAnswer;
	};

	self.setIntervalId = function(id){
		this.interval_id = id;
	}

}