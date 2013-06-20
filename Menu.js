var Menu = function() {
	var animationFinished = true;
	var mouseIn = false;
	var collapsed = true;
	var menuContainer;
	
	var expand = this.expand = function() {
		collapsed = false;
		showContent();
		if (animationFinished) {
			animationFinished = false;
			$("#menu").animate({
				opacity: 0.9,
				height: "320px"
				}, 250, function() {
					animationFinished = true;
				});
		}
	};	

	var collapse = this.collapse = function() {
		collapsed = true;
		if (animationFinished) {
			animationFinished = false;
			$("#menu").animate({
				opacity: 0.25,
				height: "0px"
				}, 250, function() {
					animationFinished = true;
					hideContent();
				});
		}
	};
	
	var hideContent = function() {
		$("#menu").css({'border-radius': '', 'border':'','box-shadow': '','padding':''});
		$("#menuContent").hide();
	};
	
	var showContent = function() {
		$("#menu").css({'border-radius': '5px', 'border':'1px solid #a1a1a1','box-shadow': '10px 10px 7px rgba(50, 50, 50, 0.5)','padding':'10px'});
		$("#menuContent").show();
	};
		
	var initComponents = function() { 
		$("body").append(
			$("<div id='menuContainer' align='center' style='text-align:center; position: absolute; top: 0px; width: 100%; z-index: 20000; display: none;'></div>").append(
				$("<div id='menuButton' style='position: relative; top: -5px; margin: auto; margin-bottom: 20px; width: 80px; font-weight:bold; padding-top: 5px; border-radius: 8px; border:1px solid #a1a1a1'>MENU</div>")
			).append(
				$("<div id='menu' style='background-color: silver; width :500px; height:0px; margin: auto;'></div>").append(
					$("<div id='menuContent' style='background-color: rgb(85, 159, 60); width :100%; height: 320px;'></div>").append(
						$("<div id='panelPlayers' style='background-color: rgb(36, 129, 16); width :330px; height: 300px; float: left; overflow: auto; padding:10px;'></div>")
					).append(
						$("<div id='panelButtons' style=' width :130px; height: 300px; float: left; display: block; padding:10px;'></div>")
					)
				)
			)
		);
		
		setTimeout(function(){
			$("#menuContainer").mouseenter(function() {
				mouseIn = true;
			});
			$("#menu").mouseleave(function() {
				mouseIn = false;
				collapse();
			});
			$("#menuButton").click(function() {
				if (collapsed == true)
					expand();
				else
					collapse();
			});	
			$("#menuButton").mouseenter(function(){
				$(this).css({'box-shadow':'0px 0px 3px rgba(100, 180, 30, 1)','cursor':'pointer'});
			});
			$("#menuButton").mouseleave(function(){
				$(this).css({'box-shadow':'','cursor':'auto'});
			});
			menuContainer = $("#menuContainer");
			collapse();
		},0);
	};
	
	var show = this.show = function() {
		if (menuContainer)
			menuContainer.show();
		else
			setTimeout( show ,0);
	};
	
	var hide = this.hide = function() {
		if (menuContainer)
			menuContainer.hide();
		else
			setTimeout( hide ,0);
	};
	
	this.addButton = function(id, name, action) {
		if ($("#"+id) != null) {
			setTimeout(function() {
				$("#panelButtons").append(
					$("<div id='"+id+"' style='border-radius: 5px; border:1px solid rgb(100, 174, 74); margin: 5px'>"+name+"</div>")
				);
				setTimeout(function(){
					$("#"+id).click(action);
					$("#"+id).mouseenter(function(){
						$(this).css({'box-shadow':'0px 0px 3px rgba(100, 180, 30, 1)','background-color':'rgb(100, 174, 74)','cursor':'pointer'});
					});
					$("#"+id).mouseleave(function(){
						$(this).css({'box-shadow':'','background-color':'rgb(85, 159, 60)','cursor':'auto'});
					});
				},0);
			},0);
		}
		else {
			console.log("Couldn´t create button because the button " + id + " already exists.");
		}
	};
	
	this.addPlayer = function(player) {
		if ($("#info"+player.name) != null) {
			setTimeout(function() {
				$("#panelPlayers").append(
					$("<div id='info"+player.name+"'/></div>").append(
						$("<div id='info"+player.name+"Name' style='text-align: left; width :230px; float:left; color: white;'>"+player.name+"</div>")
					).append(
						$("<div id='info"+player.name+"Points' style='text-align: right; width :80px; float:left; color: white;'>"+player.points+"</div>")
					)
				);
			},0);
		}
		else {
			console.log("Couldn´t add Player because the player " + player.name + " info already exists.");
		}
	};
	
	this.updatePlayerPoints = function(playerName, playerPoints) {
		if ($("#info"+playerName+"Points") != null) {
			$("#info"+playerName+"Points").text(playerPoints);
		}
	};
	
	$(document).ready(function(){
		initComponents();
	});

};