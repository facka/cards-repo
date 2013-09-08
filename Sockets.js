// Constructor
function Sockets() {
	// always initialize all instance properties
	this.sockets = [];
};
// class methods
Sockets.prototype.addSocket = function(socket, name) {
	var socketData = {socket: socket, name: name};
	this.sockets.push(socketData);
};
Sockets.prototype.removeSocket = function(id) {
	var found = false;
	var i = 0;
	while (!found && i < this.sockets.length){
		var item = this.sockets[i];
		if (item.socket.id == id){
			found = true;
			this.sockets.splice(i,1);
		}
		i++;
	}
};
Sockets.prototype.getName = function(socket) {
	
	for (var index in this.sockets) {
		var item = this.sockets[index];
		if (item.socket.id == socket.id) {
			return item.name;
		}
	}
	return null;
};

// export the class
module.exports = Sockets;

console.log("Sockets loaded!!");