function Dealer(cards_){
	this.cards = cards_;
	this.stack = [];
};

Dealer.prototype.deal = function(players) {
	this.stack = this.cards;
	this.shuffle();
	var cardsXPlayer = (this.stack.length - 20) / players.length;
	for (var i = 0; i < this.cardsXPlayer; ){
		for (player in players) {
			var card = this.takeCardFromTop();
			if (card){
				console.log("Player "+players[player]+" received card "+card.getName());
				players[player].takeCard(card);
			}
		}
		i++;
	}
	console.log("Delaer.deal() : players: "+players);
	return players;
};

Dealer.prototype.setCards = function(cards) {
	this.cards = cards;
};

Dealer.prototype.takeCardFromTop = function() {
	return this.stack.pop();
};

Dealer.prototype.turnDownCards = function(){
	for ( i in this.stack) {
		this.stack[i].turnDown();
	}
};

Dealer.prototype.isStackEmpty = function(){
	if (this.stack.length == 0) {
		return true;
	}
	return false;
};

Dealer.prototype.takeCardById = function(id) {
	var found = false;
	var i = 0;
	var card;
	while (!found && i < this.stack.length){
		card = this.stack[i];
		if (card.getId() == id){
			found = true;
			this.stack.splice(i,1);
		}
		i++;
	}
	if (found)
		return card;
	else
		return null;
};

Dealer.prototype.shuffle = function() {
	for (var i = this.stack.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (this.stack.length));
		var temp = this.stack[i];
		this.stack[i] = this.stack[j];
		this.stack[j] = temp;
	}
	return this.stack;
};
Dealer.prototype.moveCards = function(x,y,distancex,distancey) {
	for (var i = 0; i < this.stack.length ; i++) {
		this.stack[i].moveTo((x+(distancex*i)),y+(distancey*i));	
	}
};

Dealer.prototype.toString = function(){
	var ret;
	for(card in this.stack){
		ret += " "+card.id;
	}
	return ret;
};			
module.exports = Dealer;
console.log("Dealer loaded!!");