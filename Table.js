var Card = require("./Card");
var Dealer = require("./Dealer");
function Table(){
	this.dealer;
	this.players = [];
	this.MAX_PLAYERS = 6;
	this.MIN_PLAYERS = 2;
	this.cards = [];
	this.totalPoints = {};
	this.lastZIndex = 1000;
		
	Table.prototype.init = function(game) {
		this.dealer = game.dealer;
		this.MAX_PLAYERS = game.MAX_PLAYERS;
		this.MIN_PLAYERS = game.MIN_PLAYERS;	
	};
	
	Table.prototype.addPlayer = function(player){
		console.log("Table.addPlayer( "+player.getName()+" )");
		this.totalPoints[player.getName()] = 0;
		this.players.push(player);
	};
	
	Table.prototype.removePlayer = function(p){
		console.log("Table.removePlayer( "+p.getName()+" )");
		var found = false;
		var i = 0;
		while (!found && i < this.players.length){
			var player = this.players[i];
			if (player.getName() == p.getName()){
				found = true;
				this.players.splice(i,1);
			}
			i++;
		}
	};
	
	Table.prototype.addCard = function(card){
		console.log("Table.addPlayer( "+card.getId()+" )");
		this.cards.push(card);
		this.pushUpCard(card);
	};
	
	Table.prototype.getCard = function(id){
		var found = false;
		var i = 0;
		var ret;
		while (!found && i < this.cards.length){
			var card = this.cards[i];
			if (card.getId() == id){
				found = true;
				ret = card;
			}
			i++;
		}
		return ret;
	};
	
	Table.prototype.removeCard = function(id){
		console.log("Table.removeCard( "+id+" )");
		var found = false;
		var i = 0;
		while (!found && i < this.cards.length){
			var card = this.cards[i];
			if (card.getId() == id){
				found = true;
				this.cards.splice(i,1);
			}
			i++;
		}
	};
	
	Table.prototype.pushUpCard = function(card){
		if (card) {
			card.pushUp(this.lastZIndex++);
		}
		else {
			console.log("Table.pushUpCard: card is null!");
		}
		return (this.lastZIndex-1);
	};
	
	Table.prototype.getPlayers = function(){
		console.log("Table.getPlayers() -> "+this.players);
		return this.players;
	};
	Table.prototype.existsPlayer = function(name){
		var player = this.getPlayerByName(name);
		console.log("Table.existsPlayer("+name+") = "+(player ? player.getName() : "No Existe!"));
		if (player)
			return true;
		else
			return false;
	};
	Table.prototype.getDealer = function(){
		return this.dealer;
	};			
	Table.prototype.deal = function() {
		this.players = this.dealer.deal(this.players);
		for (index in this.players) {
			var sortedCards = this.dealer.sortCards(this.players[index].getCards());
			this.players[index].setCards(sortedCards);
		}
	};
	Table.prototype.clean = function() {
		for (player in this.players) {
			this.players[player].removeCards();
		}
	};
	Table.prototype.getPlayerByName = function(name){
		var ret;
		for ( i in this.players){
			if (this.players[i].getName() == name){
				ret = this.players[i];
			}
		}
		console.log("Table.getPlayerByName("+name+") <- "+ret);
		return ret;
	};
	Table.prototype.getPlayerCards = function(playerName){
		var player = this.getPlayerByName(playerName);
		return player.getCards();
	};
	Table.prototype.isFull = function(){
		if (this.getPlayers().length >= this.MAX_PLAYERS)
			return true;
		else
			return false;
	};
	Table.prototype.calculatePoints = function(){
		var ret = {};
		for ( i in this.players){
			var player = this.players[i];
			console.log("El valor de this.players[i] :" + player);
			var points = player.calculatePoints();
			ret[player.getName()] = points;
			console.log("Player "+player+" has "+points+" points.");
			this.totalPoints[player.getName()] += points;
		}
		return ret;
	};
	Table.prototype.getTotalPoints = function(){
		return this.totalPoints;
	};
};

module.exports = Table;
console.log("Table loaded!!");