var app = angular.module("coffee", []);
app.controller("qrcode_done", function($scope, $http) {
	$("#bodyId").hide();
	$scope.orderno = GetQueryString("orderno");
	$scope.id = GetQueryInt("id");
//		$scope.orderno = 1476842595761;
//		$scope.id = 87;
	if($scope.orderno.length == 0 || $scope.id == 0) {
		layer.msg("参数错误");
		return;
	} else {
		$("#bodyId").show();
	}
	$scope.wcid = getwcid();
//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.getUrl = getHeadUrl();
//		$scope.getUrl = "http://192.168.0.138/v1/";

	$http.get($scope.getUrl + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		
		$http.get($scope.getUrl + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);
			
			$scope.getOrderDetail();

		});
	});

	$scope.getOrderDetail = function() {
		$http.get($scope.getUrl + "order.a?orderno=" + $scope.orderno).success(function(response) {
			$scope.orderDetail = response.body;

			if($scope.orderDetail.status != 0) {
				$scope.orderDetail.status_str = "订单已完成";
				if($scope.store.merchant_wechat_id.length > 0) {
					$http.get($scope.getUrl + "wechat_send.a?wcid=" + $scope.store.merchant_wechat_id + "&m=成功收取" + $scope.orderDetail.amount + "元, 付款人" + $scope.member.name + ", 订单号: " + $scope.orderDetail.order_no + "。").success(function(response) {}).finally(function() {});
				}
				if ($scope.store.merchant_getui_id.length > 0) {
					$http.get($scope.getUrl + "getui.a?cid=" + $scope.store.merchant_getui_id + "&title=成功收取" + $scope.orderDetail.amount + "元, 付款人" + $scope.member.name + ", &body=订单号: " + $scope.orderDetail.order_no + "。").success(function(response) {});
				}
				for(var i = 0; i < $scope.store.store_member.length; i++) {
					$scope.storeMemberWcid = $scope.store.store_member[i].wechat_id;
					$http.get($scope.getUrl + "wechat_send.a?wcid=" + $scope.storeMemberWcid + "&m=成功收取" + $scope.orderDetail.amount + "元, 付款人" + $scope.member.name + ", 订单号: " + $scope.orderDetail.order_no + "。").success(function(response) {}).finally(function() {});
					if ($scope.store.store_member[i].getui_id.length > 0) {
						$http.get($scope.getUrl + "getui.a?cid=" + $scope.store.store_member[i].getui_id + "&title=成功收取" + $scope.orderDetail.amount + "元, 付款人" + $scope.member.name + ", &body=订单号: " + $scope.orderDetail.order_no + "。").success(function(response) {});
					}
				}
				$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
					$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get($scope.getUrl + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.orderDetail.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {});
					});
				});

			}
		});
	}

	$scope.followClicked = function() {
		// 完成
		$http.get($scope.getUrl + "wechat_send.a?wcid=" + $scope.wcid + "&sid=" + $scope.id + "&oid=" + $scope.orderDetail.guid).success(function(response) {
			WeixinJSBridge.call('closeWindow');
		});
	}

});