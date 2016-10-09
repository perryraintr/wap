var app = angular.module("coffee", []);
app.controller("qrcode_cafepay", function($scope, $http) {
	$("#bodyId").hide();
	$scope.id = GetQueryInt("sid");
	//	$scope.id = 66;
	if($scope.id == undefined || $scope.id == 0) {
		layer.msg("无效的咖啡馆");
		return;
	} else {
		$("#bodyId").show();
	}

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";
	if($scope.wcid.length == 0) {
		var sd = localStorage.getItem("goBase");
		if(sd != undefined && sd.length > 0) {
			localStorage.setItem("goBase", "");
			location.href = "go.html?url=" + location.href;
			return;
		} else {
			localStorage.setItem("goBase", "goBase");
			location.href = "go_base.html?url=" + location.href;
			return;
		}
	}

	$scope.getUrl = getHeadUrl();
	//	$scope.getUrl = "http://192.168.2.104/v1/";

	var redIndex = 0;
	$scope.isPay = false;
	$http.get($scope.getUrl + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
		$scope.getDetail();
	});

	$scope.getDetail = function() {
		$http.get($scope.getUrl + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			$scope.paramStr = "-3-" + $scope.id;
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);

		});
	}

	$scope.payClicked = function(formWx) {
		var orderAddParamData = {
			"mid": $scope.member.guid,
			"count": 1,
			"amount": $scope.money,
			"sids": $scope.id + ",",
			"counts": "1",
			"current": $scope.money,
			"amounts": $scope.money + ","
		};

		$http({
			method: 'POST',
			url: getHeadUrl() + "order_add.a",
			data: $.param(orderAddParamData),
			headers: {
				'Content-Type': "application/x-www-form-urlencoded"
			},
			transformRequest: angular.identity
		}).success(function(response) {
			console.log(response.body);
			if(response.body.guid != undefined && response.body.guid > 0) {
				// 有id，创建成功
				$scope.order = response.body;

				if(formWx) { // 微信
					$http.get($scope.getUrl + "order_modify.a?id=" + $scope.order.guid + "&type=2").success(function(response) {
						location.href = $scope.getUrl + "pay/wechat_pay.a?type=1&wcid=" + $scope.wcid + "&order_no=" + $scope.order.order_no + $scope.paramStr + "&amount=" + $scope.order.amount * 100;
					});

				} else { // 会员
					$scope.payMoney = $scope.member.current - $scope.money;
					$scope.payMoney = $scope.payMoney.toFixed(2);
					$http.get($scope.getUrl + "member_modify.a?id=" + $scope.member.guid + "&current=" + $scope.payMoney).success(function(response) {
						$http.get($scope.getUrl + "order_modify.a?id=" + $scope.order.guid + "&type=1&status=1").success(function(response) {
							$http.get($scope.getUrl + "cash_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&oid=" + $scope.order.guid + "&amount=" + $scope.order.amount + "&type=1&status=1").success(function(response) {}).finally(function() {
								location.href = "qrcode_done.html?orderno=" + $scope.order.order_no;
							});
						});
					});
				}
			}
		});
	}

	$scope.member_modify = function() {
		$http.get($scope.getUrl + "member.a?wcid=" + $scope.wcid).success(function(response) {
			$scope.member = response.body;
			if($scope.member.current >= $scope.money) { // 会员剩余的钱够支付
				$scope.payClicked(false);
			} else {
				layer.msg("你的余额不足哦", {
					time: 0,
					btn: ['确定'],
					yes: function(index) {
						$scope.isPay = false;
						layer.close(index);
					}
				});
			}
		});
	}

	$scope.wxpayAction = function() {
		if($scope.member == null || $scope.member.guid == 0) {
			layer.msg("无效用户");
			return;
		}
		if($scope.id == 0) {
			layer.msg("无效咖啡馆");
			return;
		}

		$scope.money = document.getElementById("money").value;

		if($scope.money.length == 0) {
			layer.msg("请输入金额");
			return;
		}

		if(!$scope.isPay) {
			$scope.isPay = true;
			$scope.payClicked(true);
		}
	}

	$scope.memberpayAction = function() {
		if($scope.member == null || $scope.member.guid == 0) {
			layer.msg("无效用户");
			return;
		}
		if($scope.id == 0) {
			layer.msg("无效咖啡馆");
			return;
		}

		$scope.money = document.getElementById("money").value;

		if($scope.money.length == 0) {
			layer.msg("请输入金额");
			return;
		}

		if(!$scope.isPay) {
			$scope.isPay = true;
			$scope.member_modify();
		}
	}

});