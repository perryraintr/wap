var app = angular.module("coffee", []);
app.controller("nearby_cafehouse", function($scope, $http) {

	$scope.wcid = getwcid();
//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//	$scope.wcid = "o1D_JwGiLMukMtRIo6HU5M0ngxPs";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.longitude = GetQueryString("longitude");
	$scope.latitude = GetQueryString("latitude");

	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		loop: true
	});

	$scope.locationModel = {
		"longitude": 0,
		"latitude": 0
	};
	$scope.storeList = [];
	$scope.page = 1;

	$scope.getList = function() {
		var distance = 9007199254740993;
		$http.get(getHeadUrl() + "store.a?longitude=" + $scope.locationModel.longitude + "&latitude=" + $scope.locationModel.latitude + "&distance=" + distance + "&page=" + $scope.page).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.storeModelList = response.body.array;
				for(var i = 0; i < response.body.array.length; i++) {
					$scope.storeModelList[i].distanceStr = ($scope.storeModelList[i].distance / 1000).toFixed(2);

					var starNum = $scope.storeModelList[i].star / $scope.storeModelList[i].comment;
					$scope.storeModelList[i].starList = [];
					for(var j = 0; j < starNum; j++) {
						$scope.storeModelList[i].starList.push(j);
					}

					if($scope.storeModelList[i].guid == 83) {
						if (pinSheMember()) {
							$scope.storeList.push($scope.storeModelList[i]);	
						}
					} else {
						$scope.storeList.push($scope.storeModelList[i]);
					}
				}
			} else {
				if($scope.page == 1) {
					layer.msg("您周围没有商家入驻的咖啡店哦");
				} else {
					$scope.page -= 1;
					layer.msg("没有更多咖啡店");
				}
			}

			if($scope.page == 1 && $scope.storeList.length > 0) {
				wx.onMenuShareAppMessage({
					title: "附近好咖啡馆",
					desc: "全世界最好的咖啡馆", // 分享描述
					link: location.href,
					imgUrl: $scope.storeList[0].image
				});
				wx.onMenuShareTimeline({
					title: "附近好咖啡馆",
					desc: "附近好咖啡馆", // 分享标题
					link: location.href, // 分享链接
					imgUrl: $scope.storeList[0].image // 分享图标
				});
			}

		});
	}

	//	$scope.longitude = 116.40384;
	//	$scope.latitude = 39.938986;
	//	$scope.getList();

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
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
					"onMenuShareTimeline",
					"onMenuShareAppMessage",
				]
			});

			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: [
						"getLocation",
						"onMenuShareTimeline",
						"onMenuShareAppMessage",
					]
				});
				wx.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function(res) {
						var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						var speed = res.speed; // 速度，以米/每秒计
						var accuracy = res.accuracy; // 位置精度
						if(($scope.latitude > 0) || ($scope.longitude > 0)) {
							var locations = $scope.longitude + "," + $scope.latitude;
							$http.get("http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + locations + "&coordsys=gps&output=json&key=f3deedff4fa239df6844a0f292c24d1d").success(function(response) {
								$scope.locationModel.longitude = response.locations.split(",")[0];
								$scope.locationModel.latitude = response.locations.split(",")[1];
								$scope.getList();
							});
						} else {
							var locations = longitude + "," + latitude;

							$http.get("http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + locations + "&coordsys=gps&output=json&key=f3deedff4fa239df6844a0f292c24d1d").success(function(response) {
								$scope.locationModel.longitude = response.locations.split(",")[0];
								$scope.locationModel.latitude = response.locations.split(",")[1];
								$scope.getList();
							});
						}
					}
				});

			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});

	}

	$scope.moreClicked = function() {
		$scope.page += 1;
		$scope.getList();
	}

});