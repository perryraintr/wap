var app = angular.module("coffee", []);
app.controller("my_subscription", function($scope, $http) {

	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		direction: 'vertical',
		nextButton: '.nextButton',
	});

	$scope.dayList = [{
		"title": "每周一份",
		"day": 7,
		"isChoose": true,
	}, {
		"title": "每两周一份",
		"day": 14,
		"isChoose": false,
	}, {
		"title": "每月一份",
		"day": 30,
		"isChoose": false,
	}];
	
	$scope.cuurentDay = $scope.dayList[0];
	$scope.isJiyu = true;
	$scope.isWeiFeng = false;
	$scope.jiYuLayer = false;
	$scope.weiFeingLayer = false;
	$scope.paramStrJiyu = "&cid1=80&cid2=69&cid3=85&cid4=71&cid5=55&cid6=78";
	$scope.paramStrWeifeng = "&cid1=82&cid2=92&cid3=53&cid4=65&cid5=60&cid6＝87";
	
	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
	});

	$scope.dayClicked = function(model) {
		for (var i = 0; i < $scope.dayList.length; i++) {
			$scope.dayList[i].isChoose = false;
		}
		model.isChoose = true;
		$scope.cuurentDay = model;
	}
	
	$scope.jiYuClicked = function() {
		$scope.isJiyu = true;
		$scope.isWeiFeng = false;
		$scope.jiYuLayer = true;
		$scope.weiFeingLayer = false;
	}
	
	$scope.weiFengClicked = function() {
		$scope.isWeiFeng = true;
		$scope.isJiyu = false;
		$scope.weiFeingLayer = true;
		$scope.jiYuLayer = false;
	}
	
	$scope.jiYuLayerClicked = function() {
		$scope.jiYuLayer = false;
	}
	
	$scope.weiFeingLayerClicked = function() {
		$scope.weiFeingLayer = false;
	}
	
	$scope.subscriptionAdd = function() {
		$http.get(getHeadUrl() + "subscription_add.a?mid=" + $scope.member.guid + "&day=" + $scope.cuurentDay.day + ($scope.isJiyu ? $scope.paramStrJiyu : $scope.paramStrWeifeng)).success(function(response) {
			layer.msg("订享成功");
			$scope.sendWxMessage();
		});
	}
	
	$scope.sendWxMessage = function() {
		if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg") {
			$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=" + $scope.member.name + "开始订享").success(function(response) {});
			$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=" + $scope.member.name + "开始订享").success(function(response) {});
			return;
		}
		$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=" + $scope.member.name + "开始订享").success(function(response) {});
		$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=" + $scope.member.name + "开始订享").success(function(response) {});
		$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=" + $scope.member.name + "开始订享").success(function(response) {});
		$http.get("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=" + $scope.member.name + "开始订享").success(function(response) {});
	}

	
});