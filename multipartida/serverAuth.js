// TODO http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291

var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var fs = require('fs');
server.listen(8000);
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').Strategy;
var Users = []

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password,done){
    return done(null, { username : username });
	
}));

passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log("Adentro del serialize "+user);
  done(null, '22');
});

passport.deserializeUser(function(id, done) {
console.log("Adentro del deserialize "+ id);
  return done(null, { username : 'prueba' });
});

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

function userExist(req, res, next) {
    next();
}


var response404 = function(res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Error 404: File not found!");
};

app.post('/login',
  passport.authenticate('local', { successRedirect: '/page/multi.html',
                                   failureRedirect: '/login' }));

app.get('/login',
  function(req, res) {
    var file = __dirname + '/login.html';
    res.sendfile(file);
  });								   

app.get("/page/:which",passport.authenticate('basic', { session: false }), function(req, res) {
	var file = __dirname + '/'+req.params.which;
    fs.exists(file,function(exists){
		if (exists) {
			res.sendfile(file);
		}
		else {
			response404(res);
		}
	});  
});

var events = { SUCCESSFULL_LOGIN : "1",
		   LOGIN : '2',
		   GET_PARTIDAS : '3',
		   UPDATE_PARTIDAS : '4'
		 }

app.get("*", function(req, res) {
	response404(res);
});

io.set('heartbeat interval', 10); //cambie este valor de 20 a 10 para que ande mas rapido.
io.set('heartbeat timeout', 60); 
io.set('transports',[ 'xhr-polling' ]);

io.sockets.on('connection', function (socket) {
  console.log("SE conecto el cliente de id = "+socket.id);
  //Hay que verificar si el cliente ya existia 
  
  
  
  socket.on(events.LOGIN, function (data) {
    console.log("Login user: "+data.player);
	socket.emit(events.SUCCESSFULL_LOGIN, socket.id+ " logged  in");
  });
  
  socket.on(events.GET_PARTIDAS, function (data) {
	socket.emit(events.UPDATE_PARTIDAS, [{id : "Partida1", name : "Partida1", url : "partida.html?partida=Partida1"},
										 {id : "Partida2", name : "Partida2", url : "partida.html?partida=Partida2"},
										 {id : "Partida3", name : "Partida3", url : "partida.html?partida=Partida3"}]);
	socket.emit("run","alert('HOLA MUNDO!');");
  });
  
});

io.sockets.on('disconnect', function (socket) {
	console.log("socket.id : "+socket.id);
	socket.emit("message",socket.id+ "logged out");	
	socket.broadcast.emit("message",socket.id+ "logged out");	
});