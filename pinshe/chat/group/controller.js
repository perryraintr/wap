var app = angular.module('chat', []);
app.controller("group", function($scope, $http){
	$scope.byGroup = function(){
		$http.get("http://www.pinshe.org/v1/group.a?gid=" + gid).success(function(response){
			$scope.group = response.body;
		});
	}
	
	$scope.byMember = function() {
		$http.get("http://www.pinshe.org/v1/group_member.a?gid=" + gid).success(function(response){
			$scope.member = response.body.array;
		});
	}
	
	$scope.byPost = function(uid){
		$http.get("http://www.pinshe.org/v1/post.a?t1=1&t2=" + gid + "&uid=" + uid + "&page=1").success(function(response){
			$scope.post = response.body.array;
			$("#swiperwrapper").html("");
			for(var i = 0; i < response.body.array.length; i++){
				swiper.appendSlide(swiperSlide.replace("#1#", response.body.array[i].post_image).replace("#2#", response.body.array[i].user_avatar).replace("#3#", response.body.array[i].post_guid).replace("#4#", response.body.array[i].post_favorite).replace("#5#", response.body.array[i].post_name));
			}
		});
	}
	
	// 发送消息
	$scope.sendTxt = function(){
		var txt = $("#name").val();
		if(txt.length > 0){
			// add db
			
			// add html
			content.append(templateTxt.replace("#1#", "chat-sender").replace("#2#", user.avatar).replace("#3#", txt));
			refreshScroll();
			easemob.sendTextMessage(txt);
		}
	}
	
	// 弹框发帖子
	$scope.sendPost = function(){
		console.log("addpost ");
		document.getElementById("lean_overlay").style.display='none';
		document.getElementById('templateSendPost').style.display='none';
		
		var formdata = new FormData(document.getElementById("form_add"));
		$http({
			method: 'POST',
			url: "http://www.pinshe.org/v1/addpost.a",
			data: formdata,
			headers: {
				'Content-Type': undefined
			},
			transformRequest: angular.identity
		}).success(function(response){
			console.log("发送帖子请求成功");
			
			content.append(templatePost.replace("#0#", "chat-sender").replace("#1#", response.body.avatar).replace("#2#", response.body.post_image).replace("#3#", response.body.user_avatar).replace("#4#", response.body.post_favorite).replace("#5#", response.body.post_name));
			refreshScroll();
			
			$scope.byGroup();
			$scope.byPost(user.guid);
			
			easemob.sendTextMessage("post:" + response.body.post_guid);
		});
	}
	
	// 点赞
	$scope.addfavorite = function(_this, pid){
		$http.get("http://www.pinshe.org/v1/addfavorite.a?pid=" + pid + "&uid=" + user.guid).success(function(response){
			for(var i = 0; i < $scope.post.length; i++){
				if($scope.post[i].post_guid == pid){
					if($scope.post[i].favorite_guid == 0){ // 已点赞
//						$scope.post[i].post_favorite += 1;
//						$scope.post[i].favorite_guid = 1;
						
						_this.nextElementSibling.childNodes[0].innerHTML = parseInt(_this.nextElementSibling.childNodes[0].innerHTML) + 1; 
						
						easemob.sendTextMessage("#SYN1#");
					}
				}
			}
		});
	}
	
	// 获取用户信息
	if(wcid.length > 0){
		$http.get("http://www.pinshe.org/v1/user.a?wcid=" + wcid).success(function(response){
			user = response.body;
			
			$scope.byGroup();
			$scope.byMember();
			$scope.byPost(user.guid);
			
			easemob = new EasemobEx({group : emid, user : user.guid.toString(), pwd : wcid});
			easemob.connection();
			easemob.listen();
			easemob.open();

			easemob.receiveTextMessage = function(message) {
				// id "217649704140280900" type "groupchat" from "admin" to "1464840057432" data "dfgsdg"
				console.log("message.from=" + message.from + " data=" + message.data);
				
				// syn login
				if(message.data == "#SYN#"){
					$scope.byGroup();
					$scope.byMember();
					return;
				}
				
				// syn favorite
				if(message.data == "#SYN1#"){
					$scope.byPost(user.guid);
					return;
				}
				
				// post
				var rows = message.data.match(/post:\d+/g);
				if(rows != null && rows.length > 0){
					var postid = rows[0].split(":")[1];
					$http.get("http://www.pinshe.org/v1/post.a?pid=" + postid + "&uid=" + user.guid).success(function(response){
						$scope.byGroup();
						$scope.byPost(user.guid);
						
						content.append(templatePost.replace("#0#", "chat-receiver").replace("#1#", response.body.avatar).replace("#2#", response.body.post_image).replace("#3#", response.body.user_avatar).replace("#4#", response.body.post_favorite).replace("#5#", response.body.post_name));
						refreshScroll();
					});
					
					return;
				}
				
				// user
				$http.get("http://www.pinshe.org/v1/user.a?uid=" + message.from).success(function(response){
					content.append(templateTxt.replace("#1#", "chat-receiver").replace("#2#", response.body.avatar).replace("#3#", message.data));
					refreshScroll();
				});
			};
		});
	}else{
		console.log("wcid is null");
	}
});

//
//
//
////var app = angular.module('chat', []);
////app.controller('group', function($scope, $http) {
////
////
////	var easemob = null; 
////	$scope.usermodel = null;
////	
////	// login 5 member avatar
////	$scope.requestmemberAvatar = function() {
////		$http.get("http://www.pinshe.org/v1/group_member.a?gid=" + GetQueryInt("gid")).success(
////			function(response) {
////				$scope.memberAvatar = response.body.array;	
////			}
////		);
////	}
////	
////	$scope.requestmemberPost = function() {
////		$http.get("http://www.pinshe.org/v1/post.a?t1=1&t2=" + GetQueryInt("gid") + "&uid=" + $scope.usermodel.guid + "&page=1").success(
////			function(response) {
////				$scope.memberPost = response.body.array;	
////				for (var i = 0; i < $scope.memberPost.length; i++) { 
////					swiper.appendSlide("<div class=\"swiper-slide\"><img src=\""+ $scope.memberPost[i].post_image +"\" align=\"top\" width=\"100%\" height=\"90px\" /></div>");
////				}
////				
////			}
////		);
////	}
////	
////	$scope.requestGroupDetail = function() {
////		$http.get("http://www.pinshe.org/v1/group.a?gid=" + GetQueryInt("gid")).success(
////			function(response) {
////				$("#memberCount").html(response.body.member_count);
////				$("#postCount").html(response.body.post_count);
////			}
////		);
////	}
////	
////	// 获取用户信息
////	if (GetQueryString("wcid").length > 0) {
////		
////		$http.get("http://www.pinshe.org/v1/user.a?wcid=" + GetQueryString("wcid")).success(
////			function(response) {
////				$scope.usermodel = response.body;
////				$scope.requestmemberAvatar();
////				$scope.requestmemberPost();
////				$scope.requestGroupDetail();
////				easemob = EasemobEx.create(GetQueryString("emid"), $scope.usermodel.guid.toString(), GetQueryString("wcid"));
////				easemob.connection();
////				easemob.listen();
////				easemob.open	();
////			}
////		);
////		
////		
////		
////	} else {
////		console.log("没有wcid");
////	}
////	
////	// 点赞
////	$scope.memberFavoriteSel = function(pid) {
////		//addfavorite.a
////		$http.get("http://www.pinshe.org/v1/addfavorite.a?pid=" + pid + "&uid=" + $scope.usermodel.guid).success(
////			function(response) {	
////				for (var i = 0; i < $scope.memberPost.length; i++) {
////					$scope.postModel = $scope.memberPost[i];
////					if ($scope.postModel.post_guid == pid) {
////						if ($scope.postModel.favorite_guid == 0) { // 已点赞
////							$scope.postModel.post_favorite += 1;
////							$scope.postModel.favorite_guid = 1;
////							easemob.sendHxTextMessage("#ASYN1#");
////						}
////					}
////				}
////			}
////		);
////	}
////	
//
////
////	// 弹框发帖子
////	$scope.addPost = function() {
////		console.log("addpost ");
////		document.getElementById("lean_overlay").style.display='none';
////		document.getElementById('loginmodal').style.display='none';
////		$scope.requestPost();
////	}
////	
////	// 发送帖子帖子信息
////	$scope.requestPost = function() {
////		var formdata = new FormData(document.getElementById("form_add"));
////		$http({
////			method: 'POST',
////			url: "http://www.pinshe.org/v1/addpost.a",
////			data: formdata,
////			headers: {
////				'Content-Type': undefined
////			},
////			transformRequest: angular.identity
////		}).success(function(response) {
////			console.log("发送帖子请求成功");
////			easemob.sendPostMessage(response.body);
////			$scope.requestmemberPost();
////			$scope.requestGroupDetail();
////		});
////	}
////	
////	// 帖子头像
////	$scope.requestPostAvatar = function(uid, post) {
////		$http.get("http://www.pinshe.org/v1/user.a?uid=" + uid).success(
////			function(response) {
////				easemob.receivePostMessage(response.body, post);
////			}
////		);
////	}
////	
////	// 接收帖子详情
////	$scope.requestDetailPost = function(uid, postid) {
////		console.log("requestDetailPost == " + uid);
////		$http.get("http://www.pinshe.org/v1/post.a?pid=" + postid + "&uid=" + $scope.usermodel.guid).success(
////			function(response) {
////				console.log("接收帖子获取帖子信息");
////				$scope.requestPostAvatar(uid, response.body);
////				$scope.requestmemberPost();
////				$scope.requestGroupDetail();
////			}
////		);	
////	}
////	
////	// 获取接收人的用户头像
////	$scope.requestDetailUser = function(uid, message) {
////		if (message == "#ASYN#") { //进群
////			$scope.requestJoinGroup();
////		} else if (message == "#ASYN1#") {
////			$scope.requestmemberPost();
////		} else {
////			$http.get("http://www.pinshe.org/v1/user.a?uid=" + uid).success(
////				function(response) {
////					easemob.receiveTextUser(response.body, message);
////				}
////			);	
////		}
////	}
////	
////	$scope.requestJoinGroup = function() {
////		$http.get("http://www.pinshe.org/v1/group.a?gid=" + GetQueryInt("gid")).success(
////			function(response) {
////				$("#memberCount").html(response.body.member_count);
////				$("#postCount").html(response.body.post_count);
////				console.log(response.body.member_count);
////				$scope.requestmemberAvatar();
////			}
////		);
////	}
////	
////	// 帖子展开收缩
////	$scope.postDetail = true;
////	$scope.detailType = function() {
////		$scope.postDetail = !$scope.postDetail;
////
////		if(wrapper.css("top") == "237px")
////			wrapper.css({"top" : "65px"});
////		else
////			wrapper.css({"top" : "237px"});
////	}
////});