var app = angular.module("coffee", []);
app.controller("store_setting", function($scope, $http) {
	$scope.sid = GetQueryString("sid");
//	$scope.sid = 59;

	$scope.isExpand = false;
	$scope.description = "";
	$scope.feature2 = [];
	$scope.feature1 = [];
	$scope.page = 1;
	$scope.commentList = [];
	$scope.resultArray = [];

	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoplay: 2000,
		loop: true
	});

	$http.get(getHeadUrl() + "store.a?id=" + $scope.sid).success(function(response) {
		$scope.store = response.body;

		$scope.store.posterUrl = "";
		if($scope.store.video.length > 0) {
			$("#videoId").show();
			$scope.store.posterUrl = $scope.store.video.replace(".mp4", ".jpg");
		}

		$("#swiperwrapper").html("");
		for(var i = 0; i < $scope.store.images.length; i++) {
			swiper.appendSlide(_.template($('#templateSwiper').html())($scope.store.images[i]));
		}

		var itemimgs = document.getElementById("swiperwrapper").getElementsByClassName("picture");
		for(var i = 0; i < itemimgs.length; i++) {
			itemimgs[i].height = $(window).width() * 900 / 1242.0;
		}

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
		$("#descriptionId").html($scope.store.description);

		$scope.store.date = $scope.store.date.replace(/\n/g, "<br/>");
		$("#dateId").html($scope.store.date);

		$scope.store.phone = $scope.store.phone.replace(/\n/g, "<br/>");
		$("#phoneId").html($scope.store.phone);

		var starNum = $scope.store.star / $scope.store.comment;
		$scope.store.starList = [];
		for(var j = 0; j < starNum; j++) {
			$scope.store.starList.push(j);
		}

		$scope.getCommentList();
	});

	$scope.getCommentList = function() {
		$http.get(getHeadUrl() + "store_comment.a?sid=" + $scope.sid + "&page=" + $scope.page).success(function(response) {
			if(response.body.array != undefined && response.body.array.length > 0) {
				$scope.commentModelList = response.body.array;
				for(var i = 0; i < $scope.commentModelList.length > 0; i++) {
					$scope.commentList.push($scope.commentModelList[i]);
				}
			} else {
				if($scope.page != 1) {
					$scope.page -= 1;
					layer.msg("没有更多评价");
				}
			}
		});
	}

	$scope.readDescription = function() {
		$scope.isExpand = true;
		$scope.store.description = $scope.description;
		$("#descriptionId").html($scope.store.description);
	}

	$scope.moreCommend = function() {
		$scope.page += 1;
		$scope.getCommentList();
	}

	$scope.previewAction = function() {
		if($scope.store.slogan.length == 0) {
			layer.msg("请用一句话描述你的咖啡馆");
			return;
		}

		if($scope.store.date.length == 0) {
			layer.msg("请填写营业时间");
			return;
		}

		if($scope.store.phone.length == 0) {
			layer.msg("请填写联系电话");
			return;
		}

		if($scope.store.slogan.length > 100) {
			layer.msg("描述字数不得超过100字");
			return;
		}
		if($scope.store.date.length > 100) {
			layer.msg("营业时间不得超过100字");
			return;
		}
		if($scope.store.phone.length > 100) {
			layer.msg("联系电话不得超过100字");
			return;
		}

		$scope.store.date = $scope.store.date.replace(/\n/g, "<br/>");
		$("#dateId").html($scope.store.date);

		$scope.store.phone = $scope.store.phone.replace(/\n/g, "<br/>");
		$("#phoneId").html($scope.store.phone);

		//iframe层
		layer.open({
			type: 1,
			title: $scope.store.name,
			move: false,
			shadeClose: false,
			shade: 0.8,
			area: ["100%", '100%'],
			content: $("#cafeDetailId")
		});

	}

	$scope.saveAction = function() {
		console.log($scope.store.slogan);
		console.log($scope.store.date);
		console.log($scope.store.phone);
		if($scope.store.slogan.length == 0) {
			layer.msg("请用一句话描述你的咖啡馆");
			return;
		}

		if($scope.store.date.length == 0) {
			layer.msg("请填写营业时间");
			return;
		}

		if($scope.store.phone.length == 0) {
			layer.msg("请填写联系电话");
			return;
		}

		if($scope.store.slogan.length > 100) {
			layer.msg("描述字数不得超过100字");
			return;
		}
		if($scope.store.date.length > 100) {
			layer.msg("营业时间不得超过100字");
			return;
		}
		if($scope.store.phone.length > 100) {
			layer.msg("联系电话不得超过100字");
			return;
		}

		var storeModifyData = {
			"id": $scope.sid,
			"slogan": $scope.store.slogan,
			"date": $scope.store.date,
			"phone": $scope.store.phone
		};

		$http({
			method: 'POST',
			url: getHeadUrl() + "store_modify.a",
			data: $.param(storeModifyData),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).success(function(response) {
			layer.msg("保存成功");
		});
	}

});