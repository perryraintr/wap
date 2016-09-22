//var easemob = new EasemobEx({group : emid, user : $scope.user.guid.toString(), pwd : wcid});
//easemob.connection();
//easemob.listen();
//easemob.open();
//easemob.receiveTextMessage = function(message) {};
var EasemobEx = Backbone.Model.extend({
	defaults: {
		conn : "",
		group : "",
		user : "",
		pwd : "",
		xmppURL: "im-api.easemob.com",
	    apiURL: "https://a1.easemob.com",
	    appkey: "pinshe-chat#pinshe",
	    https : true,
	    multiResources: false
	},
	
　　　connection　: function(){
		console.log("connection start");
		conn = new Easemob.im.Connection({
			multiResources : this.get("multiResources"),
			https : this.get("https"),
			url : this.get("xmppURL")
		});
		console.log("connection finish");
	},
	
	open : function(){
		console.log("open start");
		conn.open({
			apiUrl : this.get("apiURL"),
			user : this.get("user"),
			pwd : this.get("pwd"),
			appKey : this.get("appkey")
		});
		console.log("open finish");
	},

	join : function(){
		console.log("join start");
		conn.join({roomId : this.get("group")});
		this.sendTextMessage("#SYN#");
		console.log("join finish");
	},

	sendTextMessage : function(message){
		console.log("sendTextMessage start");
		var options = {
			to : this.get("group"),
			msg : message,
			type : "groupchat"
		};
		conn.sendTextMessage(options);
		console.log("sendTextMessage finish");
	},
	 
	receiveTextMessage : function(message){},
	
	listen : function(){
		console.log("listen start");
		conn.listen({
			onOpened : function(){
				handleOpen(conn);
			},
			onClosed : function(){
				handleClosed(conn);
			},
			onError: function(message){
				handleError(message);
			},
			onTextMessage : function(message){
				handleTextMessage(message);
			}
		});
		console.log("listen finish");
	}
});

var handleOpen = function(conn){
	console.log("handleOpen start");
	console.log(conn.context.userId);
	conn.setPresence();
	easemob.join();
	console.log("handleOpen finish");
}

var handleClosed　= function(conn){
	console.log("handleClosed start");
	conn.clear();
	conn.close();

	easemob.connection();
	easemob.listen();
	easemob.open();
	console.log("handleClosed finish");
}
	
var handleError = function(message){
	console.log("handleError start");
	console.log(message.msg + " " + message.reconnect + " " + message.type);
	handleClosed(easemob.get("conn"));
	console.log("handleError finish");
}
	
var handleTextMessage = function(message){
	console.log("handleTextMessage start");
	console.log(message.from);
	easemob.receiveTextMessage(message);
	console.log("handleTextMessage finish");
}