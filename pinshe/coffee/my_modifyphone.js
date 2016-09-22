var app = angular.module("coffee", []);
app.controller("my_modifyphone", function($scope, $http) {
	
	$scope.normolPhone = GetQueryString("phone");
	
	$scope.id = GetQueryString("id");
	
	$scope.modifyPhone = function() {
		var phone = document.getElementById("tel").value;
		
		if (phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}
		
		if (phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}
		
		$http.get(getHeadUrl() + "member_modify.a?id=" + $scope.id + "&phone=" + phone).success(function(response) {
			localStorage.setItem("tel", phone);
			location.href = "my_member.html";
		});
			
	}
	
});