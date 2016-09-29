var app = angular.module("coffee", []);
app.controller("nearby_cafecomment", function($scope, $http) {

	$scope.wcid = getwcid();
	$scope.id = GetQueryInt("id");
	$scope.orderno = GetQueryString("orderno");

	//		$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	//		$scope.id = 66;
	//		$scope.orderno = "20160824185823433949596150";

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
		$scope.isSecond = false;
		$http.get(getHeadUrl() + "activity_detail.a?mid=" + $scope.member.guid + "&sid=" + $scope.id).success(function(response) {
			if(response.body.order_guid != undefined && response.body.order_guid > 0) {
				$scope.isSecond = true;
			}
			$scope.getDetail();
		});

	});

	$scope.getDetail = function() {
		$http.get(getHeadUrl() + "store.a?id=" + $scope.id).success(function(response) {
			$scope.store = response.body;
			$scope.store.distanceStr = ($scope.store.distance / 1000).toFixed(2);
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);

			$scope.getOrderDetail();

		});
	}

	$scope.getOrderDetail = function() {
		$http.get(getHeadUrl() + "order.a?orderno=" + $scope.orderno).success(function(response) {
			$scope.orderDetail = response.body;
			$scope.isNeibu = true;
//			if($scope.wcid == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || $scope.wcid == "o1D_JwGKMNWZmBYLxghYYw0GIlUg" || $scope.wcid == "o1D_JwFbCrjU1rPJdO6-ljRQC5qE" || $scope.wcid == "o1D_JwGTL0ZN81hpxJSxflvtXQj8") {
//				$scope.isNeibu = true;
//			}
			switch($scope.orderDetail.status) {
				case 0:
					$scope.orderDetail.status_str = "订单未付款";
					break;
				case 1:
					$scope.orderDetail.status_str = "订单已付款";
					break;
				case 2:
					$scope.orderDetail.status_str = "订单已发货";
					break;
				case 3:
					$scope.orderDetail.status_str = "订单已完成";
					break;
				case 4:
					$scope.orderDetail.status_str = "订单已取消";
					break;
				default:
					break;
			}
		});
	}

	var activityIndex = 0;
	var telpohoneIndex = 0;
	$scope.sendMessage = function() {
		$scope.message = document.getElementById("message").value;
		$scope.message = $scope.message.replace(/ /g, "");
		if($scope.star == 0) {
			layer.msg("您还没有评星级哦");
			return;
		}
		// 一定要改回来！！！！！！！！！！！ current
		if($scope.orderDetail.type == 2 && $scope.orderDetail.current >= 18 && $scope.isNeibu) {
			if($scope.isSecond) {
				$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
					location.href = "coupon_share.html?from=1";
				});
				return;
			}
			if($scope.message.length == 0) {
				//页面层-没有评论参与活动
				activityIndex = layer.open({
					type: 1,
					title: false,
					area: ['80%', ''], //宽高
					closeBtn: 0,
					shadeClose: false,
					skin: 'yourclass',
					content: $("#activityId")
				});

			} else {

				$http.get(getHeadUrl() + "activity.a?mid=" + $scope.member.guid).success(function(response) {
					if(response.body.guid != undefined && response.body.guid > 0) {
						$scope.addActivity("");

					} else {
						// 第一次参加活动
						//页面层-没有评论参与活动
						telpohoneIndex = layer.open({
							type: 1,
							title: false,
							area: ['88%', ''], //宽高
							closeBtn: 0,
							shadeClose: false,
							skin: 'yourclass',
							content: $("#telpohoneId")
						});

					}
				});
			}
		} else {
			$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
				location.href = "coupon_share.html?from=1";
			});
		}

	}

	// 参与活动，没有填写评论
	$scope.activityMakeSure = function() {
		layer.close(activityIndex);
	}

	// 不参与活动
	$scope.activityCancel = function() {
		$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
			location.href = "coupon_share.html?from=1";
		});
	}

	// 推荐人手机号
	$scope.telphoneMakeSure = function() {
		$scope.tel = document.getElementById("tel").value;

		if($scope.member.phone.length == 0) {
			$scope.memberTel = document.getElementById("memberTel").value;
			if($scope.memberTel.length == 0) {
				layer.msg("请输入本人手机号");
				return;
			}
			if($scope.memberTel.length > 0 && $scope.memberTel.length != 11) {
				layer.msg("请输入正确的手机号");
				return;
			}

			if($scope.tel.length > 0 && $scope.tel.length != 11) {
				layer.msg("请输入正确的手机号");
				return;
			}

			if($scope.tel.length > 0 && $scope.tel.length == 11) {
				if($scope.tel == $scope.member.phone || $scope.tel == $scope.memberTel) {
					layer.msg("推荐人不能是自己哦");
					return;
				}
			}

			$http.get(getHeadUrl() + "login.a?wcid=" + $scope.wcid + "&phone=" + $scope.memberTel).success(function(response) {
				layer.close(telpohoneIndex);
				if(response.body.guid != undefined && response.body.guid > 0) {
					$scope.member = response.body;
					localStorage.setItem("wid", response.body.wechat_id);
					localStorage.setItem("tel", response.body.phone);
					$http.get(getHeadUrl() + "order_modify.a?id=" + $scope.orderDetail.guid + "&mid=" + $scope.member.guid).success(function(response) {});

					if($scope.tel.length == 0) {
						$scope.addActivity("");
					} else {
						$http.get(getHeadUrl() + "member_add.a?phone=" + $scope.tel).success(function(response) {
							$scope.sharer = response.body.guid;
							$http.get(getHeadUrl() + "activity.a?mid=" + $scope.member.guid + "&sharerid=" + $scope.sharer).success(function(response) {
								if(response.body.guid != undefined && response.body.guid > 0) {
									layer.msg("此推荐人不能用");
									return;
									// 不可使用此推荐人
								} else {
									$scope.addActivity("&sharer=" + $scope.sharer);
								}
							});
						});
					}
				}
			});
		} else {

			if($scope.tel.length > 0 && $scope.tel.length != 11) {
				layer.msg("请输入正确的手机号");
				return;
			}

			if($scope.tel.length > 0 && $scope.tel.length == 11) {

				if($scope.tel == $scope.member.phone) {
					layer.msg("推荐人不能是自己哦");
					return;
				}

				$http.get(getHeadUrl() + "member_add.a?phone=" + $scope.tel).success(function(response) {
					$scope.sharer = response.body.guid;
					$http.get(getHeadUrl() + "activity.a?mid=" + $scope.member.guid + "&sharerid=" + $scope.sharer).success(function(response) {
						if(response.body.guid != undefined && response.body.guid > 0) {
							layer.msg("此推荐人不能用");
							return;
							// 不可使用此推荐人
						} else {
							$scope.addActivity("&sharer=" + $scope.sharer);
						}
					});
				});
			} else {
				$scope.addActivity("");
			}
		}

	}

	$scope.addActivity = function(paramString) {
		$http.get(getHeadUrl() + "activity_add.a?mid=" + $scope.member.guid + paramString + "&sid=" + $scope.id + "&oid=" + $scope.orderDetail.guid).success(function(response) {
			var activitySuccess = "";
			if(response.body.guid != undefined && response.body.guid > 0) {
				activitySuccess = "&activity=1";
			}
//			alert(activitySuccess);
			$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
				location.href = "coupon_share.html?from=1" + activitySuccess;
			});
		});
	}

	// 不输入推荐人手机号
	$scope.telphoneCancel = function() {
		layer.close(telpohoneIndex);
		//		$http.get(getHeadUrl() + "store_comment_add.a?sid=" + $scope.id + "&mid=" + $scope.member.guid + "&star=" + $scope.star + "&m=" + $scope.message).success(function(response) {
		//			location.href = "coupon_share.html?from=1";			
		//		});
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