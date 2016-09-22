var receiveTextMessage = function(message){
	// id "217649704140280900"
	// type "groupchat"
	// from "admin"
	// to "1464840057432"
	// data "dfgsdg"
	console.log("message.from = " + message.from + "data = " + message.data);
	var scope = angular.element(document.querySelector('[ng-controller=group]')).scope();
	var rows = message.data.match(/post:\d+/g);
	if(rows != null && rows.length > 0){
		// post:3222
		console.log("post");
		var id = rows[0].split(":")[1];
		scope.requestDetailPost(message.from, id);
	} else {
		scope.requestDetailUser(message.from, message.data);	
	}
	refreshScroll();
}

var sendTextMessage = function(message){
	var scope = angular.element(document.querySelector('[ng-controller=group]')).scope();
	if(message.length > 0){
		chatId.append(templateMessage.replace("#1#", "chat-sender").replace("#2#", scope.usermodel.avatar).replace("#3#", message));
		refreshScroll();
	}
}

var sendPostMessage = function(message) {
//	templatePost = templatePost.replace("#0#", "chat-sender");
//	// 发送者头像
//	templatePost = templatePost.replace("#1#", "../img/9.png");
//	// 帖子图片
//	templatePost = templatePost.replace("#2#", message.post_image);
//	// 帖子用户头像
//	templatePost = templatePost.replace("#3#", "http://www.pinshe.org/v1/image/2016/06/26/20160626161913828.jpg");
//	// 帖子点赞数
//	templatePost = templatePost.replace("#4#", message.post_favorite);
//	// 帖子名称
//	templatePost = templatePost.replace("#5#", message.post_name);
	var scope = angular.element(document.querySelector('[ng-controller=group]')).scope();
	chatId.append(templatePost.replace("#0#", "chat-sender").replace("#1#", scope.usermodel.avatar).replace("#2#", message.post_image).replace("#3#", scope.usermodel.avatar).replace("#4#", message.post_favorite).replace("#5#", message.post_name));
	refreshScroll();
}

var receiveTextUser = function(user, message) {
	chatId.append(templateMessage.replace("#1#", "chat-receiver").replace("#2#", user.avatar).replace("#3#", message));
}

var receivePostMessage = function(user, message) {
//	templatePost = templatePost.replace("#0#", "chat-receiver");
//	// 发送者头像
//	templatePost = templatePost.replace("#1#", "../img/9.png");
//	// 帖子图片
//	templatePost = templatePost.replace("#2#", message.post_image);
//	// 帖子用户头像
//	templatePost = templatePost.replace("#3#", message.user_avatar);
//	// 帖子点赞数
//	templatePost = templatePost.replace("#4#", message.post_favorite);
//	// 帖子名称
//	templatePost = templatePost.replace("#5#", message.post_name);
	chatId.append(templatePost.replace("#0#", "chat-receiver").replace("#1#", user.avatar).replace("#2#", message.post_image).replace("#3#", message.user_avatar).replace("#4#", message.post_favorite).replace("#5#", message.post_name));
	refreshScroll();
}
