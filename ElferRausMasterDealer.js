var Dealer = require("./Dealer");
function ElferRausMasterDealer(cards_){
	Dealer.call(this);
	console.log("Creating master dealer");
	this.cards = cards_;
};

ElferRausMasterDealer.prototype = new Dealer();

ElferRausMasterDealer.prototype.constructor = ElferRausMasterDealer;

ElferRausMasterDealer.prototype.deal = function(players) {
	this.stack = this.cards;
	this.shuffle();
	var cardsXPlayer = (this.stack.length - 20) / players.length;
	console.log("MasterDealer.deal() : cardsXPlayer: "+cardsXPlayer);
	for (var i = 0; i < cardsXPlayer; ){
		console.log("MasterDealer.deal() : players.length: "+players.length);
		for (p in players) {
			var card = this.takeCardFromTop();
			if (card){
				console.log("MasterDealer.deal() : taking card: "+players[p]+ " , card: "+ card.getName());
				players[p].takeCard(card);
			}
			else {
				console.log("MasterDealer.deal() : cards is empty. cards.length" + cards.length);
			}
		}
		i++;
	}
	console.log("MasterDealer.deal() : players: "+players);
	return players;
};

ElferRausMasterDealer.prototype.toString = function(){
	return "ElferRaus Master Dealer"
};

module.exports = ElferRausMasterDealer;
console.log("ElferRausMasterDealer loaded!!");