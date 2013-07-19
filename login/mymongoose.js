var Mongoose = function() {
	this.connect = function(url) {
		console.log("Connecting to db "+ url);
	};

}

exports.mongoose = new Mongoose();