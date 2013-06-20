var MessagesComponent = function(container_,left_,top_) {
	var messages = [". ",". ",". "];
	var index = 0;
	var onEnterAction = function() {console.log("Action not setted!")};
	var left = left_ || "0";
	var top = top_ || "0";
	var container = container_ || $("body");

	this.addMessage = function(msg) {
		messages.push(msg);
		refresh();
	};
	
	var refresh = function() {
		$("#message0").text(messages[(messages.length-1)-index]);
		$("#message1").text(messages[(messages.length-1)-(index+1)]);
		$("#message2").text(messages[(messages.length-1)-(index+2)]);
	};
	
	this.scrollUp = function(){
		if (index < messages.length) {
			index++;
			refresh();
		}
	};
	
	this.scrollDown = function(){
		if (index > 0) {
			index--;
			refresh();
		}
		else {
			$("#message0").effect("pulsate", {times:2}, 250 );
		}
	};
	
	var scrollBottom = this.scrollBottom = function(){
		index = 0;
		refresh();
	};
	
	this.setEnterAction = function(action){
		onEnterAction = action;
	};
	
	this.getMessageInputComponent = function() {
		return $("#messageTextField");
	};
	
	var initComponents = function() { 
		container.append(
			$("<div id='messageContainer' style='position: relative; top: "+top+"px; left : "+left+"px;'></div>").append(
				$("<div id='message2' style='color: rgba(255,255,255,0.25); padding-left: 3px;z-index: -1;'></div>")
			).append(
				$("<div id='message1' style='color: rgba(255,255,255,0.5); padding-left: 3px;z-index: -1;'></div>")
			).append(
				$("<div id='message0' style='color: rgba(255,255,255,1); padding-left: 3px;z-index: -1;'></div>")
			).append(
				$("<input id='messageTextField' type='text' name='messageTextField' style='position: relative; width:100%;'>")
			)
		);
		
		setTimeout(function(){
			refresh();
			$("#messageTextField").bind('keypress', function(e) {
				if(e.keyCode==13){
					onEnterAction.apply(this, [$(this).val()]);
					$(this).val("");
				}
			});	
			$("#message2").click(function(){
				messagesComponent.scrollUp();
			});
			$("#message0").click(function(){
				messagesComponent.scrollDown();
			});
			$("#message2").hover(function(){
				$(this).css({cursor: 'pointer'});
			});
			$("#message0").hover(function(){
				$(this).css({cursor: 'pointer'});
			});
			$("#messagesContainer").mouseleave(function(){
				scrollBottom();
			});
		},0);
	};
	
	$(document).ready(function(){
		initComponents();
	});

};