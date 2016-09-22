var app = angular.module("coffee", []);
app.controller("product_detail", function($scope, $http) {

	$scope.wcid = getwcid();
	$scope.cid = GetQueryString("id");

//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY"; 
//	$scope.cid = "121";

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoplay: 2000,
		loop: true
	});

	var swiperSlide = $("#swiperSlide").html();

	$scope.cartList = [];

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getDetail();
		$scope.getList($scope.member.guid);
	});

	$scope.getList = function(guid) {
		$http.get(getHeadUrl() + "cart.a?mid=" + guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				for(var i = 0; i < response.body.array.length; i++) {
					$scope.cartList.push(response.body.array[i]);
				}
			}
		});
	}

	$scope.getDetail = function() {
		$http.get(getHeadUrl() + "commodity.a?id=" + $scope.cid).success(function(response) {
			$scope.row = response.body;
			$scope.initWx();
			if($scope.row.images.length > 0) {
				$("#swiperwrapper").html("");
				for(var i = 0; i < $scope.row.images.length; i++) {
					swiper.appendSlide(_.template($('#templateSwiper').html())($scope.row.images[i]));
				}
			}

			$("#descId").html($scope.row.detail);
			var imgs = $("#descId img");
			for(var i = 0; i < imgs.length; i++) {
				$("img").removeAttr("height");
			}

			var itemimgs = document.getElementById("swiperwrapper").getElementsByClassName("picture");
			for(var i = 0; i < itemimgs.length; i++) {
				itemimgs[i].height = $(window).width() * 900 / 1242.0;
			}
		});
	}
	
	$scope.initWx = function() {
		$scope.shareContent = $scope.row.name + " | " + $scope.row.description;
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
					title: $scope.row.name,
					desc: $scope.row.description, // 分享描述
					link: "http://www.pinshe.org/html/v1/coffee/product_detail.html?id=" + $scope.cid,
					imgUrl: $scope.row.images[0]
				});
				wx.onMenuShareTimeline({
					title: $scope.shareContent,
					desc: $scope.row.description, // 分享标题
					link: "http://www.pinshe.org/html/v1/coffee/product_detail.html?id=" + $scope.cid, // 分享链接
					imgUrl: $scope.row.images[0] // 分享图标
				});
			});
			wx.error(function(res) {
				console.log('wx.error: ' + JSON.stringify(res));
			});

		});
	}

	// 加入购物车
	$scope.addCart = function() {
		if ($scope.row.count <= 0) {
			layer.msg("手慢了，此商品已售完");
			return;
		}
		
		$http.get(getHeadUrl() + "cart_add.a?mid=" + $scope.member.guid + "&cid=" + $scope.row.guid + "&count=1").success(function(response) {
			layer.msg('已加入购物车');
			$scope.cartList.push("addCart");
		});
	}

	// 立即购买
	$scope.buyClicked = function() {
		if ($scope.row.count <= 0) {
			layer.msg("手慢了，此商品已售完");
			return;
		}
		//		mid count amount  cids  counts  amounts
		for (var i = 0; i < 100; i++) {
			
		
		var orderAddParamData = {
			"mid": $scope.member.guid,
			"count": 1,
			"amount": $scope.row.price,
			"cids": $scope.row.guid + ",",
			"counts": "1,",
			"current": 0,
			"amounts": $scope.row.price + ","
		};
		$http({
			method: 'POST',
			url: getHeadUrl() + "order_add.a",
			data: $.param(orderAddParamData),
			headers: {
				'Content-Type': "application/x-www-form-urlencoded"
			},
			transformRequest: angular.identity
		}).success(function(response) {
			if (response.body.guid != undefined && response.body.guid > 0) {
				location.href = "product_ordertotal.html?id=" + response.body.guid;				
			} else {
				layer.msg("库存不足");
				return;
			}

		});
		}
	}

});