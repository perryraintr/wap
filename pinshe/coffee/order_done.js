var app = angular.module("coffee", []);
app.controller("order_done", function($scope, $http) {

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//	$scope.wcid = "o1D_JwGiLMukMtRIo6HU5M0ngxPs";
	//	$scope.wcid = "o1D_JwFbCrjU1rPJdO6-ljRQC5qE";	
	//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.amount = GetQueryString("amount");
	$scope.orderno = GetQueryString("orderno");
	$scope.from = GetQueryString("from");
	$scope.time = GetQueryInt("time");

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;

		$scope.getOrderDetail();
	});

	$scope.getOrderDetail = function() {
		$http.get(getHeadUrl() + "order.a?orderno=" + $scope.orderno).success(function(response) {
			$scope.orderDetail = response.body;
			if($scope.orderDetail.status == 1) {
				var currentDate = new Date();
				if(currentDate.getTime() - $scope.time < 15000) { // 发送
					if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg") {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {});
						});
					} else {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
								$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
									$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {});
								});
							});
						});
					}
				}
			}

		});
	}

	$scope.shareCoupon = function() {
		location.href = "coupon_share.html?from=" + $scope.from;
	}

});