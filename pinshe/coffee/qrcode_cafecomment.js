var app = angular.module("coffee", []);
app.controller("qrcode_cafecomment", function($scope, $http) {

	$scope.wcid = getwcid();
	$scope.id = GetQueryInt("id");
	
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
//	$scope.id = 83;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}
	
	$scope.startList = [{
		"isChoose": false
	}, {
		"isChoose": false
	}, {
		"isChoose": false
	}, {
		"isChoose": false
	}, {
		"isChoose": false
	}];
	$scope.star = 0;

	var redIndex = 0;

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
		$scope.getDetail();
	});

	$scope.getDetail = function() {
		$http.get(getHeadUrl() + "store.a?id=" + $scope.id).success(function(response) {
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

	$scope.sendMessage = function() {
		$scope.message = document.getElementById("message").value;
		$scope.message = $scope.message.replace(/ /g, "");
		if($scope.star == 0) {
			layer.msg("您还没有评星级哦");
			return;
		}
		
		$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
			// 推送
			$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
				$scope.member = response.body;
				$scope.member.current += 2;
				$scope.member.amount +=2;
				$http.get(getHeadUrl() + "member_modify.a?id=" + $scope.member.guid + "&current=" + $scope.member.current + "&amount=" + $scope.member.amount).success(function(response) {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=" + $scope.wcid + "&m=感谢分享你的体验，我们已将2元品社余额存入你的账号。<a href='http://www.pinshe.org/html/v1/coffee/my_member.html'>点击查看</a>").success(function(response) {}).finally(function() {
						WeixinJSBridge.call('closeWindow');
					});
				});
			});
		});
	}

	$scope.startClicked = function(index) {
		$scope.star = index + 1;
		for(var i = 0; i < $scope.startList.length; i++) {
			if(i <= index) {
				$scope.startList[i].isChoose = true;
			} else {
				$scope.startList[i].isChoose = false;
			}
		}
	}

});