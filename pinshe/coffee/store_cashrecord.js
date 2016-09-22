var app = angular.module("coffee", []);
app.controller("store_cashrecord", function($scope, $http) {

	$scope.storeTel = getStoreTel();
//	$scope.storeTel = "13661060130";
//	$scope.storeTel = "13524556007";
	$scope.storeTel = "13241991175";
	
	if($scope.storeTel.length == 0) {
		location.href = "store_login.html";
		return;
	}
	$scope.hasStore = false;
	
	$http.get(getHeadUrl() + "member.a?phone=" + $scope.storeTel).success(function(response) {
		$scope.member = response.body;
		$scope.checkStore();
	});

	$scope.checkStore = function() {
		$http.get(getHeadUrl() + "store.a?mid=" + $scope.member.guid).success(function(response) {
			if (response.body.guid != undefined && response.body.guid > 0) {
				$scope.hasStore = true;
				$scope.sid = response.body.guid;
				$scope.getList();	
			}
			$scope.hasStoreFinished = true;
		});
	}

	$scope.cashList = [];

	$scope.getList = function() {
		$http.get(getHeadUrl() + "cash.a?sid=" + $scope.sid + "&page=1").success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				for(var i = 0; i < response.body.array.length; i++) {
					$scope.cash = response.body.array[i];
					if($scope.cash.type == -1) {
						switch($scope.cash.status) {
							case 0:
								$scope.cash.status_str = "提现中";
								break;
							case 1:
								$scope.cash.status_str = "提现完成";
								break;
							default:
								break;
						}
					}
					$scope.cashList.push($scope.cash);
				}
			}
			$scope.isFinished = true;
		});
	}
	
	$scope.loginOut = function() {
		localStorage.setItem("store_tel", "");
		location.href = "store_login.html";
	}

});