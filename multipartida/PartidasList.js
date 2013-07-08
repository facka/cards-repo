var PartidasList = function(parentId) {
	var _this = this;

	var initComponents = function() { 
		$("#"+parentId).append(
			$("<ul id='partidasList' style='text-align:center; position: relative; top: 0px; width: 100%;'></ul>")
		);
	};
		
	/**
	partida = {id : <string>, name: <string>, url: <url>}
	*/
	this.addPartida = function(partida) {
		if ($("#partidasList") != null) {
			setTimeout(function() {
				$("#partidasList").append(
					$("<li id='li_"+partida.id+"'/></li>").append(
						$("<a href="+partida.url+" target='_blank'>"+partida.name+"</a>")
					));
			},0);
		}
		else {
			console.log("Couldn´t add Partida because Partida.id " + partida.id + " already exists.");
		}
	};

	/**
	partidas = [ {partida}, {partida}]
	*/
	this.addPartidas = function(partidas) {
		for (var index in partidas) {
			_this.addPartida(partidas[index]);
		}
	};
	
	this.update = function(partidas) {
		_this.clear();
		_this.addPartidas(partidas);
	};
	
	
	this.clear = function() {
		$("#partidasList").empty();
	};
	
	$(document).ready(function(){
		initComponents();
	});
};