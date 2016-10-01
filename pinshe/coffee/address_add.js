var app = angular.module("coffee", []);
app.controller("address_add", function($scope, $http) {
	$scope.wcid = getwcid();
	$scope.orderId = GetQueryString("oid");

		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
	});

	$scope.addAddress = function() {
		var mid = $scope.member.guid;
		var name = document.getElementById("name").value;
		if (name.length == 0) {
			layer.msg("请填写收货人");
			return;
		}
		var phone = document.getElementById("phone").value;
		if (phone.length == 0) {
			layer.msg("请填写收货人电话号码");
			return;
		}
		var address = document.getElementById("address").value;
		if (address.length == 0) {
			layer.msg("请填写收货人地址");
			return;
		}
		var zip = document.getElementById("zip").value;
		
		$http({
			method: 'POST',
			url: getHeadUrl() + "consignee_add.a",
			data: "mid=" + mid + "&name=" + name + "&phone=" + phone + "&address=" + address + "&zip=" + zip,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(response) {
			location.href = "address_list.html?oid=" + $scope.orderId;
		});

	}
});