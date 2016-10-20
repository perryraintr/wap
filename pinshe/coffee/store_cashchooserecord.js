var app = angular.module("coffee", []);
app.controller("store_cashchooserecord", function($scope, $http) {
	$("#dateDivId").hide();
	$scope.storeTel = getStoreTel();
	$scope.sid = GetQueryInt("sid") ;
	$scope.cashList = [];
	
	//	$scope.storeTel = "13661060130";
	//	$scope.storeTel = "13241991175";
//		$scope.storeTel = "13524556007";
//		$scope.sid = 80;

	if($scope.storeTel.length == 0) {
		location.href = "store_login.html";
		return;
	}
	
//	$scope.currentDay = 20161013;
//	alert($scope.currentDay);
	$http.get(getHeadUrl() + "merchant.a?phone=" + $scope.storeTel).success(function(response) {
		$scope.member = response.body;
	});
	
	$scope.searchClicked = function () {
		$scope.dateStr = document.getElementById("dateId").value;
		if ($scope.dateStr.length != 8 && isNaN($scope.dateStr) == true) {
			layer.msg("输入正确的年月日");
			return;
		}
		
		$scope.getList();
	}
	
	$scope.getList = function() {
		$http.get(getHeadUrl() + "store_cash.a?sid=" + $scope.sid + "&date=" + $scope.dateStr).success(function(response) {
			$scope.cashList = [];
			$scope.storeAmount = 0;
			$scope.storeCount = 0;
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.storeAmount = response.body.amount;
				$scope.storeCount = response.body.count;
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
			$("#dateDivId").show();
			$scope.isFinished = true;
		});
	}

	$scope.loginOut = function() {
		layer.msg("确定退出登录？", {
			time: 0,
			btn: ['确定', '取消'],
			yes: function(index) {
				layer.close(index);
				localStorage.setItem("store_tel", "");
				localStorage.setItem("store_guid", "");
				location.href = "store_login.html";
			}
		});
	}

	$scope.myClicked = function() {
		$scope.isMyOpen = !$scope.isMyOpen;
	}

});