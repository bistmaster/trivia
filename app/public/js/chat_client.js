(function($, window){
	var hostname = window.location.hostname;
	var protocol = window.location.protocol;
	var port = 9090;
	var server = io.connect(protocol + '//' + hostname + ':' + port);
	var answerBtn = $('#answerBtn');
	var answerTxt = $('#answerTxt');
	var chatBox = $('.left-box .box-left');
	var chatList = $('.right-box .box-right');
	var removeClientList = function(name){
		$('.panel-body .box-right div b:contains('+name+')').remove();
	}
	

	server.on('connect', function(data){
		server.emit('join', name);

		server.on('addown', function(data){
			chatList.append('<div><b>' + data.name + '</b></div>');
			server.emit('newuser', data);
		});		

		server.on('adduserclient', function(data){
			chatList.append('<div><b>' + data.name + '</b></div>');
		});

		server.on('adduser', function(data){
			chatList.append('<div><b>' + data.name + '</b></div>');
			server.emit('newuserjoin', {name: name});
		});

		server.on('messagebot', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
		});

		server.on('bot_greet', function(data){
			chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
			chatBox.animate({scrollTop : chatBox.prop("scrollHeight")}, 1);
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

		server.on('disconnect', function(){
		});

		server.on('removeuser', function(data){
			alert(data.name);	
			removeClientList(data.name);
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

