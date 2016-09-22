var app = angular.module("coffee", []);
app.controller("product_hotsale", function($scope, $http) {

	$scope.wcid = getwcid();
//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

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

	$scope.bestsellerItems = [];

	$http.get("http://interface.pinshe.org/v1/member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getList();
	});

	//热销单品，所有bestseller
	$scope.getList = function() {
		$http.get("http://interface.pinshe.org/v1/commodity.a?t1=4").success(function(response) {

			for(var i = 0; i < response.body.array.length; i++) {
				$scope.item = response.body.array[i];
				if($scope.item.description != undefined && $scope.item.description.length > 64) {
					$scope.item.description = $scope.item.description.toTrim(64, "...");
				}
				//(1:bestseller 2:import 3:new)
				$scope.bestsellerItems.push($scope.item);
			}

			$http.get("http://interface.pinshe.org/v1/commodity.a?t1=2").success(function(response) {

				for(var i = 0; i < response.body.array.length; i++) {
					$scope.item = response.body.array[i];
					
					if($scope.item.description != undefined && $scope.item.description.length > 64) {
						$scope.item.description = $scope.item.description.toTrim(64, "...");
					}
					//(1:bestseller 2:import 3:new)
					$scope.bestsellerItems.push($scope.item);
				}
				$scope.initWx();
			});

		});

	}	
	
	$scope.initWx = function() {
		$http.get("http://interface.pinshe.org/v1/wechat_sign.a?url=" + encodeURIComponent(location.href)).success(function(response) {
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
					title: "全世界最好的咖啡",
					desc: "全世界最好的咖啡", // 分享描述
					link: location.href,
					imgUrl: $scope.bestsellerItems[0].image
				});
				wx.onMenuShareTimeline({
					title: "全世界最好的咖啡",
					desc: "全世界最好的咖啡", // 分享标题
					link: location.href, // 分享链接
					imgUrl: $scope.bestsellerItems[0].image // 分享图标
				});
			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});
	}

});