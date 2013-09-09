(function($, window){
	var hostname = window.location.hostname;
	var protocol = window.location.protocol;
	var port = 9090;
	var server = io.connect(protocol + '//' + hostname + ':' + port);
	var answerBtn = $('#answerBtn');
	var answerTxt = $('#answerTxt');
	var chatBox = $('.left-box .box-left');
	var chatList = $('.right-box .panel-body');
	

	server.on('connect', function(data){
		server.emit('join', name);

		server.on('add_client', function(data){
			chatList.append('<br><b>' + data.name + '</b>');
		});
		
		server.on('addown', function(data){
			chatList.append('<br><b>' + data.name + '</b>')
		});

		server.on('add_client_list', function(data){
			chatList.remove();
			console.log(data.names);
			data.names.forEach(function(_name){
				chatList.append('<br><b>' + _name + '</b>');
			});
		});

		server.on('messagebot', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		});

		server.on('bot_greet', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);

			chatList.append('<b>' + data.client_name + '</b><br>');
			chatList.animate({scrollTop : chatList.prop("scrollHeight")}, 1);
		});

		server.on('bot_chat', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		});

		server.on('bot_trivia', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.question);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		})

		server.on('chat', function (data) {
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		});

		server.on('message', function (data) {
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		});	

		answerBtn.click(function(){
			server.emit('message', { message: answerTxt.val()});
			answerTxt.val('')
		});

		answerTxt.keypress(function(event){
			if(event.which == 13){
				server.emit('message', { message: answerTxt.val()});
				answerTxt.val('');
			}
		});
	});



})(jQuery, window);

