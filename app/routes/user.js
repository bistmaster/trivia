module.exports = function(passport, LocalStrategy, _ , userModel) { 

	var self = this;

	self.setAuthenticationLocal = function(username, password, done) {
		userModel.findUser(username, password, function (err, user) {
			if (err instanceof Error) { return done(err); }
			done(null, user);

		});
	};

	self.setAuthenticationFacebook = function(accessToken, refreshToken, profile, done) {
		userModel.findUserById(profile.id, profile, function(err, user) {
			if (err instanceof Error) { return done(err); }
		 	done(null, user);
		});
	};

	self.setAuthenticationGoogle = function(identifier, profile, done) {
		userModel.findUserById(identifier, profile, function(err, user) {
			if (err instanceof Error) { return done(err); }
		 	done(null, user);
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

	self.postRegister = function (req, res) {  
		var cleanQuery = self.sanitize(req.body);
		userModel.saveUser(cleanQuery, function(err, user){
			if(err instanceof Error){
				res.statusCode = 500;
				res.end('Something is wrong');// Todo: redirect user if error occur create a helper class			
			} else {
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

	self.sanitize = function (query) {
		var items = {};
		_.map(query, function(elem, key) {	
			items[key] = _(elem).stripTags();
		});	
		return items;	
	}; 

	self.isAuthenticated = function (req, res, next) {
  		if (req.isAuthenticated()) { 
  			req.session.user = req.user;
  			return next(); 
  		}
 		res.redirect('/login')
	};

	self.getUpdateUser = function (req, res) {
		var id = req.param(id, '');
		userModel.updateUser(id, query, function(err, user){

		});
	};
	//testing purpose only
	self.getCheckId = function (req, res) {
		console.log('Id ' + req.params.id);
		userModel.findUserById(req.params.id, {}, function(err, user) {
			if (err instanceof Error) { return console.error(err.message); }
		 	res.end(user);
		});
	};

}
