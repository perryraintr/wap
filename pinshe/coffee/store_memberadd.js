var app = angular.module("coffee", []);
app.controller("store_memberadd", function($scope, $http) {

	$scope.sid = GetQueryInt("sid");
//	$scope.sid = 66;

	$scope.addStoreMember = function() {
		var phone = document.getElementById("tel").value;

		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}

		$http.get(getHeadUrl() + "merchant_add.a?phone=" + phone).success(function(response) {
			$scope.member = response.body;

			$http.get(getHeadUrl() + "store_member_add.a?mid=" + $scope.member.guid + "&sid=" + $scope.sid).success(function(response) {
				if(response.body.guid != undefined && response.body.guid > 0) {
					layer.msg("添加成功");
					location.href = "store_member.html?sid=" + $scope.sid;
				} else {
					layer.msg("已存在该店员");
				}
			});
		});

	}

});