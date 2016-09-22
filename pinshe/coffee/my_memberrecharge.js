var app = angular.module("coffee", []);
app.controller("my_memberrecharge", function($scope, $http) {

	$scope.mid = GetQueryString("mid");
//		$scope.mid = 66;

	$http.get(getHeadUrl() + "member.a?id=" + $scope.mid).success(function(response) {
		$scope.member = response.body;
	});

	$scope.cashSure = function() {
		var amount = document.getElementById("amount").value;
		if(amount.length == 0) {
			layer.msg("请输入充值金额");
			return;
		}

		var orderAddParamData = {
			"mid": $scope.mid,
			"count": 1,
			"amount": amount,
			"cids": "126,",
			"counts": "1,",
			"current": 0,
			"amounts": amount + ","
		};
		console.log(orderAddParamData);
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
			location.href = "product_ordertotal.html?id=" + response.body.guid;
		});

	}

	$scope.amountPrice = function(a) {
		console.log(a);
		if(a == undefined) {
			return a;
		} else {
			var price = parseFloat(a);
			if(price < 200) {
				return price.toFixed(2) + "元";
			} else if(price >= 200 && price < 500) {
				price = price + price * 0.1;
				return price.toFixed(2) + "元";
			} else if (price >= 500 && price < 800) {
				price = price + price * 0.2;
				return price.toFixed(2) + "元";
			} else if (price >= 800) {
				price = price + price * 0.25;
				return price.toFixed(2) + "元";
			}
		}

	}

});