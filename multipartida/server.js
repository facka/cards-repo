// TODO http://stackoverflow.com/questions/7990890/how-to-implement-login-auth-in-node-js/8003291#8003291


var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var fs = require('fs');
server.listen(8000);

var response404 = function(res) {
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Error 404: File not found!");
};

app.get("/page/:which", function(req, res) {
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