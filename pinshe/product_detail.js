var app = angular.module('pinshe', ['ngSanitize']);
app.controller('product_detail', function($scope, $http) {
	
	$http.get("http://www.pinshe.org/v1/product.a?pid=" + GetQueryInt("pid")).success(
		function(response) {
			$scope.product = response;

			$scope.images = [];
			$scope.images.push("<div id=\"swiperimgs\" class=\"swiper-wrapper\">");
			for(var i = 0; i < response.body.product_images.length; i++){
				$scope.images.push("<div class=\"swiper-slide\"><img src=\"" + response.body.product_images[i] + "\" style=\"vertical-align:top;max-height:400px;\" width=\"100%\"/></div>");
			}				    
			$scope.images.push("</div>");
			if(response.body.product_images.length > 1)
				$scope.images.push("<div style=\"text-align:right\" class=\"swiper-pagination\"></div>");

			$("images").innerHTML = $scope.images.join("");
			
			var swiper = new Swiper('.swiper-container', {
			    pagination: '.swiper-pagination',
			    paginationClickable: true,
			    loop: true
			});
			
			var imgs = document.getElementById("swiperimgs").getElementsByTagName("img");
			for(var i = 0; i < imgs.length; i++)
				imgs[i].height = imgs[i].width;
			
			response.body.product_description = response.body.product_description.replace(/\n/g, "<br/>");
			$scope.hitCount(response.body.product_name + response.body.product_guid);
		}
	);

	$http.get("http://www.pinshe.org/v1/post.a?productid=" + GetQueryInt("pid")).success(
		function(response) {
			$scope.post = response;
			$scope.post1 = [];
			$scope.post2 = [];
			for(var i = 0; i < $scope.post.body.array.length; i++){
				if($scope.post.body.array[i].post_description.length > 32)
					$scope.post.body.array[i].post_description = $scope.post.body.array[i].post_description.toTrim(32, "...");
				if(i % 2 == 0){
					$scope.post1.push($scope.post.body.array[i]);
				}else{
					$scope.post2.push($scope.post.body.array[i]);
				}
			}
		}
	);
	
	$scope.add = function(name, guid) {
		$scope.hitCount(name + guid + "-buy");
	}
	// 统计数量
	$scope.hitCount = function(name) {
		$http.get("http://www.pinshe.org/v1/admin_hit_add.a?name=" + name).success(
			function(response) {
			}
		);
	}
	
});

document.getElementById("menu-btn").addEventListener('tap', ShowMenu);
function ShowMenu(){
	if($("menu").style.display == "")
		$("menu").style.display = "none";
	else
		$("menu").style.display = "";
}