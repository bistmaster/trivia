(function(){
	var createBtn = $('#createBtn');
	createBtn.click(function(){
		var password = $('#password').val();
		var re_password = $('#retype-password').val();
		if((password != '' && re_password != '') && (password == re_password)){
			return true;
		} else {
			return false;
		}
	});

})();