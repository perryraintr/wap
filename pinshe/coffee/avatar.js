var app = angular.module("coffee", []);
app.controller("avatar", function($scope, $http) {
	
	$scope.avatarUrl = GetQueryString("url");
	
});