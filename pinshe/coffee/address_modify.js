var app = angular.module("coffee", []);
app.controller("address_modify", function($scope, $http) {
	$scope.wcid = getwcid();	
	$scope.guid = GetQueryString("id");
	$scope.orderId = GetQueryString("oid");
	
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
//	$scope.guid = 3;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
	
	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
	});
	
	$http.get(getHeadUrl() + "consignee.a?id=" + $scope.guid).success(function(response) {
		$scope.consignee = response.body;
	});
	
	$scope.modifyAddress = function() {
		var mid = $scope.member.guid;
		var guid = $scope.consignee.guid;
		var name = document.getElementById("name").value;
		name = name.replace(/ /g,"");
		if (name.length == 0) {
			layer.msg("请填写收货人");
			return;
		}
		var phone = document.getElementById("phone").value;
		phone = phone.replace(/ /g,"");
		if (phone.length == 0) {
			layer.msg("请填写收货人电话号码");
			return;
		}
		var address = document.getElementById("address").value;
		address = address.replace(/ /g,"");
		if (address.length == 0) {
			layer.msg("请填写收货人地址");
			return;
		}
		var zip = document.getElementById("zip").value;
		
		$http({
			method: 'POST',
			url: getHeadUrl() + "consignee_modify.a",
			data: "id=" + guid + "&status=1&mid=" + mid + "&name=" + name + "&phone=" + phone + "&address=" + address + "&zip=" + zip,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(response) {
			location.href = "address_list.html?oid=" + $scope.orderId;
		});
	}
	
});