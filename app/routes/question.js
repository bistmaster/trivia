module.exports = function(passport, LocalStrategy, _ , questionModel) { 
	var self = this;

	self.setAuthentication = function (username, password, done) {
		questionModel.findUser(username, password, function (err, user) {
			if (err instanceof Error) { 
				return done(err); 
			}
			return done(user, null);
		});
	};

	self.getIndex = function (req, res) {
		var data = { title: 'Online Real-time Trivia'};
		res.render('index', data);

	};

	self.getHome = function (req, res) {
		var data = { title: 'Online Real-time Trivia', authenticated: true};
		res.render('index', data);

	};

	self.postLogin = function (req, res) {
		var data = {title: 'Welcome blah blah', authenticated: true};
		res.render('index', data);
	};

	self.postRegister = function (req, res) {
		self.sanitize(req);
		questionModel.saveUser(req.body, function(err, record){
			if(err instanceof Error){
				res.statusCode = 500;
				res.end('Something is wrong');			
			} else {
				res.redirect('/');
			}
		});
	};

	self.getLogin = function (req, res) {
		var data = {loginTitle: 'Please login'};
		res.render('login', data);
	};

	self.getLogout = function (req, res) {
		var data = {title: 'Sample Site4'};
		res.render('register', data);
	};

	self.sanitize = function (req) {
		_.each(req.body, function(elem, idx){	
			return req.sanitize(elem).xss(true);
		});		
	}; 

	self.authenticate = function () {
		return ('local', { successRedirect: 'www.google.com', failureRedirect: '/loginadad', failureFlash: true });
	};
}
