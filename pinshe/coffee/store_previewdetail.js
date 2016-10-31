// Request
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];

    reg = null;
    r = null;

    return context == null || context == "" || context == "undefined" ? "" : context;
}

// 截取固定长度子字符串 source为字符串len为长度
String.prototype.toTrim = function(len, v) {
    if (this.replace(/[^\x00-\xff]/g, "xx").length <= len)
        return this;

    var str = "";
    var l = 0;
    var schar;
    for (var i = 0; schar = this.charAt(i); i++) {
        str += schar;
        l += (schar.match(/[^\x00-\xff]/) != null ? 2 : 1);
        if (l >= len)
            break;
    }

    return str + v;
}

var app = angular.module("coffee", []);
app.controller("store_previewdetail", function($scope, $http) {
	$scope.id = GetQueryString("id");
	$scope.slogan = decodeURI(GetQueryString("slogan"));
	$scope.dateStr = GetQueryString("date");
	$scope.phone = GetQueryString("phone");
//		$scope.id = 83;

	$scope.isExpand = false;
	$scope.description = "";
	$scope.feature2 = [];
	$scope.feature1 = [];
	$scope.page = 1;
	$scope.commentList = [];
	$scope.resultArray = [];

	$http.get("http://interface.pinshe.org/v1/store.a?id=" + $scope.id).success(function(response) {
		$scope.store = response.body;
		$scope.store.slogan = $scope.slogan;
		$scope.store.date = $scope.dateStr;
		$scope.store.phone = $scope.phone;

		$scope.store.feature1 = $scope.store.feature1.split(",");
		$scope.resultFeature1 = [];
		for(var x = 0; x < Math.ceil($scope.store.feature1.length / 4); x++) {
			var start = x * 4;
			var end = start + 4;
			$scope.resultFeature1.push($scope.store.feature1.slice(start, end));
		}

		$scope.store.feature2 = $scope.store.feature2.split(",");
		$scope.resultFeature2 = [];
		for(var x = 0; x < Math.ceil($scope.store.feature2.length / 4); x++) {
			var start = x * 4;
			var end = start + 4;
			$scope.resultFeature2.push($scope.store.feature2.slice(start, end));
		}

		$scope.store.description = $scope.store.description.replace(/\n/g, "<br/>");
		$scope.description = $scope.store.description;

		if($scope.store.description.length > 150) {
			$scope.store.description = $scope.store.description.toTrim(150, "...");
		}
		document.getElementById("descriptionId").innerHTML = $scope.store.description;
		
		$scope.store.date = $scope.store.date.replace(/\n/g, "<br/>");
		document.getElementById("dateId").innerHTML = $scope.store.date;

		$scope.store.phone = $scope.store.phone.replace(/\n/g, "<br/>");
		document.getElementById("phoneId").innerHTML = $scope.store.phone;

		var starNum = $scope.store.star / $scope.store.comment;
		$scope.store.starList = [];
		for(var j = 0; j < starNum; j++) {
			$scope.store.starList.push(j);
		}
	});

	$scope.readDescription = function() {
		$scope.isExpand = true;
		$scope.store.description = $scope.description;
		document.getElementById("descriptionId").innerHTML = $scope.store.description;
	}

});