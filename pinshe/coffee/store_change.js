var app = angular.module("coffee", []);
app.controller("store_change", function($scope, $http) {

	$scope.storeTel = getStoreTel();
	//	$scope.storeTel = "13661060130";
	//	$scope.storeTel = "13524556007";
	//	$scope.storeTel = "13241991175";

	if($scope.storeTel.length == 0) {
		location.href = "store_login.html";
		return;
	}
	
	$scope.sid = GetQueryInt("sid");
	
	$http.get(getHeadUrl() + "merchant.a?phone=" + $scope.storeTel).success(function(response) {
		$scope.member = response.body;
		$scope.getList();
	});

	$scope.getList = function() {
		$http.get(getHeadUrl() + "store.a?mid=" + $scope.member.guid).success(function(response) {
			$scope.storeList = response.body.array;
			for(var i = 0; i < $scope.storeList.length; i++) {
				if($scope.sid == $scope.storeList[i].guid) {
					$scope.storeList[i].status = 1;
				} else {
					$scope.storeList[i].status = 0;
				}
			}
		});
	}

});