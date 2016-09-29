var app = angular.module("coffee", []);
app.controller("product_ordertotal", function($scope, $http) {

	$scope.wcid = getwcid();
	//	$scope.wcid = "o1D_JwDEjSfnIXLdlYbv65_7L80c";
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//		$scope.wcid = "o1D_JwGiLMukMtRIo6HU5M0ngxPs";
	//	$scope.wcid = "o1D_JwFbCrjU1rPJdO6-ljRQC5qE";
	//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";

	$scope.guid = GetQueryString("id");
//		$scope.guid = 709;

	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

	var paramStr = "";
	$scope.hasConsignee = false; // 有收货人信息
	$scope.isFinished = false; // 订单已完成状态
	$scope.isMemberOrder = false; // 是否是会员订单
	$scope.couponList = []; // 红包
	$scope.useCoupon = {
		"guid": 0,
		"coupon_guid": 0,
		"amount": 0
	};

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.requestEnd = true;
		$scope.getList($scope.member.guid);
		$scope.orderDetailFunc();
	});

	$scope.valid = function() {
//		$http.get(getHeadUrl() + "order.a?status=vaild&mid=" + $scope.member.guid).success(function(response) {
//			$scope.isShoudan = response.body.status == 0 ? true : false;
//			$scope.getCouponList($scope.member.guid);
//		});
		$scope.isShoudan = false;
		$scope.getCouponList($scope.member.guid);
	}

	$scope.orderDetailFunc = function() {
		$http.get(getHeadUrl() + "order.a?id=" + $scope.guid).success(function(response) {
			$scope.orderDetail = response.body;
			$scope.orderDetail.payamount = $scope.orderDetail.amount;
			$scope.memberCid = $scope.orderDetail.details[0].commodity_guid;
			if($scope.memberCid == 111 || $scope.memberCid == 112 || $scope.memberCid == 113 || $scope.memberCid == 114 || $scope.memberCid == 126) { //会员订单
				$scope.isMemberOrder = true;
			}
			if($scope.orderDetail.status != 0) {
				$scope.isFinished = true;
			}
			$scope.valid();
		});
	}

	$scope.getList = function(guid) {
		$http.get(getHeadUrl() + "consignee.a?mid=" + guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.consigneeList = response.body.array;
				for(var i = 0; i < $scope.consigneeList.length; i++) {
					if($scope.consigneeList[i].status == 1) {
						$scope.hasConsignee = true;
						$scope.consignee = $scope.consigneeList[i];
					}
				}
			}

		});
	}

	$scope.getCouponList = function(guid) {
		$http.get(getHeadUrl() + "coupon_member.a?mid=" + guid).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.couponList = response.body.array;
				for(var i = 0; i < $scope.couponList.length; i++) {
					$scope.couponList[i].isChoose = false;
					if($scope.couponList[i].status == 2) {
						$scope.couponList[i].couponType = "会员红包";
					} else {
						$scope.couponList[i].couponType = "任性通用红包";
					}
				}

				if($scope.orderDetail.payamount >= (($scope.isShoudan ? 10 : 0) + $scope.couponList[0].coupon_amount)) {
					$scope.couponList[0].isChoose = true;
					$scope.useCoupon.guid = $scope.couponList[0].guid;
					$scope.useCoupon.coupon_guid = $scope.couponList[0].coupon_guid;
					$scope.useCoupon.amount = $scope.couponList[0].coupon_amount;
				}
			}
			if($scope.isShoudan) {
				if($scope.orderDetail.payamount > 10) {
					$scope.useCoupon.amount += 10;
				} else {
					$scope.useCoupon.amount = $scope.orderDetail.payamount;
				}
			}
			$scope.orderDetail.payamount = $scope.orderDetail.payamount - $scope.useCoupon.amount;

		});
	}

	$scope.orderModify = function(isFormWx) {
		var paramString = "";
		if($scope.useCoupon.guid > 0) {
			paramString = "&couponid=" + $scope.useCoupon.coupon_guid;
		}
		if(isFormWx) {
			$http.get(getHeadUrl() + "order_modify.a?id=" + $scope.guid + "&type=2"  + "&current=" + $scope.orderDetail.payamount + "&cneeid=" + $scope.consignee.guid + paramString).success(function(response) {
				$scope.modifyCoupon();

				if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY") {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							location.href = getHeadUrl() + "pay/wechat_pay.a?wcid=" + $scope.wcid + "&order_no=" + $scope.orderDetail.order_no + paramStr + "&amount=" + $scope.orderDetail.payamount * 100;
						});
					});
				} else {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
								$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
									location.href = getHeadUrl() + "pay/wechat_pay.a?wcid=" + $scope.wcid + "&order_no=" + $scope.orderDetail.order_no + paramStr + "&amount=" + $scope.orderDetail.payamount * 100;
								});
							});
						});
					});
				}

			});
		} else {
			$http.get(getHeadUrl() + "order_modify.a?id=" + $scope.guid + "&type=1"  + "&current=" + $scope.orderDetail.payamount + "&cneeid=" + $scope.consignee.guid + paramString + "&status=1").success(function(response) {
				$scope.modifyCoupon();

				if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY") {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							if($scope.isMemberOrder && $scope.orderDetail.amount >= 200) {
								location.href = "order_done.html?amount=" + $scope.orderDetail.payamount + "&orderno=" + $scope.orderDetail.order_no + "&from=2";
							} else {
								location.href = "order_done.html?amount=" + $scope.orderDetail.payamount + "&orderno=" + $scope.orderDetail.order_no + "&from=1";
							}
						});
					});
				} else {
					$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGTL0ZN81hpxJSxflvtXQj8&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
						$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
							$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
								$http.get(getHeadUrl() + "wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg&m=来订单了，<a href='http://www.pinshe.org/admin/v1/order_detail.html?id=" + $scope.guid + "'>订单详情</a>").success(function(response) {}).finally(function() {
									if($scope.isMemberOrder && $scope.orderDetail.amount >= 200) {
										location.href = "order_done.html?amount=" + $scope.orderDetail.payamount + "&orderno=" + $scope.orderDetail.order_no + "&from=2";
									} else {
										location.href = "order_done.html?amount=" + $scope.orderDetail.payamount + "&orderno=" + $scope.orderDetail.order_no + "&from=1";
									}
								});
							});
						});
					});
				}
			});
		}
	}

	$scope.modifyCoupon = function() {
		if($scope.useCoupon.guid > 0) {
			$http.get(getHeadUrl() + "coupon_member_modify.a?id=" + $scope.useCoupon.guid + "&status=1").success(function(response) {});
		}
	}

	$scope.member_modify = function() {
		$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
			$scope.member = response.body;
			if($scope.member.current >= $scope.orderDetail.payamount) { // 会员剩余的钱够支付
				$scope.money = $scope.member.current - $scope.orderDetail.payamount;
				$http.get(getHeadUrl() + "member_modify.a?id=" + $scope.member.guid + "&current=" + $scope.money).success(function(response) {
					$scope.isFinished = true;
					$scope.orderModify(false);
				});
			} else {
				layer.msg("您好，您的余额不足哦", {
					time: 0,
					btn: ['确定', '取消'],
					yes: function(index) {
						layer.close(index);
					}
				});
			}
		});
	}

	var memberIndex = 0;
	// 会员支付
	$scope.memberpay = function() {
		if(!$scope.hasConsignee) {
			layer.msg("请填写你的收获地址");
			return;
		}

		//页面层-会员确定
		memberIndex = layer.open({
			type: 1,
			title: false,
			area: ['80%', ''], //宽高
			closeBtn: 0,
			shadeClose: false,
			skin: 'yourclass',
			content: $("#memberPayId")
		});
	}

	// 确定会员支付
	$scope.makeSure = function() {
		$scope.member_modify();
	}

	// 取消会员支付
	$scope.cancel = function() {
		layer.close(memberIndex);
	}

	// 不是会员
	var addmemberIndex = 0;
	$scope.addMember = function() {
		//页面层-会员确定
		addmemberIndex = layer.open({
			type: 1,
			title: false,
			area: ['80%', ''], //宽高
			closeBtn: 0,
			shadeClose: false,
			skin: 'yourclass',
			content: $("#addmemberId")
		});
	}

	// 成为会员
	$scope.addMemberMakeSure = function() {
		location.href = "my_member.html";
	}

	// 取消会员支付
	$scope.addMemberCancel = function() {
		layer.close(addmemberIndex);
	}

	// 微信支付
	$scope.wxpay = function() {
		if(!$scope.hasConsignee) {
			layer.msg("请填写你的收获地址");
			return;
		}

		$scope.isFinished = true;
		if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg" || $scope.wcid == "o1D_JwGTL0ZN81hpxJSxflvtXQj8") {
			$scope.orderDetail.payamount = 0.01;
		}
		if($scope.isMemberOrder && $scope.orderDetail.amount >= 200) {
			paramStr = "-2-" + $scope.memberCid;
		} else {
			paramStr = "-1-0";
		}
		$scope.orderModify(true);
	}

	//	 优惠红包
	$scope.addRedpacket = function(model) {
		for(var i = 0; i < $scope.couponList.length; i++) {
			$scope.couponList[i].isChoose = false;
		}
		if($scope.isShoudan) {
			if($scope.orderDetail.amount >= (10 + model.coupon_amount)) {
				model.isChoose = true;
				$scope.useCoupon.guid = model.guid;
				$scope.useCoupon.coupon_guid = model.coupon_guid;
				$scope.useCoupon.amount = model.coupon_amount + 10;
				$scope.orderDetail.payamount = $scope.orderDetail.amount - $scope.useCoupon.amount;
				$scope.orderDetail.payamount = $scope.orderDetail.payamount.toFixed(2);
			} else {
				layer.msg("优惠金额大于实付金额了哦");
			}
		} else {
			if($scope.orderDetail.payamount >= model.coupon_amount) {
				model.isChoose = true;

				$scope.useCoupon.guid = model.guid;
				$scope.useCoupon.coupon_guid = model.coupon_guid;
				$scope.useCoupon.amount = model.coupon_amount;
				$scope.orderDetail.payamount = $scope.orderDetail.amount - $scope.useCoupon.amount;
				$scope.orderDetail.payamount = $scope.orderDetail.payamount.toFixed(2);
			} else {
				layer.msg("优惠金额大于实付金额了哦");
			}
		}

	}

	$scope.removeRedpacket = function(model) {
		model.isChoose = false;
		$scope.useCoupon.guid = 0;
		$scope.useCoupon.coupon_guid = 0;
		if($scope.isShoudan) {
			if($scope.orderDetail.amount >= 10) {
				$scope.orderDetail.payamount = $scope.orderDetail.amount - 10;
				$scope.useCoupon.amount = 10;
			} else {
				$scope.useCoupon.amount = $scope.orderDetail.payamount;
				$scope.orderDetail.payamount = 0;
			}
		} else {
			$scope.useCoupon.amount = 0;
			$scope.orderDetail.payamount = $scope.orderDetail.amount;
			$scope.orderDetail.payamount = $scope.orderDetail.payamount.toFixed(2);
		}
	}

});