var app = angular.module("coffee", []);
app.controller("store_login", function($scope, $http) {

	$scope.loginMember = function() {
		var phone = document.getElementById("tel").value;
		var password = document.getElementById("password").value;
		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}

		if(password.length == 0) {
			layer.msg("请输入密码");
			return;
		}

		if(password.length < 6) {
			layer.msg("密码错误");
			return;
		}

		$http.get(getHeadUrl() + "login.a?phone=" + phone + "&password=" + password).success(function(response) {
			if(response.body.guid != undefined && response.body.guid > 0) {
				$scope.member = response.body;
				localStorage.setItem("store_tel", $scope.member.phone);
				$scope.checkStore();

			} else {
				layer.msg("用户名或密码错误");
			}
		});
	}

	$scope.checkStore = function() {
		$http.get(getHeadUrl() + "store.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				// 该人是店长
				$scope.hasStore = true;
				location.href = "store_managelist.html";
			} else {
				$scope.hasStore = false;
				// 查询是否是店员
				$scope.checkStoreMember();
			}
		});
	}

	$scope.checkStoreMember = function() {
		$http.get(getHeadUrl() + "store_member.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.storeMember = response.body.array[0];
				localStorage.setItem("store_guid", $scope.storeMember.store_guid);
				location.href = "store_cashrecord.html";
			} else {
				layer.msg("你还未加入品社咖啡馆！如果你是店长，请联系品社客服；如果你是店员，请联系你的店长。", {
					time: 0,
					btn: ['确定'],
					yes: function(index) {
						layer.close(index);
					}
				});
			}
		});
	}

	$scope.forgetPw = function() {
		location.href = "store_modifypw.html";
	}

});