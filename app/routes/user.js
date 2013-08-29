module.exports = function(passport, LocalStrategy, _ , userModel, validator) { 
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

	self.postRegister = function (req, res) {
		console.log(req.sanitize);

		req.onValidationError(function (msg) {
        //Redirect the user with error 'msg'
    	});
		req.sanitize('firstname').escape();
		req.sanitize(req.body.firstname).escape();    	
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
			rereq.sanitize(elem).entityDecode().escape();
		});		
	}; 

	self.isAuthenticated = function (req, res, next) {
  		if (req.isAuthenticated()) { 
  			req.session.user = req.user;
  			return next(); 
  		}
 		res.redirect('/login')
	};

}
