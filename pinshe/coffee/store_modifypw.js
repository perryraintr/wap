var app = angular.module("coffee", []);
app.controller("store_modifypw", function($scope, $http, $interval) {
	
	$scope.id = GetQueryString("id");
//	$scope.id = 66;
	if ($scope.id > 0) {
		$http.get(getHeadUrl() + "member.a?id=" + $scope.id).success(function(response) {
			$scope.member = response.body;	
		});	
	}
	
	$scope.paracont = "获取验证码";
	$scope.paraclass = "but_null";
	$scope.paraevent = true;
	var second = 60,
		timePromise = undefined;
	$scope.sendphonecode = function(telphone) {
		var phone = document.getElementById("tel").value;
		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}
		
		$http.get(getHeadUrl() + "yunpian.a?phone=" + phone).success(function(response) {
			timePromise = $interval(function() {
				if(second <= 0) {
					$interval.cancel(timePromise);
					timePromise = undefined;

					second = 60;
					$scope.paracont = "重发验证码";
					$scope.paraclass = "but_null";
					$scope.paraevent = true;
				} else {
					$scope.paracont = second + "秒后可重发";
					$scope.paraclass = "not but_null";
					second--;

				}
			}, 1000, 100);
		});
	}
	
	$scope.modifyPw = function() {
		var phone = document.getElementById("tel").value;
		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}
		
		var password = document.getElementById("password").value;
		var telMsgCode = document.getElementById("telMsgCode").value;
		
		if(telMsgCode.length == 0) {
			layer.msg("请输入短信验证码");
			return;
		}

		if (password.length == 0) {
			layer.msg("请输入密码");
			return;
		}
		
		if (password.length < 6) {
			layer.msg("密码至少大于6位数");
			return;
		}
		
		$http.get(getHeadUrl() + "member.a?phone=" + phone).success(function(response) {
			$scope.member = response.body;	
	
			$http.get(getHeadUrl() + "member_modify.a?id=" + $scope.member.guid + "&code=" + telMsgCode + "&password=" + password).success(function(response) {
				if (response.body.guid != undefined && response.body.guid > 0) {
					location.href = "store_login.html";	
				} else {
					layer.msg("修改失败，手机号或验证码错误");
				}
				
			});
		});	
	}
	
});