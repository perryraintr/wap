var app = angular.module("coffee", []);
app.controller("qrcode_follow", function($scope, $http) {
	$("#bodyId").hide();
	$scope.id = GetQueryInt("id");
//	$scope.id = 85;
	if($scope.id == 0) {
		layer.msg("参数错误");
		return;
	} else {
		$("#bodyId").show();
	}
	$scope.wcid = getwcid();
	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.getUrl = getHeadUrl();
	//	$scope.getUrl = "http://192.168.2.104/v1/";

	$http.get($scope.getUrl + "store.a?id=" + $scope.id).success(function(response) {
		$scope.store = response.body;
		$http.get(getHeadUrl() + "wechat_qrcode.a?sid=" + $scope.id).success(function(response) {
			$scope.qrcodeUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + response.ticket;
		});
	});

});