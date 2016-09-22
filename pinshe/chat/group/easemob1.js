//var easemob = EasemobEx.create("1464840057432", "Vivian", "111111");
//easemob.connection();
//easemob.listen();
//easemob.open();
//easemob.sendTextMessage("sdfasdf");

//var easemob;
//function init(){
//	easemob = EasemobEx.create("1464840057432", "Vivian", "111111");
//	easemob.connection();
//	easemob.listen();
//	easemob.open();
//}
//function send(){
//	easemob.sendTextMessage("sdfasdf");
//}

var EasemobEx = {
	group : "",
	user : "",
	pwd : "",
	xmppURL: "im-api.easemob.com",
    apiURL: "https://a1.easemob.com",
    appkey: "pinshe-chat#pinshe",
    https : true,
    multiResources: false,
	
	create : function(group,user,pwd){
		EasemobEx.group = group;
		EasemobEx.user = user;
		EasemobEx.pwd = pwd;
		return EasemobEx;
	},
	
　　　connection　: function(){
		console.log("connection");
		conn = new Easemob.im.Connection({
			multiResources : EasemobEx.multiResources,
			https : EasemobEx.https,
			url : EasemobEx.xmppURL
		});
	},

	open : function(){
		console.log("open");
		conn.open({
			apiUrl : EasemobEx.apiURL,
			user : EasemobEx.user,
			pwd : EasemobEx.pwd,
			appKey : EasemobEx.appkey
		});
	},

	join : function(){
		console.log("join");
		conn.join({roomId : EasemobEx.groupId});
		EasemobEx.sendHxTextMessage("#ASYN#");
	},

	listen : function(){
		conn.listen({
			onOpened : function(){
				EasemobEx.handleOpen(conn);
			},
			onClosed : function() {
				EasemobEx.handleClosed(conn);
			},
			onError: function(message) {
				EasemobEx.handleError(message);
			},
			onTextMessage : function(message) {
				EasemobEx.handleTextMessage(message);
			}
			
		});
	},

	handleOpen　: function(conn) {
		console.log(conn.context.userId);
		conn.setPresence();
		EasemobEx.join(EasemobEx.group);
	},
	
	handleClosed　: function(conn) {
		console.log("handleClosed");
		conn.clear();
		conn.close();

//		EasemobEx.connection();
//		EasemobEx.listen();
//		EasemobEx.open();
	},
	
	handleError : function(message){
		console.log(message.msg + " " + message.reconnect + " " + message.type);
		EasemobEx.handleClosed(conn);
	},
	
	handleTextMessage : function(message){
		console.log(message.from);
		receiveTextMessage(message);
	},
	
	sendHxTextMessage: function(message) {
		var options = {
			to : EasemobEx.group,
			msg : message,
			type : "groupchat"
		};
		conn.sendTextMessage(options);
	},
	
	sendTextMessage : function(message){
		console.log("sendTextMessage" + message);
		sendTextMessage(message);
		EasemobEx.sendHxTextMessage(message);
	},
	
	sendPostMessage: function(message) {
		sendPostMessage(message);
		
		var options = {
			to : EasemobEx.group,
			msg : "post:" +  message.post_guid.toString(),
			type : "groupchat"
		};
		conn.sendTextMessage(options);
	},
	
	receiveTextUser: function(user, message) {
		receiveTextUser(user, message);
	},
	
	receivePostMessage: function(user, message) {
		receivePostMessage(user, message);
	}
	
};