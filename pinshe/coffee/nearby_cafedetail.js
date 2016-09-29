var app = angular.module("coffee", []);
app.controller("nearby_cafedetail", function($scope, $http) {
	$scope.wcid = getwcid();
	$scope.id = GetQueryInt("id");
	
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//	$scope.wcid = "o1D_JwGiLMukMtRIo6HU5M0ngxPs";
//	$scope.id = 62;
	
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.isExpand = false;
	$scope.description = "";
	$scope.feature2 = [];
	$scope.feature1 = [];
	$scope.page = 1;
	$scope.commentList = [];
	$scope.resultArray = [];

	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoplay: 2000,
		loop: true
	});

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
		$scope.getDetail();
	});

	$scope.getDetail = function() {
		$http.get(getHeadUrl() + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			$scope.store.posterUrl = "";
			if($scope.store.video.length > 0) {
				$("#videoId").show();
				$scope.store.posterUrl = $scope.store.video.replace(".mp4", ".jpg");
			}

			$("#swiperwrapper").html("");
			for(var i = 0; i < $scope.store.images.length; i++) {
				swiper.appendSlide(_.template($('#templateSwiper').html())($scope.store.images[i]));
			}

			var itemimgs = document.getElementById("swiperwrapper").getElementsByClassName("picture");
			for(var i = 0; i < itemimgs.length; i++) {
				itemimgs[i].height = $(window).width() * 900 / 1242.0;
			}

			$scope.store.feature1 = $scope.store.feature1.split(",");
			$scope.resultFeature1 = [];
			for(var x = 0; x < Math.ceil($scope.store.feature1.length / 4); x++) {
				var start = x * 4;
				var end = start + 4;
				$scope.resultFeature1.push($scope.store.feature1.slice(start, end));
			}

			$scope.store.feature2 = $scope.store.feature2.split(",");
			$scope.resultFeature2 = [];
			for(var x = 0; x < Math.ceil($scope.store.feature2.length / 4); x++) {
				var start = x * 4;
				var end = start + 4;
				$scope.resultFeature2.push($scope.store.feature2.slice(start, end));
			}

			$scope.store.description = $scope.store.description.replace(/\n/g, "<br/>");
			$scope.description = $scope.store.description;

			if($scope.store.description.length > 150) {
				$scope.store.description = $scope.store.description.toTrim(150, "...");
			}
			$("#descriptionId").html($scope.store.description);

			$scope.store.date = $scope.store.date.replace(/\n/g, "<br/>");
			$("#dateId").html($scope.store.date);

			$scope.store.phone = $scope.store.phone.replace(/\n/g, "<br/>");
			$("#phoneId").html($scope.store.phone);

			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}
			$scope.initWx();
			$scope.getCommentList();
		});
	}

	$scope.getCommentList = function() {
		$http.get(getHeadUrl() + "store_comment.a?sid=" + $scope.id + "&page=" + $scope.page).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.commentModelList = response.body.array;
				for(var i = 0; i < $scope.commentModelList.length > 0; i++) {
					$scope.commentList.push($scope.commentModelList[i]);
				}
			} else {
				if($scope.page != 1) {
					$scope.page -= 1;
					layer.msg("没有更多评价");
				}
			}
		});
	}
	
	$scope.initWx = function() {
		$http.get(getHeadUrl() + "wechat_sign.a?url=" + encodeURIComponent(location.href)).success(function(response) {
			$scope.wecharSign = response;
			wx.config({
				debug: false,
				appId: $scope.wecharSign.appId,
				timestamp: $scope.wecharSign.timestamp,
				nonceStr: $scope.wecharSign.nonceStr,
				signature: $scope.wecharSign.signature,
				jsApiList: [
					"checkJsApi",
					"onMenuShareTimeline",
					"onMenuShareAppMessage",
				]
			});

			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: [
						"onMenuShareTimeline",
						"onMenuShareAppMessage",
					]
				});
				wx.onMenuShareAppMessage({
					title: $scope.store.name ,
					desc: $scope.store.slogan, // 分享描述
					link: "http://www.pinshe.org/html/v1/coffee/nearby_cafedetail.html?id=" + $scope.id,
					imgUrl: $scope.store.image
				});
				wx.onMenuShareTimeline({
					title: $scope.store.name + ": " + $scope.store.slogan,
					desc: $scope.store.name + ": " + $scope.store.slogan, // 分享标题
					link: "http://www.pinshe.org/html/v1/coffee/nearby_cafedetail.html?id=" + $scope.id, // 分享链接
					imgUrl: $scope.store.image // 分享图标
				});
			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});
	}
	
	$scope.readDescription = function() {
		$scope.isExpand = true;
		$scope.store.description = $scope.description;
		$("#descriptionId").html($scope.store.description);
	}

	$scope.moreCommend = function() {
		$scope.page += 1;
		$scope.getCommentList();
	}

});