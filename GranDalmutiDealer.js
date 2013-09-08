var Dealer = require("./Dealer");
var Card = require("./Card");
function GranDalmutiDealer(){
	Dealer.call(this);
	console.log("Creating GranDalmuti dealer");
	
	this.cards = [];
	var numberOfWildCards = 2;
	this.numberOfCards = 1+2+3+4+5+6+7+8+9+10+11+12+numberOfWildCards;
		
	var nombres = {
		1: "GranDalmuti", 2: "Arzobispo", 3: "Sheriff", 4: "Baronesa", 5: "Abadesa", 6: "Caballero", 7: "Costurera",
		8: "Albañil", 9: "Cocinera", 10: "Pastora", 11: "Picapedrero", 12: "Campesino", 13: "Bufon"
	};
	
	var index = 0;
	for (var i = 1; i <=  1; i++){
		this.cards[index] = new Card("GranDalmuti",""+1,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  2; i++){
		this.cards[index] = new Card("Arzobispo"+i,""+2,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  3; i++){
		this.cards[index] = new Card("Sheriff"+i,""+3,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  4; i++){
		this.cards[index] = new Card("Baronesa"+i,""+4,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  5; i++){
		this.cards[index] = new Card("Abadesa"+i,""+5,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  6; i++){
		this.cards[index] = new Card("Caballero"+i,""+6,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  7; i++){
		this.cards[index] = new Card("Costurera"+i,""+7,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  8; i++){
		this.cards[index] = new Card("Albañil"+i,""+8,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  9; i++){
		this.cards[index] = new Card("Cocinera"+i,""+9,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  10; i++){
		this.cards[index] = new Card("Pastora"+i,""+10,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  11; i++){
		this.cards[index] = new Card("Picapedrero"+i,""+11,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  12; i++){
		this.cards[index] = new Card("Campesino"+i,""+12,"/carta1.png",0,0,"#000000",index);
		index++;
	}
	for (var i = 1; i <=  2; i++){
		this.cards[index] = new Card("Buffon"+i,"B","/carta1.png",0,0,"#000000",index);
		index++;
	}
};

GranDalmutiDealer.prototype = new Dealer();

GranDalmutiDealer.prototype.constructor = GranDalmutiDealer;

GranDalmutiDealer.prototype.deal = function(players) {
	this.stack = this.cards;
	this.shuffle();
	var remainingCards = this.numberOfCards;
	for (remainingCards = this.numberOfCards; remainingCards > 0; ){
		for (p in players) {
			var card = this.takeCardFromTop();
			remainingCards--;
			if (card){
				players[p].takeCard(card);
			}
		}
		
	}
	return players;
};

GranDalmutiDealer.prototype.toString = function(){
	return "GranDalmuti  Dealer"
};

module.exports = GranDalmutiDealer;
console.log("GranDalmutiDealer loaded!!");