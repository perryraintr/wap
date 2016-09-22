var app = angular.module("coffee", []);
app.controller("my_order", function($scope, $http) {

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.myOrderList = [];
	$scope.isFinished = false;

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getList();
	});

	$scope.getList = function() {
		$http.get(getHeadUrl() + "order.a?page=1&mid=" + $scope.member.guid).success(function(response) {
			$scope.isFinished = true;
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.myOrderList = response.body.array;
				for(var i = 0; i < $scope.myOrderList.length; i++) {
					$scope.myOrder = $scope.myOrderList[i];

					switch($scope.myOrder.status) {
						case 0:
							$scope.myOrder.status_str = "订单未付款";
							break;
						case 1:
							$scope.myOrder.status_str = "订单已付款";
							break;
						case 2:
							$scope.myOrder.status_str = "订单已发货";
							break;
						case 3:
							$scope.myOrder.status_str = "订单已完成";
							break;
						case 4:
							$scope.myOrder.status_str = "订单已取消";
							break;
						default:
							break;
					}

					if($scope.myOrder.details[0].commodity_guid == 111 || $scope.myOrder.details[0].commodity_guid == 112 || $scope.myOrder.details[0].commodity_guid == 113 || $scope.myOrder.details[0].commodity_guid == 114 || $scope.myOrder.details[0].commodity_guid == 126) { //会员订单
						$scope.myOrder.isMemberOrder = true;
					} else {
						$scope.myOrder.isMemberOrder = false;
					}
				}
			}

		});
	}

	$scope.modifyOrder = function(model) {
		$scope.commodityguid = "";
		$scope.counts = 0;
		for(var i = 0; i < model.details.length; i++) {
			$scope.commodityguid = $scope.commodityguid + model.details[i].commodity_guid + ",";
			$scope.counts = $scope.counts + model.details[i].count + ",";
		}
		$http.get(getHeadUrl() + "order_modify.a?id=" + model.guid + "&cids=" + $scope.commodityguid + "&counts=" + $scope.counts + "&status=4").success(function(response) {
			model.status_str = "订单已取消";
			model.status = 4;
			$http.get(getHeadUrl() + "coupon_member_modify.a?id=" + model.coupon_member_guid + "&status=0").success(function(response) {});
		});
	}

	$scope.storemodifyOrder = function(model) {
		$http.get(getHeadUrl() + "order_modify.a?id=" + model.guid + "&sids=" + model.details[0].store_guid + "," + "&counts=1," + "&status=4").success(function(response) {
			model.status_str = "订单已取消";
			model.status = 4;
			$http.get(getHeadUrl() + "coupon_member_modify.a?id=" + model.coupon_member_guid + "&status=0").success(function(response) {});
		});
	}
});