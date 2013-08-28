module.exports = function(app, mongoose, passport, LocalStrategy, routes, express){
	
	passport.use(new LocalStrategy(routes.setAuthentication));
	passport.serializeUser(function(user, done) {
	    done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	    done(null, id);
	});

	app.configure(function () {
		app.set('view engine', 'ejs');
		app.set('views', __dirname + '/views');
		app.use(express.static(__dirname + '/public/'));
		app.use(express.logger('dev'));	
		app.use(express.bodyParser());
		app.use( express.cookieParser());
		app.use(express.session({ secret: 'keyboard cat' }));
		app.use(passport.initialize());
		app.use(passport.session());	
		app.use(expressValidator([]));
		app.use(app.router);

		mongoose.connect(dbPath, function onMongooseError(err){
			if (err) throw err;
			console.log('Connected to db');
		});

	});	

}