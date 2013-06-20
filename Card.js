CARD_WIDTH = 90;
CARD_HEIGHT = 120;

function Card(id_,name_,src_,posx_,posy_,color_,points_) {
	this.id = id_;
	this.name = name_;
	this.src = src_;
	this.posx = posx_;
	this.posy = posy_;
	this.color = color_;
	this.width = CARD_WIDTH;
	this.height = CARD_HEIGHT;
	this.up = true;
	this.points = points_;
};
	
Card.prototype.turnOver = this.turnOver = function() {	
	this.up = this.up ? false : true;
};
Card.prototype.turnDown = function() {
	this.up = false;
};
Card.prototype.turnUp = function() {
	this.up = true;
};
Card.prototype.hide = function() {
	
};
Card.prototype.show = function() {
	
};
Card.prototype.moveTo = function(x,y) {
	this.posy = x;
	this.posx = y;
};
Card.prototype.move = function(offsetX,offsetY) {
	this.posy += offsetY;
	this.posx += offsetX;
};
Card.prototype.getId = function() {
	return this.id;
};
Card.prototype.getName = function() {
	return this.name;
};
Card.prototype.getPosition = function() {
	return {posx: this.posx, posy: this.posy};
};
Card.prototype.getColor = function() {
	return this.color;
};
Card.prototype.getPoints = function() {
	return this.points;
};
Card.prototype.toString = function() {
	return this.id;
}	
module.exports = Card;
console.log("Card loaded!!");