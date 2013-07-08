function Partida(name){
	console.log("Creating Partida");
	this.name = name;
	this.table = new Table();
};

Partida.prototype.constructor = Partida;

module.exports = Partida;
console.log("Partida loaded!!");