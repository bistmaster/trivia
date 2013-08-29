module.exports = function(passport, LocalStrategy, _ , userModel) { 
	var self = this;

	self.setAuthentication = function (username, password, done) {
		userModel.findUser(username, password, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
			}
			return done(null, user);

		});
	};

	self.getIndex = function (req, res) {
		var data = { title: 'Online Real-time Trivia', authenticated: false };
		res.render('index', data);
	};

	self.getHome = function (req, res) {
		var fullname = req.session.user.firstname + ' ' + req.session.user.lastname;
		var user = req.session.user;
		var data = { title: 'Online Real-time Trivia', authenticated: true, name: fullname, profile : user};	
		res.render('home', data);
	};

	self.postLogin = function (req, res) {
		var data = {title: 'Welcome blah blah', authenticated: true};
		res.render('index', data);
	};

	self.postRegister = function (req, res) {
		//self.sanitize(req);
		userModel.saveUser(req.body, function(err, user){
			if(err instanceof Error){
				res.statusCode = 500;
				res.end('Something is wrong');			
			} else {
				//res.redirect('/');
				req.login(user, function(err){
					if(err) { return err; }	
					else {
						req.session.user = user;	
						return res.redirect('/home');
					}
				});
			}
		});
	};

	self.getLogin = function (req, res) {
		var data = {loginTitle: 'Please login'};
		res.render('login', data);
	};

	self.getLogout = function (req, res) {
		req.logout();
		res.redirect('/');
	};

	self.sanitize = function (req) {
		_.each(req.body, function(elem, idx){	
			console.log(elem);
			//req.sanitize(elem).xss();
		});		
	}; 

	self.authenticate = function () {
		return ('local', { successRedirect: 'www.google.com', failureRedirect: '/loginadad', failureFlash: true });
	};

	self.isAuthenticated = function (req, res, next) {
  		if (req.isAuthenticated()) { 
  			req.session.user = req.user;
  			return next(); 
  		}
 		res.redirect('/login')
	};

}
