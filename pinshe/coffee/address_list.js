var app = angular.module("coffee", []);
app.controller("address_list", function($scope, $http) {
	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
//	$scope.wcid = "o1D_JwFbCrjU1rPJdO6-ljRQC5qE";

	$scope.orderId = GetQueryString("oid");
	$scope.tel = getTel();
	$scope.hasTel = $scope.tel.length > 0;
	
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
	
	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getList($scope.member.guid);
	});
	
	$scope.getList = function(guid) {
		$http.get(getHeadUrl() + "consignee.a?mid=" + guid).success(function(response) {
			$scope.consigneeList = response.body.array;
		});
	}
	
	// 选择当前的地址
	$scope.addChoose = function(row) {
		for (var i = 0; i < $scope.consigneeList.length; i++) {
			if ($scope.consigneeList[i].status == 1) {
				$scope.consigneeList[i].status = 0;
			}
		}
		row.status = 1;
	}
	
	$scope.deleteClicked = function(row, index) {
		$http.get(getHeadUrl() + "consignee_remove.a?id=" + row.guid).success(function(response) {
			$scope.consigneeList.splice(index, 1);
		});
	}
	
	$scope.sureAction = function() {
		if ($scope.tel.length == 0) {
			layer.msg("请输入11位中国手机号");
			return;
		}
		$scope.hasConsignee = false;
		for (var i = 0; i < $scope.consigneeList.length; i++) {
			if ($scope.consigneeList[i].status == 1) {
				$scope.hasConsignee = true;
				$scope.consignee = $scope.consigneeList[i];	
			}
		}
		
		if ($scope.hasConsignee) {
			$http.get(getHeadUrl() + "consignee_modify.a?mid=" + $scope.member.guid + "&id=" + $scope.consignee.guid + "&status=1").success(function(response) {
				location.href = "product_ordertotal.html?id=" + $scope.orderId;
			});	
		} else {
			layer.msg("请选择收获地址");
		}
		
	}
	
});