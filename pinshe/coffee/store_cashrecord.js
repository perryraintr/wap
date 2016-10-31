var app = angular.module("coffee", []);
app.controller("store_cashrecord", function($scope, $http) {

	$scope.storeTel = getStoreTel();
	if(GetQueryInt("sid") > 0) {
		localStorage.setItem("store_guid", GetQueryInt("sid"));
	}
	$scope.sid = getStoreGuid();
	$scope.cashList = [];
	$scope.isMyOpen = false;
	$scope.getui = GetQueryString("getui");
	//	$scope.storeTel = "13661060130";
	//	$scope.storeTel = "13241991175";
//		$scope.storeTel = "13524556007";
//		$scope.sid = 59;

	if($scope.storeTel.length == 0) {
		location.href = "store_login.html?getui=" + $scope.getui;
		return;
	}
	
	var currentDate = new Date();
	var year=currentDate.getFullYear(); //获取当前年份
   	var mon=currentDate.getMonth()+1; //获取当前月份
   	var da=currentDate.getDate(); //获取当前日
	$scope.currentDay = year + "" + mon + "" + da;
	$scope.currentShowDay = year + "年" + mon + "月" + da + "日";
//	$scope.currentDay = 20161013;
//	alert($scope.currentDay);
	$http.get(getHeadUrl() + "merchant.a?phone=" + $scope.storeTel).success(function(response) {
		$scope.member = response.body;
		$scope.checkStore();
	});

	$scope.checkStore = function() {
		
		$http.get(getHeadUrl() + "store.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				// 该人是店长
				$scope.isManager = true;
				if($scope.sid.length == 0) {
					$scope.sid = response.body.array[0].guid;
				}
				for(var i = 0; i < response.body.array.length; i++) {
					console.log(response.body.array[i].guid);
					if($scope.sid == response.body.array[i].guid) {
						$scope.storeName = response.body.array[i].name;
						$scope.current = response.body.array[i].current;
					}
				}
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
				$scope.current = $scope.storeMember.store_current;
				localStorage.setItem("store_guid", $scope.storeMember.store_guid);
				$scope.sid = $scope.storeMember.store_guid;
				$scope.getList();
			} else {
				layer.msg("你还未加入品社咖啡馆！如果你是咖啡馆长，请联系品社客服；如果你是店员，请联系你的馆长。", {
					time: 0,
					btn: ['确定', '取消'],
					yes: function(index) {
						layer.close(index);
						localStorage.setItem("store_tel", "");
						localStorage.setItem("store_guid", "");
						location.href = "store_login.html?getui=" + $scope.getui;
					}
				});
			}
		});
	}

	$scope.getList = function() {
		$http.get(getHeadUrl() + "store_cash.a?sid=" + $scope.sid + "&date=" + $scope.currentDay).success(function(response) {
			$scope.storeAmount = 0;
			$scope.storeCount = 0;
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.storeAmount = response.body.amount;
				$scope.storeCount = response.body.count;
				for(var i = 0; i < response.body.array.length; i++) {
					$scope.cash = response.body.array[i];
					if($scope.cash.type == -1) {
						if ($scope.cash.status == 0) {
							$scope.cash.status_str = "提现中";
						} else if ($scope.cash.status == 1) {
							$scope.cash.status_str = "提现完成";
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
				location.href = "store_login.html?getui=" + $scope.getui;
			}
		});
	}

	$scope.myClicked = function() {
		$scope.isMyOpen = !$scope.isMyOpen;
	}

});