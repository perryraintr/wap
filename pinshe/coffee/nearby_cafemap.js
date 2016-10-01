var app = angular.module("coffee", []);
app.controller("nearby_cafemap", function($scope, $http) {

	$scope.wcid = getwcid();
	$scope.longitude = GetQueryString("longitude");
	$scope.latitude = GetQueryString("latitude");
	
//	$scope.wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	if($scope.wcid.length == 0) {
		location.href = "go.html?url=" + location.href;
		return;
	}

//	$scope.longitude = 116.40384;
//	$scope.latitude = 39.938986;
	
	$scope.peopleLongitude = $scope.longitude;
	$scope.peopleLatitude = $scope.latitude;

	$scope.makerList = [];
	$scope.storeList = [];
	$scope.currentStore = null;

	var mapObject = new AMap.Map('container');
	mapObject.setZoom(12);
	var marker = new AMap.Marker({
		icon: "http://www.pinshe.org/html/v1/coffee/img1/n6.png",
		position: [$scope.peopleLongitude, $scope.peopleLatitude],
		title: "本人",
		map: mapObject
	});
	mapObject.setCenter(marker.getPosition());

	AMap.event.addListener(mapObject, 'dragend', function() {
		$scope.resetMapMarker(mapObject.getCenter());
	});

	$scope.resetMapMarker = function(center) {
		$scope.longitude = center.lng;
		$scope.latitude = center.lat;
		$scope.getList();
	}

	AMap.plugin('AMap.Geocoder', function() {
		mapObject.on('click', function(e) {
			$scope.resetMapMarker(e.lnglat);
		})
	});

	$scope.getList = function() {
		var distance = 9007199254740993;
		$http.get(getHeadUrl() + "store.a?longitude=" + $scope.longitude + "&latitude=" + $scope.latitude + "&distance=" + distance + "&page=1&by=1").success(function(response) {
			if (response.body.array != undefined && response.body.array.length > 0) {
				for (var i = 0; i < response.body.array.length; i++) {
					$scope.newStore = response.body.array[i];
					$scope.isNew = true;
					if($scope.newStore.guid == 83) {
						continue;
					}
					
					for (var j = 0; j < $scope.storeList.length; j++) {
						$scope.lastStore = $scope.storeList[j];
						if ($scope.newStore.name == $scope.lastStore.name) {
							$scope.isNew = false;
							break;
						}
					}
					
					if ($scope.isNew) {
						$scope.newStore.distanceStr = ($scope.newStore.distance / 1000).toFixed(2);
						var starNum = $scope.newStore.star / $scope.newStore.comment;
						$scope.newStore.starList = [];
						for(var j = 0; j < starNum; j++) {
							$scope.newStore.starList.push(j);
						}
						var marker = new AMap.Marker({
							icon: "http://www.pinshe.org/html/v1/coffee/img1/n10.png",
							position: [$scope.newStore.longitude, $scope.newStore.latitude],
							title: $scope.newStore.name,
							map: mapObject
						});
						marker.setMap(mapObject);
						AMap.event.addListener(marker, 'click', _onClick);
						
						$scope.makerList.push(marker);
						$scope.storeList.push($scope.newStore);
						
						if ($scope.currentStore == null) {
							var marker = $scope.makerList[0];
							marker.setIcon("http://www.pinshe.org/html/v1/coffee/img1/n11.png");
							marker.setzIndex(101);
							$scope.currentStore = $scope.storeList[0];
							$("#currenStoreId").html(_.template($('#templateId').html())($scope.currentStore));
						}
						
					}
					
				}
			} else {
				layer.msg("当前范围没有咖啡馆");
			}
			
			var height = document.body.clientWidth * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);
			
			
		});
	}

	$http.get(getHeadUrl() + "member.a?wcid=" + $scope.wcid).success(function(response) {
		$scope.member = response.body;
		$scope.isMember = $scope.member.amount > 0;
		$scope.getList();

		var width = document.body.clientWidth;
		$("#container").css("height", width);

	});

	$scope.readStore = function(e) {
		for(var j = 0; j < $scope.makerList.length; j++) {
			$scope.marke = $scope.makerList[j];
			if($scope.marke.G.title == e.target.G.title) {
				$scope.marke.setIcon("http://www.pinshe.org/html/v1/coffee/img1/n11.png");
				$scope.marke.setzIndex(101);
			} else {
				$scope.marke.setIcon("http://www.pinshe.org/html/v1/coffee/img1/n10.png");
				$scope.marke.setzIndex(1);
			}
		}

		for(var i = 0; i < $scope.storeList.length; i++) {
			$scope.store = $scope.storeList[i];
			$scope.store.distanceStr = ($scope.store.distance / 1000).toFixed(2);
			var starNum = $scope.store.star / $scope.store.comment;
			$scope.store.starList = [];
			for(var j = 0; j < starNum; j++) {
				$scope.store.starList.push(j);
			}

			if($scope.store.name == e.target.G.title) {
				$("#currenStoreId").html(_.template($('#templateId').html())($scope.store));
			}

		}
	}

});

var _onClick = function(e) {
	var scope = angular.element(document.querySelector('[ng-controller=nearby_cafemap]')).scope();
	scope.readStore(e);
}