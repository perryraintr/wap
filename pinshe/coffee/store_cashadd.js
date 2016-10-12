var app = angular.module("coffee", []);
app.controller("store_cashadd", function($scope, $http) {

	$scope.mid = GetQueryString("mid");
	$scope.sid = GetQueryString("sid");
	$scope.isPay = false;
	$http.get(getHeadUrl() + "merchant.a?id=" + $scope.mid).success(function(response) {
		$scope.member = response.body;
		$http.get(getHeadUrl() + "store.a?id=" + $scope.sid).success(function(response) {
			$scope.store = response.body;
		});
	});

	$scope.cashSure = function() {
		var amount = document.getElementById("amount").value;
		if(amount.length == 0) {
			layer.msg("请输入提现金额");
			return;
		}

		if(amount == 0) {
			layer.msg("提现金额不能为0元");
			return;
		}

		if(amount > $scope.store.current) {
			layer.msg("大于可提现余额");
			return;
		}
		
		if(verifyMoney(amount)) { // 验证格式正确
			if ($scope.isPay) {
				return;
			}
			$scope.isPay = true;
			$http.get(getHeadUrl() + "store_cash_add.a?sid=" + $scope.sid + "&merchantid=" + $scope.mid + "&oid=0&amount=" + amount + "&type=-1&status=0").success(function(response) {
				console.log(response.body);
				$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=有商家进行提现了，<a href='http://www.pinshe.org/admin/v1/store_cash_detail.html?id=" + response.body.guid + "'>提现详情</a>").success(function(response) {}).finally(function() {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=有商家进行提现了，<a href='http://www.pinshe.org/admin/v1/store_cash_detail.html?id=" + response.body.guid + "'>提现详情</a>").success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=有商家进行提现了，<a href='http://www.pinshe.org/admin/v1/store_cash_detail.html?id=" + response.body.guid + "'>提现详情</a>").success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=有商家进行提现了，<a href='http://www.pinshe.org/admin/v1/store_cash_detail.html?id=" + response.body.guid + "'>提现详情</a>").success(function(response) {}).finally(function() {
								location.href = "store_cashrecord.html";
							});
						});
					});
				});
			});
		} else {
			layer.msg("只能输入数字，小数点后只能保留两位");
		}

	}

});