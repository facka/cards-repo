var Dealer = require("./Dealer");
function ElferRausDealer(cards_){
	Dealer.call(this);
	console.log("Creating ElferRaus dealer");
	this.cards = cards_;
};

ElferRausDealer.prototype = new Dealer();

ElferRausDealer.prototype.constructor = ElferRausDealer;

ElferRausDealer.prototype.deal = function(players) {
	var stackAmount = 20;
	this.stack = this.cards;
	this.shuffle();
	var cardsXPlayer = (this.stack.length - stackAmount) / players.length;
	console.log("ElferRausDealer.deal() : cardsXPlayer: "+cardsXPlayer);
	for (var i = 0; i < cardsXPlayer; ){
		console.log("ElferRausDealer.deal() : players.length: "+players.length);
		for (p in players) {
			var card = this.takeCardFromTop();
			if (card){
				console.log("ElferRausDealer.deal() : taking card: "+players[p]+ " , card: "+ card.getName());
				players[p].takeCard(card);
			}
			else {
				console.log("ElferRausDealer.deal() : cards is empty. cards.length" + cards.length);
			}
		}
		i++;
	}
	console.log("ElferRausDealer.deal() : players: "+players);
	return players;
};

ElferRausDealer.prototype.toString = function(){
	return "ElferRaus  Dealer"
};

module.exports = ElferRausDealer;
console.log("ElferRausDealer loaded!!");