var app = angular.module("coffee", []);
app.controller("store_allcashrecord", function($scope, $http) {

	$scope.sid = GetQueryInt("sid");
	$scope.cashList = [];
	$scope.isMyOpen = false;
//	$scope.sid = 83;
	
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
	
	$scope.modifyCash = function(row, index) {
		var total = document.getElementById(("total" + index)).value;
		console.log(document.getElementById(("total" + index)));
		console.log(total);
		$http.get(getHeadUrl() + "store_cash_modify.a?id=" + row.guid + "&total=" + total).success(function(response) {
			if (response.body.guid != undefined && response.body.guid > 0) {
				row.total = response.body.total;
				layer.msg("修改成功");
			} else {
				layer.msg("修改失败");
			}
		});

	}
	
	$scope.deleteCash = function(row, index) {
		$http.get(getHeadUrl() + "store_cash_remove.a?id=" + row.guid).success(function(response) {
			$scope.cashList.splice(index, 1);
			layer.msg("删除成功");
		});
	}
	
});