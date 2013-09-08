module.exports = function(sio, chat_server){
	var io = sio.listen(chat_server);
	io.sockets.on('connection', function (client) {
	  
	  client.on('join', function(name){
	  	client.set('nickname', name);
	  	client.broadcast.emit('add_client', {name: name});
	  });

	  client.on('message', function (data) {
		client.get('nickname', function(err, name){
			client.broadcast.emit('chat', {name: name ,  message: data.message});
		});
	  });


	});
};