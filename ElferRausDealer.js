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
	for (var i = 0; i < cardsXPlayer; ){
		for (p in players) {
			var card = this.takeCardFromTop();
			if (card){
				players[p].takeCard(card);
			}
		}
		i++;
	}
	return players;
};

ElferRausDealer.prototype.toString = function(){
	return "ElferRaus  Dealer"
};

module.exports = ElferRausDealer;
console.log("ElferRausDealer loaded!!");