module.exports = function(sio, chat_server, _, bot){
	var io = sio.listen(chat_server);
	var clients = [];
	io.sockets.on('connection', function (client) {
	bot.connect();  
	  client.on('join', function(name){
	  	client.set('nickname', name);
	  	bot.greet(name);
	  	bot.startTrivia();
	  	//clients.push(name);
	  	//client.emit('addown', {name: name});
	  	//client.broadcast.emit('add_client_list', {names: clients});
	  });

	  client.on('message', function (data) {
		client.get('nickname', function(err, name){
			client.emit('message', { message: _(data.message).stripTags(), name: name});
			bot.checkAnswer({ answer: _(data.message).stripTags(), name: name});
			client.broadcast.emit('chat', {name: name ,  message: _(data.message).stripTags()});
		});
	  });

	  client.on('messagebot', function(data){
	  	client.broadcast.emit('bot_chat', data);
	  });

	  client.on('greetbot', function(data){
	  	client.broadcast.emit('bot_greet', data);
	  });

	  client.on('trivia', function(data){
	  	client.broadcast.emit('bot_trivia', data);
	  });

	});
};