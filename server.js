
		
var Player = require("./Player");
var Card = require("./Card");
var Dealer = require("./Dealer");
var Table = require("./Table");
var GameFactory = require("./GameFactory");
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  
server.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/Menu.js', function (req, res) {
  res.sendfile(__dirname + '/Menu.js');
});

app.get('/Messages.js', function (req, res) {
  res.sendfile(__dirname + '/Messages.js');
});

app.get('/jquery.ui.touch-punch.min.js', function (req, res) {
  res.sendfile(__dirname + '/jquery.ui.touch-punch.min.js');
});

app.get('/table', function (req, res) {
  res.sendfile(__dirname + '/cards.html');
});

var table = new Table();  
var gameFactory = new GameFactory();
var dealed = false;
var admin;
var gameStarted = false;
var partidas=new Array();
var playersSocket = {};

io.set('heartbeat interval', 10); //cambie este valor de 20 a 10 para que ande mas rapido.
io.set('heartbeat timeout', 60); 
io.set('transports',[ 'xhr-polling' ]);

io.sockets.on('connection', function (socket) {
	
  socket.on('getPartidas', function (name, fn) {
	fn(partidas);
  });
  
  socket.on('createPartida', function (name) {
	
  });
  
  socket.on('login', function (data) {
    console.log("Login user: "+data.player);
	
	if (data.player == "admin" && data.password == "admin") {
	 //debe retornar algo para permitir reiniciar el juego borrando los players
	 // o puede borrar directamente los players
	}
	
	if (table.existsPlayer(data.player)){
		var player = table.getPlayerByName(data.player);
		if ( player.getPassword() == data.password) {
			console.log("User Reconnected: "+socket.id);
			playersSocket[socket.id] = data.player;
			socket.emit("handCards",{cards : player.getCards()});
			var cards = table.getCards();
			var cardsArray = [];
			for (i in cards){
				cardsArray.push(cards[i].toJSON());
			}
			socket.emit("successfullLogin",{player : data.player});
			socket.emit("tableCards", {cards: cardsArray, player : data.player});
			socket.broadcast.emit("message","Player "+ data.player +" is back!");
		}
		else {
			console.log("Wrong User");
			socket.emit("wrongUserName",{});
		}
	}
	else {
		if (table.isFull()) {
			socket.emit("tableIsFull",{});
			console.log("Table is full");
		}
		else {
			if (gameStarted) {
				socket.emit("gameAlreadyStarted",{});
				console.log("Game Already Started");
			}
			else {
				console.log("Successfull Login: "+data.player+" / "+data.password);
				console.log("User connected: "+socket.id);
				playersSocket[socket.id] = data.player;
				socket.emit("successfullLogin",{player : data.player});
				var player = new Player(data.player,data.password);
				if (!admin) {
					admin = player;
					socket.emit("adminUser",{});
				}
				table.addPlayer(player);
				
				var players = table.getPlayers();
				var playersNames = [];
				for ( i in players){
					playersNames[i] = players[i].toString();
				}
				var response = {players : playersNames,
							playerName : data.player
				};
				socket.emit("updateUserList",response);
				socket.broadcast.emit("updateUserList",response);
				socket.emit("message","Welcome, "+data.player);	
			}
		}
	}
  });
  
  /*
  Starts the selected game
  */
  socket.on('startGame', function (data) {
  	if (data.player == admin) {
		gameStarted = true;
		console.log("Creating game: "+data.game);
		if (data.game == "ElferRaus Master") {
			var game = gameFactory.create("ElferRaus Master");
			table.init(game);
		}
		else {
			if (data.game == "ElferRaus") {
				var game = gameFactory.create("ElferRaus");
				table.init(game);
			}
			else {
				console.log("Game not implemented yet!!");
				socket.emit("message","Game not implemented yet!");
			}
		}
		var playersName = [];
		var players = table.getPlayers();
		for (i in players) {
			playersName.push(players[i].getName());
		}
		socket.emit("startGame",{players : playersName});	
		socket.broadcast.emit("startGame",{players : playersName});
		socket.emit("message","Game Started!");	
		socket.broadcast.emit("message","Game Started!");	
	}
  });  
  
  
  socket.on('deal', function (data) {
	if (!dealed){
		dealed = true;
		table.deal();
		var players = table.getPlayers();
		for( i in players){
			var name = players[i].getName();
			console.log("Emiting cards for player"+name);
			socket.emit(name+"Cards",{cards : players[i].getCards()});	
			socket.broadcast.emit(name+"Cards",{cards : players[i].getCards()});	
		}
	}
  });  
	socket.on('getStackCard', function (data) {
		if (dealed){
			var card = table.getDealer().takeCardFromTop();
			if (card) {
				table.addCard(card);
				socket.emit("stackCard",card);	
				//TODO si es compartida la carta del pozo se reenvia
				socket.broadcast.emit("stackCard",card);
				socket.emit("message","Player "+data.playerName+" took a card from the stack.");	
				socket.broadcast.emit("message","Player "+data.playerName+" took a card from the stack.");	
			}
			if (table.getDealer().isStackEmpty()){
				socket.emit("stackEmpty",card);	
				socket.broadcast.emit("stackEmpty",card);	
			}
		}
	});  	
	
	/**
	data : {cardId : <id>, x: <x>, y: <y>}
	*/
  socket.on('cardDroppedOnTable', function (data) {
	console.log("Player "+data.playerName+" dropped the card "+data.card.id+" on the table.");
	if (table.getCard(data.card.id)) {
		table.moveCard(data.card.id,data.card.posx, data.card.posy);
		socket.emit("message","Player "+data.playerName+" moved card " + data.card.id+ ".");	
		socket.broadcast.emit("message","Player "+data.playerName+" moved card " + data.card.id+ ".");
	}
	else {
		var card = table.getPlayerByName(data.playerName).removeCard(data.card.id);
		if (card) {
			card.moveTo(data.card.posx, data.card.posy);
			table.addCard(card);
			socket.emit("message","Player "+data.playerName+" dropped card " + data.card.id+ " on the table.");	
			socket.broadcast.emit("message","Player "+data.playerName+" dropped card " + data.card.id+ " on the table.");
		}
	}
	var card = table.getCard(data.card.id);
	socket.emit("cardDroppedOnTable", card.toJSON());
	socket.broadcast.emit("cardDroppedOnTable", card.toJSON());
	if ( !(table.getPlayerByName(data.playerName).hasCards()) ) {
		socket.emit("message","Player "+data.playerName+" wins the round.");	
		socket.broadcast.emit("message","Player "+data.playerName+" wins the round.");
		var pointsByPlayer = table.calculatePoints();
		var totalPoints = table.getTotalPoints();
		socket.emit("playersPoints",totalPoints);	
		socket.broadcast.emit("playersPoints",totalPoints);
	}
  });
  
  socket.on('cardDroppedOnHand', function (data) {
	socket.emit("cardDroppedOnHand", data.card);	
	socket.broadcast.emit("removeCardFromTable", data.card);
	socket.emit("message","Player "+data.playerName+" picked up a card from the table.");	
	socket.broadcast.emit("message","Player "+data.playerName+" picked up a card from the table.");
	console.log("Player "+data.playerName+" picked up the card "+data.card.id+" from the table.");
	var card = table.getCard(data.card.id);
	if (card) {
		table.getPlayerByName(data.playerName).takeCard(card);
		table.removeCard(data.card.id);
	}
  });  
  
  socket.on('cardDragged', function (data) {
	socket.broadcast.emit("cardDragged", data);
  });
  
  socket.on('cardPushedUp', function(data) {
	var card = table.getCard(data.id);
	var zIndex = table.pushUpCard(card);
	socket.emit("cardPushedUp", {'id': data.id, 'zIndex': zIndex});
	socket.broadcast.emit("cardPushedUp", {'id': data.id, 'zIndex': zIndex});
  });
  
  socket.on('finishHand', function (data) {
	dealed = false;
	table.clean();
	socket.emit("finishHand",data);	
	socket.broadcast.emit("finishHand",data);	
	socket.emit("message","Round finished.");	
	socket.broadcast.emit("message","Round finished.");	
  });
  
  socket.on('newGame', function (data) {
	dealed = false;
	table.clean();
	socket.emit("newGame",{});	
	socket.broadcast.emit("newGame",{});	
  });
  
  socket.on('message', function (message) {
	socket.emit("message",message);	
	socket.broadcast.emit("message",message);	
  }); 
  
  socket.on('disconnect', function () {
    console.log("socket.id : "+socket.id);
	if (playersSocket[socket.id]) {
		socket.emit("message","User " + playersSocket[socket.id] + " has logged out");	
		socket.broadcast.emit("message","User " + playersSocket[socket.id] + " has logged out");	
	}
	
  });
  
});
