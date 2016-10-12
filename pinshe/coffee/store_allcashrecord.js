var app = angular.module("coffee", []);
app.controller("store_allcashrecord", function($scope, $http) {

	$scope.sid = GetQueryInt("sid");
	$scope.cashList = [];
	$scope.isMyOpen = false;
//	$scope.sid = 59;
	
	$http.get(getHeadUrl() + "store.a?id=" + $scope.sid).success(function(response) {
		$scope.store = response.body;
		
		$scope.getList();
	});
	
	$scope.getList = function() {
		$http.get(getHeadUrl() + "store_member.a?sid=" + $scope.sid).success(function(response) {
			$scope.memberList = [];
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.memberList = response.body.array;
			}
		});

		// store_cash
		$http.get(getHeadUrl() + "store_cash.a?sid=" + $scope.sid + "&page=1").success(function(response) {
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

});