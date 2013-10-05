module.exports = function(sio, chat_server, _, bot){
	var io = sio.listen(chat_server);
	var initialize = 0;
	io.sockets.on('connection', function (client) {
		console.log(client);
		bot.connect();  
		client.on('join', function(name){
	  	bot.greet(name);
	  	client.set('nickname', name);
	  	client.emit('addown', {name: name});
	  	initialize++;
	  	if(initialize == 1)
	  		bot.startTrivia();
	  });

	  client.on('newuser', function(data){
	  	client.broadcast.emit('adduser', data);
	  });

	  client.on('newuserjoin', function(data){
	  	client.broadcast.emit('adduserclient', data);
	  });

	  client.on('message', function (data) {
	  	if(data.message == 'start'){

	  	}
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

	  client.on('disconnect', function(data){
	  	console.log('disconected');
	  	client.get('nickname', function(err, username){
	  		console.log(username);
	  		client.broadcast.emit('removeuser', {name: username});
	  	});
	  });

	});
};