var app = angular.module("coffee", []);
app.controller("qrcode_done", function($scope, $http) {
	$("#bodyId").hide();
	$scope.orderno = GetQueryString("orderno");
//	$scope.orderno = 1475906846663;
	if($scope.orderno.length == 0) {
		layer.msg("参数错误");
		return;
	} else {
		$("#bodyId").show();
	}
	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
	
	$scope.getUrl = getHeadUrl();
//	$scope.getUrl = "http://192.168.2.104/v1/";
	
	$http.get($scope.getUrl + "order.a?orderno=" + $scope.orderno).success(function(response) {
		$scope.order = response.body;
		if($scope.order.status == 1) {
			
			if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg") {
				$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
					$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
					});
				});
			} else {
				$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
					$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.order.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							});
						});
					});
				});
			}
			
		}
	});

	var followIndex = 0;
	$scope.followClicked = function() {
		//页面层-会员确定
		followIndex = layer.open({
			type: 1,
			title: false,
			area: ['80%', ''], //宽高
			closeBtn: 0,
			shadeClose: true,
			skin: 'yourclass',
			content: $("#followId")
		});
	}

});