var app = angular.module("coffee", []);
app.controller("store_alllist", function($scope, $http) {

	$http.get(getHeadUrl() + "store.a?page=1").success(function(response) {
		$scope.storeList = response.body.array;
	});	
	
});