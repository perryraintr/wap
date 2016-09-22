var app = angular.module("coffee", []);
app.controller("coupon_detail", function($scope, $http) {

	$scope.tel = getTel();
//	$scope.tel = "";
	$scope.id = GetQueryString("id");
//	$scope.id = 71;

	$scope.isOverdue = false;
	$scope.isGet = false;
	$scope.isMemberRed = false;

	$http.get(getHeadUrl() + "coupon.a?id=" + $scope.id).success(function(response) {
		$scope.coupon = response.body;
		$scope.getRedPakage();
	});

	$scope.loginMember = function() {
		var phone = document.getElementById("tel").value;

		if(phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}

		if(phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}

		if($scope.tel.length == 0) {
			$scope.creatMember(phone);
			return;
		}

		$http.get(getHeadUrl() + "login.a?wcid=" + $scope.wcid + "&phone=" + phone).success(function(response) {
			$scope.member = response.body;
			if(response.body.guid != undefined && response.body.guid > 0) {
				$scope.tel = response.body.phone;
				localStorage.setItem("wid", response.body.wechat_id);
				localStorage.setItem("tel", response.body.phone);
				$scope.getRedPakage();
			} else {
				layer.msg("微信客户端不可用");
			}
		});

	}

	$scope.creatMember = function(phone) {
		$http.get(getHeadUrl() + "member_add.a?phone=" + phone).success(function(response) {
			$scope.member = response.body;
			localStorage.setItem("wid", $scope.member.wechat_id);
			localStorage.setItem("tel", $scope.member.phone);
			if($scope.member.phone.length > 0) {
				$scope.tel = $scope.member.phone;
			}
			$scope.memberAddClick();
		});
	}

	$scope.getRedPakage = function() {
		var d = new Date(Date.parse($scope.coupon.expire_time.replace(/-/g, "/")));
		var currentDate = new Date();
		if(currentDate < d && $scope.coupon.current > 0) { // 没过期

			if($scope.tel.length == 0) {
			} else {
				$http.get(getHeadUrl() + "member.a?phone=" + $scope.tel).success(function(response) {
					$scope.member = response.body;
					localStorage.setItem("wid", $scope.member.wechat_id);
					localStorage.setItem("tel", $scope.member.phone);
					if($scope.member.phone.length > 0) {
						$scope.tel = $scope.member.phone;
					}
					$scope.memberAddClick();
				});
			}
			
		} else {
			$scope.isOverdue = true;
		}
	}

	$scope.memberAddClick = function() {
		if($scope.coupon.status == 1) {
			$scope.addCoupon();
		} else if($scope.coupon.status == 2) { // 会员
			if($scope.coupon.member_guid != $scope.member.guid) {
				$scope.addCoupon();
				$scope.publisher();
			} else {
				$scope.isMemberRed = true;
			}
		}
	}

	$scope.addCoupon = function() {
		$http.get(getHeadUrl() + "coupon_member_add.a?mid=" + $scope.member.guid + "&couponid=" + $scope.id + "&status=0").success(function(response) {
			$scope.isGet = true;
			if(response.body.guid != undefined && response.body.guid > 0) {} else {
				layer.msg("你已经抢过这个红包了");
			}
		});

	}

	$scope.publisher = function() {
		$http.get(getHeadUrl() + "coupon_member_add.a?mid=" + $scope.coupon.member_guid + "&couponid=" + $scope.id + "&status=0").success(function(response) {});
	}

});