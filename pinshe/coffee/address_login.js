var app = angular.module("coffee", []);
app.controller("address_login", function($scope, $http) {
	
	$scope.wcid = getwcid();
	$scope.orderId = GetQueryString("oid");
	$scope.formCafe = GetQueryInt("form");
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
		
	$scope.loginMember = function() {
		var phone = document.getElementById("tel").value;
		
		if (phone.length == 0) {
			layer.msg("请输入手机号");
			return;
		}
		
		if (phone.length != 11) {
			layer.msg("请输入正确格式的手机号");
			return;
		}
		
		$http.get(getHeadUrl() + "login.a?wcid=" + $scope.wcid + "&phone=" + phone).success(function(response) {
			if (response.body.guid != undefined && response.body.guid > 0) {
				localStorage.setItem("wid", response.body.wechat_id);
				localStorage.setItem("tel", response.body.phone);
				
				$http.get(getHeadUrl() + "order_modify.a?id=" + $scope.orderId + "&mid=" + response.body.guid).success(function(response){
				});
				
				if ($scope.formCafe = 3) {
					location.href = "nearby_ordertotal.html?id=" + $scope.orderId;
				} else {
					location.href = "address_list.html?oid=" + $scope.orderId;
				}
				
			} else {
				layer.msg("微信客户端不可用");
			}
		});
			
	}
	
});