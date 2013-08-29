module.exports = function() { 
	var self = this;

	self.index = function(req, res){
		res.redirect('/');
	};

	self.redirect = { failureRedirect: '/login', successRedirect: '/home', failureFlash: true };
	
}