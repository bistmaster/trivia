
var express = require('express'),
	app = express(),
	Render= require('./routes/routes');



app.configure(function () {
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public/'));
	app.use(express.logger('dev'));	
	app.use(express.bodyParser());
	app.use(app.router);
});	

var render = new Render();

app.get('/', render.getIndex);
app.post('/login', render.postLogin);
app.post('/register', render.postRegister);


app.listen(9333, function(){
	console.log('Listening on localhost:9292');
})