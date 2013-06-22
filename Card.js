CARD_WIDTH = 70;
CARD_HEIGHT = 90;

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
	this.zIndex = 0;
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
Card.prototype.pushUp = function(zIndex_) {
	this.zIndex = zIndex_;
};
Card.prototype.getPoints = function() {
	return this.points;
};
Card.prototype.toString = function() {
	return this.id;
}	
Card.prototype.toJSON = function() {
	return { id : this.id,
			 name : this.name,
			 posx: this.posx,
			 posy: this.posy,
			 color: this.color,
			 up: this.up,
			 zIndex: this.zIndex,
			 points: this.points
		   };
}
Card.prototype.compareTo = function(otherCard) {
	var colorToNumber = function (color) {
		var ret;
		switch(color) {
			case "#FF0000":
				ret = 1;
				break;
			case "#00FF00":
				ret = 2;
				break;
			case "#0000FF":
				ret = 3;
				break;
			case "#FFFF00": 
				ret = 4;
				break;				
		}
		return ret;
	};
	
	var compareNumbers = function(n1, n2) {
		if (n1 == n2) return 0;
		if (n1 < n2) return -1;
		if (n1 > n2) return 1; 
	}
	
	if (this.color == otherCard.color) {
		return compareNumbers(this.points,otherCard.getPoints());
	}
	else {
		return compareNumbers(colorToNumber(this.color),colorToNumber(otherCard.getColor()));
	}
}
module.exports = Card;
console.log("Card loaded!!");