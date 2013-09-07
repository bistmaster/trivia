module.exports = function() { 
	var self = this;

	self.index = function(req, res){
		res.render('error', {title: "Something is wrong. Please visit again."});
	};

	self.redirect = { failureRedirect: '/login', successRedirect: '/home', failureFlash: true };
	
}