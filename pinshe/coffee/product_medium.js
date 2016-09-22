var app = angular.module("coffee", []);
app.controller("product_medium", function($scope, $http) {

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var swiper = new Swiper('.swiper-container-ad', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		loop: true
	});

	var swiperNew = new Swiper(".swiper-container-new", {
		spaceBetween: 0,
		slidesPerView: 1.1,
	});
	var swiperSlide = $("#swiperSlide").html();

	$scope.newItems = [];
	$scope.bestsellerItems = [];
	$scope.otherItems = [];

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getList();
	});

	//(1:品社X系列 2:至臻精选 3:名庄限量)
	$scope.getList = function() {
		$http.get(getHeadUrl() + "commodity.a?t0=2").success(function(response) {

			$("#swiperwrapper").html("");
			for(var i = 0; i < response.body.array.length; i++) {
				$scope.item = response.body.array[i];

				if($scope.item.description != undefined && $scope.item.description.length > 64) {
					$scope.item.description = $scope.item.description.toTrim(64, "...");
				}
				//(1:bestseller 2:import 3:new)
				if($scope.item.t1 == 1) {
					$scope.bestsellerItems.push($scope.item);
				} else if($scope.item.t1 == 3) {
					$scope.newItems.push($scope.item);
					swiperNew.appendSlide(_.template($('#templateSwiper').html())($scope.item));
				} else if($scope.item.t1 == 5) {
					$scope.bestsellerItems.push($scope.item);
					$scope.newItems.push($scope.item);
					swiperNew.appendSlide(_.template($('#templateSwiper').html())($scope.item));
				} else {
					$scope.otherItems.push($scope.item);
				}
			}

			var imgs = document.getElementById("swiperwrapper").getElementsByClassName("picture");
			for(var i = 0; i < imgs.length; i++) {
				imgs[i].height = $(window).width() * 0.9 * 900 / 1242.0;
			}
			$scope.initWx(); 
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
					title: "品社精选",
					desc: "品社精选", // 分享描述
					link: location.href,
					imgUrl: $scope.newItems[0].image
				});
				wx.onMenuShareTimeline({
					title: "品社精选",
					desc: "品社精选", // 分享标题
					link: location.href, // 分享链接
					imgUrl: $scope.newItems[0].image // 分享图标
				});
			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});
	}

});