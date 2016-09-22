var app = angular.module("coffee", []);
app.controller("store_login", function($scope, $http) {
	
	$scope.loginMember = function() {
		var phone = document.getElementById("tel").value;
		var password = document.getElementById("password").value;
		if (phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}
		
		if (phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}
		
		if (password.length == 0) {
			layer.msg("请输入密码");
			return;
		}
		
		if (password.length < 6) {
			layer.msg("密码错误");
			return;
		}
		
		$http.get(getHeadUrl() + "login.a?phone=" + phone + "&password=" + password).success(function(response) {
			if (response.body.guid != undefined && response.body.guid > 0) {
				localStorage.setItem("store_tel", response.body.phone);
				location.href = "store_cashrecord.html";
			} else {
				layer.msg("用户名或密码错误");
			}
		});
			
	}
	
	$scope.forgetPw = function () {
		location.href = "store_modifypw.html";
	}
	
});