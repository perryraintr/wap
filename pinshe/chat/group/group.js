var showDetail = function() {
	var posts = $("#posts");
	if(posts.css("display") == "block"){
		wrapper.css({"top" : "65px"});
		posts.css({"display" : "none"});
	}else{
		wrapper.css({"top" : "237px"});
		posts.css({"display" : ""});
	}
}

swiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
	spaceBetween:5,
	slidesPerView :3,
});


		function GetImage(_this){
    			_this.previousSibling.src = window.URL.createObjectURL(_this.files[0]);
	    	}
	
		function AddImage(){
    			var p = document.createElement("p");
				p.innerHTML = "<img width=\"100px\" height=\"100px\" /><input type=\"file\" id=\"file\" name=\"file\" onchange=\"GetImage(this);\"/>";
    				document.getElementById("images").appendChild(p);
    		}
    	
    		function RemoveImage(){
    			var images = document.getElementById("images");
    			var p = images.getElementsByTagName("p");
    			if(p.length > 1)
    				images.removeChild(p[p.length - 1]);
    			else
    				alert("Value cannot be null");
    		}
	

			$('#modaltrigger').leanModal({
				top:44,
				overlay:0.45,
				closeButton:".btn-close"
			});

//var swiper = new Swiper('.swiper-container', {
//	pagination: '.swiper-pagination',
//	paginationClickable: false,
//	spaceBetween:5,
//	slidesPerView :3,
//});
//
//var app = angular.module('chat', []);
//app.controller('group', function($scope, $http) {
//
//
//	var easemob = null; 
//	$scope.usermodel = null;
//	
//	// login 5 member avatar
//	$scope.requestmemberAvatar = function() {
//		$http.get("http://www.pinshe.org/v1/group_member.a?gid=" + GetQueryInt("gid")).success(
//			function(response) {
//				$scope.memberAvatar = response.body.array;	
//			}
//		);
//	}
//	
//	$scope.requestmemberPost = function() {
//		$http.get("http://www.pinshe.org/v1/post.a?t1=1&t2=" + GetQueryInt("gid") + "&uid=" + $scope.usermodel.guid + "&page=1").success(
//			function(response) {
//				$scope.memberPost = response.body.array;	
//				for (var i = 0; i < $scope.memberPost.length; i++) { 
//					swiper.appendSlide("<div class=\"swiper-slide\"><img src=\""+ $scope.memberPost[i].post_image +"\" align=\"top\" width=\"100%\" height=\"90px\" /></div>");
//				}
//				
//			}
//		);
//	}
//	
//	$scope.requestGroupDetail = function() {
//		$http.get("http://www.pinshe.org/v1/group.a?gid=" + GetQueryInt("gid")).success(
//			function(response) {
//				$("#memberCount").html(response.body.member_count);
//				$("#postCount").html(response.body.post_count);
//			}
//		);
//	}
//	
//	// 获取用户信息
//	if (GetQueryString("wcid").length > 0) {
//		
//		$http.get("http://www.pinshe.org/v1/user.a?wcid=" + GetQueryString("wcid")).success(
//			function(response) {
//				$scope.usermodel = response.body;
//				$scope.requestmemberAvatar();
//				$scope.requestmemberPost();
//				$scope.requestGroupDetail();
//				easemob = EasemobEx.create(GetQueryString("emid"), $scope.usermodel.guid.toString(), GetQueryString("wcid"));
//				easemob.connection();
//				easemob.listen();
//				easemob.open	();
//			}
//		);
//		
//		
//		
//	} else {
//		console.log("没有wcid");
//	}
//	
//	// 点赞
//	$scope.memberFavoriteSel = function(pid) {
//		//addfavorite.a
//		$http.get("http://www.pinshe.org/v1/addfavorite.a?pid=" + pid + "&uid=" + $scope.usermodel.guid).success(
//			function(response) {	
//				for (var i = 0; i < $scope.memberPost.length; i++) {
//					$scope.postModel = $scope.memberPost[i];
//					if ($scope.postModel.post_guid == pid) {
//						if ($scope.postModel.favorite_guid == 0) { // 已点赞
//							$scope.postModel.post_favorite += 1;
//							$scope.postModel.favorite_guid = 1;
//							easemob.sendHxTextMessage("#ASYN1#");
//						}
//					}
//				}
//			}
//		);
//	}
//	
//	// 发送消息
//	$scope.sendMessage = function(){
//		console.log("发送消息");
//		easemob.sendTextMessage($("#name").val());
//	}
//
//	// 弹框发帖子
//	$scope.addPost = function() {
//		console.log("addpost ");
//		document.getElementById("lean_overlay").style.display='none';
//		document.getElementById('loginmodal').style.display='none';
//		$scope.requestPost();
//	}
//	
//	// 发送帖子帖子信息
//	$scope.requestPost = function() {
//		var formdata = new FormData(document.getElementById("form_add"));
//		$http({
//			method: 'POST',
//			url: "http://www.pinshe.org/v1/addpost.a",
//			data: formdata,
//			headers: {
//				'Content-Type': undefined
//			},
//			transformRequest: angular.identity
//		}).success(function(response) {
//			console.log("发送帖子请求成功");
//			easemob.sendPostMessage(response.body);
//			$scope.requestmemberPost();
//			$scope.requestGroupDetail();
//		});
//	}
//	
//	// 帖子头像
//	$scope.requestPostAvatar = function(uid, post) {
//		$http.get("http://www.pinshe.org/v1/user.a?uid=" + uid).success(
//			function(response) {
//				easemob.receivePostMessage(response.body, post);
//			}
//		);
//	}
//	
//	// 接收帖子详情
//	$scope.requestDetailPost = function(uid, postid) {
//		console.log("requestDetailPost == " + uid);
//		$http.get("http://www.pinshe.org/v1/post.a?pid=" + postid + "&uid=" + $scope.usermodel.guid).success(
//			function(response) {
//				console.log("接收帖子获取帖子信息");
//				$scope.requestPostAvatar(uid, response.body);
//				$scope.requestmemberPost();
//				$scope.requestGroupDetail();
//			}
//		);	
//	}
//	
//	// 获取接收人的用户头像
//	$scope.requestDetailUser = function(uid, message) {
//		if (message == "#ASYN#") { //进群
//			$scope.requestJoinGroup();
//		} else if (message == "#ASYN1#") {
//			$scope.requestmemberPost();
//		} else {
//			$http.get("http://www.pinshe.org/v1/user.a?uid=" + uid).success(
//				function(response) {
//					easemob.receiveTextUser(response.body, message);
//				}
//			);	
//		}
//	}
//	
//	$scope.requestJoinGroup = function() {
//		$http.get("http://www.pinshe.org/v1/group.a?gid=" + GetQueryInt("gid")).success(
//			function(response) {
//				$("#memberCount").html(response.body.member_count);
//				$("#postCount").html(response.body.post_count);
//				console.log(response.body.member_count);
//				$scope.requestmemberAvatar();
//			}
//		);
//	}
//	
//	// 帖子展开收缩
//	$scope.postDetail = true;
//	$scope.detailType = function() {
//		$scope.postDetail = !$scope.postDetail;
//
//		if(wrapper.css("top") == "237px")
//			wrapper.css({"top" : "65px"});
//		else
//			wrapper.css({"top" : "237px"});
//	}
//});