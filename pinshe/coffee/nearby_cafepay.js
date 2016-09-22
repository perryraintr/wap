var app = angular.module("coffee", []);
app.controller("nearby_cafepay", function($scope, $http) {

	$scope.wcid = getwcid();
	$scope.id = GetQueryInt("id");
//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";
//	$scope.id = 66;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
	
	var redIndex = 0;

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getDetail();
	});

	$scope.getDetail = function() {
		$http.get(getHeadUrl() + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			$scope.store.distanceStr = ($scope.store.distance / 1000).toFixed(2);
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);

		});
	}

	$scope.payClicked = function() {

		$scope.money = document.getElementById("money").value;

		if($scope.money.length == 0) {
			layer.msg("请输入金额");
			return;
		}

		var orderAddParamData = {
			"mid": $scope.member.guid,
			"count": 1,
			"amount": $scope.money,
			"sids": $scope.id + ",",
			"counts": "1",
			"current": 0,
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
			$scope.order = response.body;
			location.href = "nearby_ordertotal.html?id=" + $scope.order.guid;
		});
	}

});