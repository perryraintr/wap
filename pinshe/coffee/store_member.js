var app = angular.module("coffee", []);
app.controller("store_member", function($scope, $http) {

	$scope.storeTel = getStoreTel();
	//	$scope.storeTel = "13661060130";
//		$scope.storeTel = "13524556007";
	//	$scope.storeTel = "13241991175";
	if($scope.storeTel.length == 0) {
		location.href = "store_login.html";
		return;
	}

	$scope.sid = GetQueryInt("sid");

//	$scope.sid = 66;
//		$scope.mid = 626;

	$http.get(getHeadUrl() + "store_member.a?sid=" + $scope.sid).success(function(response) {
		$scope.memberList = [];
		if(response.body.array != undefined && response.body.array.length > 0) {
			$scope.memberList = response.body.array;
		}
	});

	$scope.deleteMember = function(row, index) {
		layer.msg("确定删除店铺成员", {
			time: 0,
			btn: ['确定', '取消'],
			yes: function(index) {
				layer.close(index);
				$http.get(getHeadUrl() + "store_member_remove.a?id=" + row.guid).success(function(response) {
					if(response.body.guid != undefined && response.body.guid > 0) {
						layer.msg("删除成功");
						location.reload();
					}
				});
			}
		});

	}

});