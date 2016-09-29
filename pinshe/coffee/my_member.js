var app = angular.module("coffee", []);
app.controller("my_member", function($scope, $http) {

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.isSubScription = false;
	$scope.jiYuLayer = false;
	$scope.weiFeingLayer = false;
	$scope.choosePay = null;

	var swiper = new Swiper('.swiper-container', {
		paginationClickable: true,
		slidesPerView: 1.6,
		centeredSlides: true,
		loop: false,
		spaceBetween: 20,
	});

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.isFinished = true;
		//		 || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg" || $scope.wcid == "o1D_JwGTL0ZN81hpxJSxflvtXQj8"
		if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY") {
			//						$scope.isMember = false;
		}

		$scope.getsubscription();
	});

	$scope.getsubscription = function() {
		$http.get(getHeadUrl() + "subscription.a?mid=" + $scope.member.guid).success(function(response) {
			if(response.body.guid != undefined && response.body.guid > 0) {
				$scope.isSubScription = false;
			} else {
				$scope.isSubScription = true;
			}
		});
	}

	$scope.chooseList = [{
		"title": "试用会员",
		"desc": "充￥200得￥220",
		"isChoose": false,
		"cid": "114",
		"amount": "200"
	}, {
		"title": "纯享会员",
		"desc": "充￥500得￥600",
		"isChoose": false,
		"cid": "113",
		"amount": "500"
	}, {
		"title": "乐享会员",
		"desc": "充￥800得￥1000",
		"isChoose": false,
		"cid": "112",
		"amount": "800"
	}, {
		"title": "尊享会员",
		"desc": "充￥1600得￥2000",
		"isChoose": false,
		"cid": "111",
		"amount": "1600"
	}, {
		"title": "自定义充值金额",
		"desc": "",
		"isChoose": false,
		"cid": "126",
		"amount": ""
	}];

	var chooseInde = 0;
	$scope.chooseMember = function(model) {
		if(model.amount.length == 0) {
			location.href = "my_memberrecharge.html?mid=" + $scope.member.guid;
			return;
		}
		for(var i = 0; i < $scope.chooseList.length; i++) {
			$scope.chooseList[i].isChoose = false;
		}
		model.isChoose = true;
		$scope.choosePay = model;
	}

	$scope.pay = function() {
		if($scope.choosePay != null) {
			var orderAddParamData = {
				"mid": $scope.member.guid,
				"count": 1,
				"amount": $scope.choosePay.amount,
				"cids": $scope.choosePay.cid + ",",
				"counts": "1,",
				"current": 0,
				"amounts": $scope.choosePay.amount + ","
			};
			console.log(orderAddParamData);
			$http({
				method: 'POST',
				url: getHeadUrl() + "order_add.a",
				data: $.param(orderAddParamData),
				headers: {
					'Content-Type': "application/x-www-form-urlencoded"
				},
				transformRequest: angular.identity
			}).success(function(response) {
				console.log(response.body);
				location.href = "product_ordertotal.html?id=" + response.body.guid;
			});
		} else {
			layer.msg("请选择您的充值金额");
		}

	}

	$scope.jiYuClicked = function() {
		$scope.jiYuLayer = true;
	}

	$scope.weiFengClicked = function() {
		$scope.weiFeingLayer = true;
	}

	$scope.jiYuLayerClicked = function() {
		$scope.jiYuLayer = false;
	}

	$scope.weiFeingLayerClicked = function() {
		$scope.weiFeingLayer = false;
	}

});