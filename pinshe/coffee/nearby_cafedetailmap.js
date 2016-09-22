var app = angular.module("coffee", []);
app.controller("nearby_cafedetailmap", function($scope, $http) {

	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	$scope.longitude = GetQueryString("longitude");
	$scope.latitude = GetQueryString("latitude");

//	$scope.longitude = 116.40384;
//	$scope.latitude = 39.938986;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var mapObject = new AMap.Map('container');
	mapObject.setZoom(13);
	var marker = new AMap.Marker({
		icon:"http://www.pinshe.org/html/v1/coffee/img1/n11.png",
		position: [$scope.longitude, $scope.latitude],
		title: "咖啡店",
		map: mapObject
	});
	mapObject.setCenter(marker.getPosition());

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;

		var height = document.documentElement.clientHeight;
		$("#container").css("height", height);

	});	

});