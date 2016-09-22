var app = angular.module("coffee", []);
app.controller("product_shopcart", function($scope, $http) {

	$scope.wcid = getwcid();
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

//	$scope.wcid = "o1D_JwGKMNWZmBYLxghYYw0GIlUg";
	
	$scope.cartList = [];
	
	$scope.isAllChoose = true;
	$scope.allMoney = 0.00;
	
	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		
		$scope.getList($scope.member.guid);
	});

	$scope.getList = function(guid) {
		$http.get(getHeadUrl() + "cart.a?mid=" + guid).success(function(response) {
			if (response.body.array != undefined && response.body.array.length > 0) {
				for(var i = 0; i < response.body.array.length; i++) {
					$scope.cardModel = response.body.array[i];
					$scope.cardModel.isChoose = true;
					$scope.cartList.push($scope.cardModel);
					$scope.allMoney = $scope.allMoney + $scope.cardModel.cart_count * $scope.cardModel.commodity_price;
				}	
			} else {
				$scope.isAllChoose = false;
			}
		});
	}
	
	// 结算
	$scope.totalButton = function() {
		for(var i = 0; i < $scope.cartList.length; i++) {
			$scope.checkCardModel = $scope.cartList[i];
			if ($scope.checkCardModel.isChoose) { //如果取到一个有一个是未选状态的，则全选状态yes
				if ($scope.checkCardModel.cart_count > $scope.checkCardModel.commodity_count) {
					layer.msg($scope.checkCardModel.commodity_name + "|" + $scope.checkCardModel.commodity_description + "  库存不足");
					return;
				}
			}
		}
		
		$scope.commodityguid = "";
		$scope.count = 0;
		$scope.counts = 0;
		$scope.amounts = 0;
		for(var i = 0; i < $scope.cartList.length; i++) {
			$scope.cardModel = $scope.cartList[i];
			if ($scope.cardModel.isChoose) { //如果取到一个有一个是未选状态的，则全选状态yes
				$scope.commodityguid = $scope.commodityguid + $scope.cardModel.commodity_guid + ",";
				$scope.counts = $scope.counts + $scope.cardModel.cart_count + ",";
				$scope.amounts = $scope.amounts + $scope.cardModel.commodity_price * $scope.cardModel.cart_count + ",";
				$scope.count += 1;
				$scope.totalReomveCart($scope.cardModel);
			}
		}
		if ($scope.commodityguid.length == 0) {
			layer.msg("您还没有选择宝贝哦", {
			  time: 0
			  ,btn: ['确定']
			  ,yes: function(index){
			    layer.close(index);
				}
			});
			return;
		}
		
		var orderAddParamData = {"mid": $scope.member.guid, "count" :  $scope.count, "amount": $scope.allMoney, "cids": $scope.commodityguid, "counts": $scope.counts, "current": 0, "amounts": $scope.amounts};
		
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
			if (response.body.guid != undefined && response.body.guid > 0) {
				location.href = "product_ordertotal.html?id=" + response.body.guid;				
			} else {
				layer.msg("库存不足");
				return;
			}
		});
		
	}

	// 删除购物车该商品
	$scope.removeCart = function(row, index) {
		$http.get(getHeadUrl() + "cart_remove.a?id=" + row.cart_guid).success(function(response) {
			$scope.cartList.splice(index, 1);
			
			// 需要重新计算价格，需要重新更正状态
			$scope.allMoney = 0;
			// 判断现在状态是否为全选状态
			$scope.hasNoChoose = 0;
			if ($scope.cartList.length > 0) {
				for(var i = 0; i < $scope.cartList.length; i++) {
					$scope.cardModel = $scope.cartList[i];
					$scope.allMoney = $scope.allMoney + $scope.cardModel.cart_count * parseFloat($scope.cardModel.commodity_price);
					if (!$scope.cardModel.isChoose) { //如果全部为有一个是未选状态的，则全选状态false
						$scope.hasNoChoose += 1;
					}
				}
				$scope.isAllChoose = $scope.hasNoChoose > 0 ? false : true;
			} else {
				$scope.isAllChoose = false;
			}
			
		});
	}
	
	// 删除购物车该商品
	$scope.totalReomveCart = function(row) {
		$http.get(getHeadUrl() + "cart_remove.a?id=" + row.cart_guid).success(function(response) {
		});
	}

	// 单项操作
	$scope.minus = function(model) {
		if (model.cart_count == 1) {
			return;
		}
		$http.get(getHeadUrl() + "cart_modify.a?id=" + model.cart_guid + "&count=" + (model.cart_count - 1)).success(function(response) {
			model.cart_count -= 1;
			$scope.allMoney -= model.commodity_price;
		});
	}
	
	$scope.plus = function(model) {
		$http.get(getHeadUrl() + "cart_modify.a?id=" + model.cart_guid + "&count=" + (model.cart_count + 1)).success(function(response) {
			model.cart_count += 1;
			$scope.allMoney += model.commodity_price;
		});
	}
	
	$scope.addChoose = function(model) {
		model.isChoose = true;
		$scope.allMoney = $scope.allMoney + model.commodity_price * model.cart_count;
		
		// 判断现在状态是否为全选状态
		$scope.hasNoChoose = false; 
		for(var i = 0; i < $scope.cartList.length; i++) {
			$scope.cardModel = $scope.cartList[i];
			if (!$scope.cardModel.isChoose) { //如果取到一个有一个是未选状态的，则全选状态yes
				$scope.hasNoChoose = true;
				break;
			}
		}
		$scope.isAllChoose = !$scope.hasNoChoose;
		
	}
	
	$scope.removeChoose = function(model) {
		model.isChoose = false;
		$scope.allMoney = $scope.allMoney - model.commodity_price * model.cart_count;
		$scope.isAllChoose = false;
	}
	
	// 全选
	$scope.addAllChoose = function() {
		$scope.allMoney = 0;
		for(var i = 0; i < $scope.cartList.length; i++) {
			$scope.cardModel = $scope.cartList[i];
			$scope.cardModel.isChoose = true;
			$scope.allMoney = $scope.allMoney + $scope.cardModel.cart_count * $scope.cardModel.commodity_price;
		}	
		$scope.isAllChoose = true;
	}
	
	$scope.removeAllChoose = function() {
		for(var i = 0; i < $scope.cartList.length; i++) {
			$scope.cardModel = $scope.cartList[i];
			$scope.cardModel.isChoose = false;
		}
		$scope.isAllChoose = false;
		$scope.allMoney = 0;
	}
	
});