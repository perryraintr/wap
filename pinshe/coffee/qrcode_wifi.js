var app = angular.module("coffee", []);
app.controller("qrcode_wifi", function($scope, $http) {
	$("#bodyId").hide();
	$scope.id = GetQueryInt("id");
//	$scope.id = 83;
	if($scope.id == 0) {
		layer.msg("参数错误");
		return;
	} else {
		$("#bodyId").show();
	}
	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.getUrl = getHeadUrl();
	//	$scope.getUrl = "http://192.168.2.104/v1/";

	$http.get($scope.getUrl + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
		$scope.storeDetatil();
	});

	$scope.storeDetatil = function() {
		$http.get($scope.getUrl + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);

		});
	}

	var btn = document.getElementById('btn');
    var clipboard = new Clipboard(btn);//实例化

    //复制成功执行的回调，可选
    clipboard.on('success', function(e) {
    		layer.msg("复制成功");
        console.log(e);
    });

    //复制失败执行的回调，可选
    clipboard.on('error', function(e) {
    		layer.msg("复制成功");
        console.log(e);
    });
});