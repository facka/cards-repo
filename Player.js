// Constructor
function Player(name_,password_) {
	// always initialize all instance properties
	this.name = name_;
	this.password = password_;
	this.cards = [];
};
// class methods
Player.prototype.setName = function(name_) {
	this.name = name_;
};
Player.prototype.getName = function() {
	return this.name;
};
Player.prototype.setPassword = function(password_) {
	this.password = password_;
};
Player.prototype.getPassword = function() {
	return this.password;
};
Player.prototype.validatePassword = function(password_) {
	return this.password == password_;
}
Player.prototype.toString = function() {
	return this.name;
};
Player.prototype.takeCard = function(card){
	this.cards.push(card);
};
Player.prototype.removeCards = function(){
	this.cards = [];
};
Player.prototype.setCards = function(cards_) {
	this.cards = cards_;
};
Player.prototype.getCards = function() {
	return this.cards;
};
Player.prototype.hasCards = function() {
	return this.cards.length != 0;
};
Player.prototype.moveCards = function(x,y,distance) {
	for (var i = 0; i < this.cards.length ; i++) {
		this.cards[i].moveTo((x+(distance*i)),y);
		
	}
};
Player.prototype.turnDownCards = function(){
	for (var i = 0; i < this.cards.length ; i++) {
		this.cards[i].turnDown();
	}
};
Player.prototype.turnUpCards = function(){
	for (var i = 0; i < this.cards.length ; i++) {
		this.cards[i].turnUp();
	}
};
Player.prototype.hideCards = function(){
	for (var i = 0; i < this.cards.length ; i++) {
		this.cards[i].hide();
	}
};
Player.prototype.showCards = function(){
	for (var i = 0; i < this.cards.length ; i++) {
		this.cards[i].show();
	}
};
Player.prototype.removeCard = function(id){
	console.log("Player.removeCard( "+id+" )");
	var found = false;
	var i = 0;
	var ret;
	while (!found && i < this.cards.length){
		var card = this.cards[i];
		if (card.getId() == id){
			found = true;
			ret = card;
			console.log("Player.removeCard( "+id+" )  CARD FOUND!!");
			this.cards.splice(i,1);
		}
		i++;
	}
	return ret;
};
Player.prototype.calculatePoints = function(){
	var total = 0;
	for ( i in this.cards) {
		total += this.cards[i].getPoints();
	}
	return total;
};

// export the class
module.exports = Player;

console.log("Players loaded!!");