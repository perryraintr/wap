var app = angular.module("coffee", []);
app.controller("nearby_cafedetailmap", function($scope, $http) {

	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	$scope.longitude = GetQueryString("longitude");
	$scope.latitude = GetQueryString("latitude");

//	$scope.longitude = 116.40384;
//	$scope.latitude = 39.938986;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var mapObject = new AMap.Map('container');
	mapObject.setZoom(13);
	var marker = new AMap.Marker({
		icon: "http://www.pinshe.org/html/v1/coffee/img1/n11.png",
		position: [$scope.longitude, $scope.latitude],
		title: "咖啡店",
		map: mapObject
	});
	mapObject.setCenter(marker.getPosition());

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;

		var height = document.documentElement.clientHeight;
		$("#container").css("height", height);
		$scope.initWx();
	});

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
					"getLocation",
				]
			});

			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: [
						"getLocation",
					]
				});
				wx.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						var speed = res.speed; // 速度，以米/每秒计
						var accuracy = res.accuracy; // 位置精度

						var marker = new AMap.Marker({
							icon: "http://www.pinshe.org/html/v1/coffee/img1/n6.png",
							position: [longitude, latitude],
							title: "本人",
							map: mapObject
						});

						var button = document.getElementById('bt');

						AMap.plugin(["AMap.Walking"], function() {
							var drivingOption = {
								map: mapObject
							};

							var walking = new AMap.Walking(drivingOption); //构造驾车导航类
							walking.search([longitude, latitude], [$scope.longitude, $scope.latitude], function(status, result) {
								button.onclick = function() {
									walking.searchOnAMAP({
										origin: result.origin,
										destination: result.destination
									});
								}
							});
						});

						mapObject.addControl(new AMap.ToolBar());
						if(AMap.UA.mobile) {
							document.getElementById('bitmap').style.display = 'none';
							bt.style.fontSize = '16px';
						} else {
							bt.style.marginRight = '10px';
						}
					}
				});

			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});

	}

});