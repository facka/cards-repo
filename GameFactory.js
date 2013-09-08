var Card = require("./Card");
var Dealer = require("./Dealer");
var ElferRausMasterDealer = require("./ElferRausMasterDealer");
var ElferRausDealer = require("./ElferRausDealer");
var GranDalmutiDealer = require("./GranDalmutiDealer");
function GameFactory(){
	
	this.createElferRausMaster = function () {
		var rojas = [];
		var verdes = [];
		var azules = [];
		var amarillas = [];
		var cards = [];
		for (var i = 1; i <= 21 ; i++){
			rojas[i-1] = new Card("red"+i,""+i,"/carta1.png",(i*10)+60,200,"#FF0000",i);
		}
		for (var i = 1; i <= 21 ; i++){
			verdes[i-1] = new Card("green"+i,""+i,"/carta1.png",(i*10)+60,200,"#00FF00",i);
		}
		for (var i = 1; i <= 21 ; i++){
			azules[i-1] = new Card("blue"+i,""+i,"/carta1.png",(i*10)+60,200,"#0000FF",i);
		}
		for (var i = 1; i <= 21 ; i++){
			amarillas[i-1] = new Card("yellow"+i,""+i,"/carta1.png",(i*10)+60,200,"#FFFF00",i);
		}
		cards = cards.concat(rojas,verdes,azules,amarillas);
		
		var dealer = new ElferRausMasterDealer(cards);
		console.log("ElferRausMaster game created!!"+dealer.toString());
		return {
			dealer : dealer,
			maxPlayers : 6,
			minPlayers : 2
		};
	};
	
	this.createElferRaus = function () {
		var rojas = [];
		var verdes = [];
		var azules = [];
		var amarillas = [];
		var cards = [];
		for (var i = 1; i <= 20 ; i++){
			rojas[i-1] = new Card("red"+i,""+i,"/carta1.png",(i*10)+60,200,"#FF0000",i);
		}
		for (var i = 1; i <= 20 ; i++){
			verdes[i-1] = new Card("green"+i,""+i,"/carta1.png",(i*10)+60,200,"#00FF00",i);
		}
		for (var i = 1; i <= 20 ; i++){
			azules[i-1] = new Card("blue"+i,""+i,"/carta1.png",(i*10)+60,200,"#0000FF",i);
		}
		for (var i = 1; i <= 20 ; i++){
			amarillas[i-1] = new Card("yellow"+i,""+i,"/carta1.png",(i*10)+60,200,"#FFFF00",i);
		}
		cards = cards.concat(rojas,verdes,azules,amarillas);
		
		var dealer = new ElferRausDealer(cards);
		console.log("ElferRaus game created!!"+dealer.toString());
		return {
			dealer : dealer,
			maxPlayers : 6,
			minPlayers : 2
		};
	};
	
	this.createGranDalmuti = function () {
		
		
		var dealer = new GranDalmutiDealer();
		console.log("GranDalmuti game created!!"+dealer.toString());
		return {
			dealer : dealer,
			maxPlayers : 8,
			minPlayers : 2
		};
	};
	
	GameFactory.prototype.create = function(arg) {
		if (arg == "ElferRaus Master") {
			return this.createElferRausMaster();
		}
		if (arg == "ElferRaus") {
			return this.createElferRaus();
		}
		if (arg == "GranDalmuti") {
			return this.createGranDalmuti();
		}
		return {
			dealer : new Dealer([]),
			maxPlayers : 6,
			minPlayers : 2
		}
	};
};

module.exports = GameFactory;
console.log("GameFactory loaded!!");