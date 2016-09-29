var app = angular.module("coffee", []);
app.controller("store_cashrecord", function($scope, $http) {

	$scope.storeTel = getStoreTel();
	if(GetQueryInt("sid") > 0) {
		localStorage.setItem("store_guid", GetQueryInt("sid"));
	}
	$scope.sid = getStoreGuid();
	$scope.cashList = [];
	$scope.isMyOpen = false;

	//	$scope.storeTel = "13661060130";
	//	$scope.storeTel = "13241991175";
	//	$scope.storeTel = "13524556007";
	//	$scope.sid = 70;

	if($scope.storeTel.length == 0) {
		location.href = "store_login.html";
		return;
	}

	$http.get(getHeadUrl() + "member.a?phone=" + $scope.storeTel).success(function(response) {
		$scope.member = response.body;
		$scope.checkStore();
	});

	$scope.checkStoreAmount = function() {
		$http.get(getHeadUrl() + "cash.a?sid=" + $scope.sid + "&page=all").success(function(response) {
			$scope.amount = response.body.amount;
		});
	}

	$scope.checkStore = function() {
		$http.get(getHeadUrl() + "store.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				// 该人是店长
				$scope.isManager = true;
				if($scope.sid.length == 0) {
					$scope.sid = response.body.array[0].guid;
				}
				for(var i = 0; i < response.body.array.length; i++) {
					if($scope.sid == response.body.array[i].guid) {
						$scope.storeName = response.body.array[i].name;
					}
				}
				$scope.checkStoreAmount();
				$scope.getList();
			} else {
				$scope.isManager = false;
				// 查询是否是店员
				$scope.checkStoreMember();
			}
		});
	}

	$scope.checkStoreMember = function() {
		$http.get(getHeadUrl() + "store_member.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.storeMember = response.body.array[0];
				$scope.storeName = $scope.storeMember.store_name;
				localStorage.setItem("store_guid", $scope.storeMember.store_guid);
				$scope.sid = $scope.storeMember.store_guid;
				$scope.checkStoreAmount();
				$scope.getList();
			} else {
				layer.msg("你还未加入品社咖啡馆！如果你是店长，请联系品社客服；如果你是店员，请联系你的店长。", {
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
		});
	}

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