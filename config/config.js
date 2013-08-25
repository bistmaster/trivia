//express configuration
exports.load = function(express){
	var app = express();	
	return 	app.configure(function(){
			app.set('views engine' , 'ejs');
			app.set('views', _dirname + '/views');
			app.use(app.router);
			app.use(express.static(__dirname + 'public'))
			app.use(express.logger());
			app.use(express.bodyParser());			
	});
}