module.exports = function(clientio, fs, config) {
	var self = this;
	var name, socket, answer, interval_id, answered;

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
		if(this.answer == data.answer){
			this.socket.emit('messagebot', { name: this.name, message: "You got it right " + data.name + "!"});
			this.answered = true;
		}
	};

	self.greet = function(name){
		this.socket.emit('greetbot', {name : this.name, message: 'Hi ' + name + '!, How are you doing? I am going to start asking questions in few seconds from now. Good Luck!', client_name: name});
	};

	self.startTrivia = function(){
		var self = this;
		var data = { name: self.name ,question : "Who killed Magellan? ", answer: "lapu-lapu" , points: 5 };
		this.setAnswer(data.answer);

		var count = 0;
		setInterval( function(_data) {
			count++;
			console.log('Value is : ' + self.answered + 'Count : ' + count);
			if(count == 3 || self.answered == true){
				clearInterval(self);
			}
			self.socket.emit('trivia', _data);
		}, 50000, data);

	};

	self.setAnswer = function(correctAnswer) {
		this.answer = correctAnswer;
	};

	self.setIntervalId = function(id){
		this.interval_id = id;
	}

}