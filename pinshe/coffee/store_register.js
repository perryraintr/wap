var app = angular.module("coffee", []);
app.controller("store_register", function($scope, $http, $interval) {
	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
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

	$scope.registerMember = function() {
		var phone = document.getElementById("tel").value;
		var password = document.getElementById("password").value;
		var telMsgCode = document.getElementById("telMsgCode").value;

		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}

		if(telMsgCode.length == 0) {
			layer.msg("请输入短信验证码");
			return;
		}

		if(password.length == 0) {
			layer.msg("请设置密码");
			return;
		}

		$http.get(getHeadUrl() + "member_add.a?wcid=" + $scope.wcid + "&phone=" + phone + "&code=" + telMsgCode + "&password=" + password).success(function(response) {
			if(response.body.guid != undefined && response.body.guid > 0) {
				if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY") {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
							location.href = "store_login.html";
						});
					});
				} else {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
								$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=有商家注册了，请审核该商品对应的咖啡馆，进行关联，手机号为：" + phone + "\n 用户id为：" + response.body.guid).success(function(response) {}).finally(function() {
									location.href = "store_login.html";
								});
							});
						});
					});
				}

			} else {
				layer.msg("注册失败");
			}
		});

	}

});