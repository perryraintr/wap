var app = angular.module("coffee", []);
app.controller("order_done", function($scope, $http) {

	$scope.wcid = getwcid();
//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//	$scope.wcid = "o1D_JwGiLMukMtRIo6HU5M0ngxPs";
	//	$scope.wcid = "o1D_JwFbCrjU1rPJdO6-ljRQC5qE";	
	//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.amount = GetQueryString("amount");
	$scope.orderno = GetQueryString("orderno");
	$scope.from = GetQueryString("from");
	
	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;	
	});
	
	$scope.shareCoupon = function() {
		location.href = "coupon_share.html?from=" + $scope.from;
	}

});