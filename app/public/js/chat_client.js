(function($){
	var server = io.connect('http://localhost:9090');
	var answerBtn = $('#answerBtn');
	var answerTxt = $('#answerTxt');
	var chatBox = $('.left-box .panel-body');
	var chatList = $('.right-box .panel-body');

	server.on('connect', function(data){
		server.emit('join', name);
	});

	server.on('add_client', function(data){
		chatList.append('<br><b>' + data.name + '</b>');
	});

	server.on('chat', function (data) {
		chatBox.append('<br><b>' + data.name + '</b> : ' + data.message);
	});	

	answerBtn.click(function(){
		server.emit('message', { message: answerTxt.val()});
		chatBox.append('<br><b>' + name + '</b> : ' + answerTxt.val());
		answerTxt.text('');
	});

	answerTxt.keypress(function(event){
		if(event.which == 13){
			server.emit('message', { message: answerTxt.val()});
			chatBox.append('<br><b>' + name + '</b> : ' + answerTxt.val());
			answerTxt.val('');
		}
	});

})(jQuery);

