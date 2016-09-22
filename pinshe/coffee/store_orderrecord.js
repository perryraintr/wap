var app = angular.module("coffee", []);
app.controller("store_orderrecord", function($scope, $http) {

	$scope.sid = GetQueryString("sid");
//	$scope.sid = 70;
	$scope.sid = $scope.sid > 0 ? $scope.sid : "all";

	$scope.orderList = [];

	$http.get(getHeadUrl() + "order.a?sid=" + $scope.sid + "&page=1").success(function(response) {

		for(var i = 0; i < response.body.array.length; i++) {
			$scope.order = response.body.array[i];
			$scope.order.status_str = "订单已完成";
			if ($scope.order.status != 0 || $scope.order.status != 4) {
				$scope.orderList.push($scope.order);
			}
			
		}

	});

});