var Player = require("./Player");
// Constructor
function LoginEvent(socket, table, sockets) {
	// always initialize all instance properties
	_this = this;
	console.log("Creating LoginEvent for socket "+ socket.id+ ". Hay otro socket? "+ (_this.socket ? _this.socket.id : "NO"));
	_this.socket = socket;
	_this.table = table;
	_this.playerSockets = sockets;
};
// class methods
LoginEvent.prototype.getName = function() {
	return "login";
};
LoginEvent.prototype.action = function(data, socket){//, client) {
	console.log("Login user: "+data.player + " , socket: "+ socket.id);
	
	if (data.player == "admin" && data.password == "admin") {
	 //debe retornar algo para permitir reiniciar el juego borrando los players
	 // o puede borrar directamente los players
	}
	
	if (_this.table.existsPlayer(data.player)){
		var player = _this.table.getPlayerByName(data.player);
		
		
		
		
		var options = {
			type:'users',
			username:data.player,
			password:data.password
		}
		/*
		client.createEntity(options, function (err, user) {
			if (err){
				console.log("User not created");
			} else {
				console.log("User saved!");
			}
		});*/
		
		
		if ( player.getPassword() == data.password) {
			console.log("User Reconnected: "+_this.socket.id);
			_this.playerSockets.addSocket(socket, data.player);
			socket.emit("handCards",{cards : player.getCards()});
			var cards = _this.table.getCards();
			var cardsArray = [];
			for (i in cards){
				cardsArray.push(cards[i].toJSON());
			}
			var count = (_this.table.getDealer() != null )? _this.table.getDealer().countStackCards() : 0;
			socket.emit("stackCardsCount",count);	
			
			var playersName = [];
			var players = _this.table.getPlayers();
			for (i in players) {
				playersName.push(players[i].getName());
			}
			socket.emit("startGame",{players : playersName});	
			
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
		if (_this.table.isFull()) {
			socket.emit("tableIsFull",{});
			console.log("Table is full");
		}
		else {
			if (_this.table.getGameStarted()) {
				socket.emit("gameAlreadyStarted",{});
				console.log("Game Already Started");
			}
			else {
				console.log("Successfull Login: "+data.player+" / "+data.password);
				console.log("User connected: "+socket.id);
				_this.playerSockets.addSocket(socket, data.player);
				socket.emit("successfullLogin",{player : data.player});
				var player = new Player(data.player,data.password);
				if (!_this.table.getAdmin()) {
					_this.table.setAdmin(player);
					socket.emit("adminUser",{});
				}
				_this.table.addPlayer(player);
				
				var players = _this.table.getPlayers();
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
};

// export the class
module.exports = LoginEvent;

console.log("LoginEvent loaded!!");