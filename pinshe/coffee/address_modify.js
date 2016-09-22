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
		
		var formdata = new FormData($("address"));
     	$http({
        		method: 'POST',
         	url: getHeadUrl() + "consignee_modify.a",
         	data: formdata,
         	headers: {
            		'Content-Type': undefined
         	},
         	transformRequest: angular.identity
     	}).success(function(response) {
     		location.href = "address_list.html?oid=" + $scope.orderId;
     	});
     	
	}
	
});