var app = angular.module("coffee", []);
app.controller("coupon_share", function($scope, $http) {
	$("#bodyId").hide();

	$scope.wcid = getwcid();
	//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	$scope.from = GetQueryInt("from");
	//	$scope.from = 1;
	if($scope.from == 3) {
		location.href = "nearby_cafecomment.html?id=" + GetQueryInt("id") + "&orderno=" + GetQueryString("orderno");
		return;
	}

	//寻咖活动
	$scope.activity = GetQueryInt("activity");
	//	$scope.activity = 1;

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.creatCoupon();
	});

	// 优惠券
	$scope.creatCoupon = function() {
		var d = new Date();
		d.setDate(d.getDate() + 7);
		var currentData = "" + d.getFullYear() + "" + (d.getMonth() + 1).padLeft(2) + "" + d.getDate().padLeft(2) + "" + d.getHours().padLeft(2) + "" + d.getMinutes().padLeft(2) + "" + d.getSeconds().padLeft(2);
		if($scope.from == 2) { // 会员红包
			$http.get(getHeadUrl() + "coupon_add.a?&mid=" + $scope.member.guid + "&current=10&count=10&amount=20&expire=" + currentData + "&status=2").success(function(response) {
				$scope.coupon = response.body;
				$scope.initWx();
			});
		} else {
			$http.get(getHeadUrl() + "coupon_add.a?&mid=" + $scope.member.guid + "&current=10&count=10&amount=2&expire=" + currentData + "&status=1").success(function(response) {
				$scope.coupon = response.body;
				$scope.initWx();
			});
		}

	}

	$scope.initWx = function() {
		$http.get(getHeadUrl() + "wechat_sign.a?url=" + encodeURIComponent(location.href)).success(function(response) {
			$scope.wecharSign = response;
			wx.config({
				debug: false,
				appId: $scope.wecharSign.appId,
				timestamp: $scope.wecharSign.timestamp,
				nonceStr: $scope.wecharSign.nonceStr,
				signature: $scope.wecharSign.signature,
				jsApiList: [
					"checkJsApi",
					"onMenuShareTimeline",
					"onMenuShareAppMessage",
				]
			});

			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: [
						"onMenuShareTimeline",
						"onMenuShareAppMessage",
					]
				});
				wx.onMenuShareAppMessage({
					title: "品社红包",
					desc: "“" + $scope.member.name + "”扔给了你一个品社红包，快来抢吧！", // 分享描述
					link: "http://www.pinshe.org/html/v1/coffee/coupon_detail.html?id=" + $scope.coupon.guid,
					imgUrl: "http://www.pinshe.org/html/v1/coffee/img/redicon.png"
				});
				wx.onMenuShareTimeline({
					title: "“" + $scope.member.name + "”扔给了你一个品社红包，快来抢吧！", // 分享标题
					link: "http://www.pinshe.org/html/v1/coffee/coupon_detail.html?id=" + $scope.coupon.guid, // 分享链接
					imgUrl: "http://www.pinshe.org/html/v1/coffee/img/redicon.png" // 分享图标
				});
				$("#bodyId").show();
				
				//寻咖活动
				if($scope.activity == 1) {
					layer.msg("感谢你参与寻咖，你的奖金已存入你的会员帐户，请前往我的-我的会员查看详情！", {
						time: 0,
						btn: ['确定'],
						yes: function(index) {
							layer.close(index);
						}
					});
				}
			});
			wx.error(function(res) {
				$("#bodyId").hidde();
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});
	}

});