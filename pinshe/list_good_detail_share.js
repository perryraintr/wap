var exists = 0;

var app = angular.module('pinshe', ['ngSanitize']);
app.controller('list_good_detail_share', function($scope, $http) {
	$http.get("http://www.pinshe.org/v1/post.a?pid=" + GetQueryInt("pid")).success(
		function(response) {
			$scope.json = response;
			
			$scope.images = [];
			$scope.images.push("<div id=\"swiperimgs\" class=\"swiper-wrapper\">");
			for(var i = 0; i < response.body.post_images.length; i++){
				$scope.images.push("<div class=\"swiper-slide\"><img src=\"" + response.body.post_images[i] + "\" style=\"vertical-align:top;max-height:400px;\" width=\"100%\"/></div>");
			}				    
			$scope.images.push("</div>");
			if(response.body.post_images.length > 1)
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
			
			response.body.post_description = response.body.post_description.replace(/\n/g, "<br/>");
		}
	);
	
	$scope.comment = function() {
		var page = GetQueryInt("page", 1);
		if(page > 0){
			if(exists == page)
				return;
			exists = page;
		}

		$http.get("http://www.pinshe.org/v1/comment.a?pid=" + GetQueryInt("pid") + "&page=" + page).success(
			function(response) {
				if(response.body.array.length > 0){
					mui('#scroll').pullRefresh().refresh(true);
	
					for(var i = 0; i < response.body.array.length; i++){
						if(response.body.array[i].user_name == response.body.array[i].reply_name)
							document.getElementById("commont").innerHTML += "<span style=\"color:#358fff;\">" + response.body.array[i].user_name + ":</span> <span style=\"color:#606060;\">" + response.body.array[i].message + "</span><br/>";
						else
							document.getElementById("commont").innerHTML += "<span style=\"color:#358fff;\">" + response.body.array[i].user_name + ": 回复 " + response.body.array[i].reply_name + "</span> <span style=\"color:#606060;\">" + response.body.array[i].message + "</span><br/>";
					}
				}
				
				mui('#scroll').pullRefresh().refresh(false);
			}
		);
	};
	
	
	
});

mui.init({
	swipeBack: false,
	pullRefresh: {
		container: '#scroll',
		down: {
			callback: PullDown
		},
		up: {
			contentrefresh: '正在加载...',
			//contentnomore:'没有更多数据了',
			callback: PullUp,
			auto:false,
			contentdown:''
		}
	}
});

mui("body").on("tap","a",function(){
	if(this.href&&this.href!="#"){window.location.href=this.href;}
})

function PullDown() {
	setTimeout(function() {
		mui('#scroll').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 500);
}

function PullUp() {
	setTimeout(function() {
		mui('#scroll').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
		var scope = angular.element(document.querySelector('[ng-controller=list_good_detail_share]')).scope();
		scope.comment();
	}, 500);
}

document.getElementById("menu-btn").addEventListener('tap', ShowMenu);
function ShowMenu(){
	if($("menu").style.display == "")
		$("menu").style.display = "none";
	else
		$("menu").style.display = "";
}