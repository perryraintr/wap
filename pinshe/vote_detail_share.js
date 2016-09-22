var exists = 0;

var app = angular.module('pinshe', []);
app.controller('vote_detail', function($scope, $http) {
	$http.get("http://www.pinshe.org/v1/vote.a?vid=" + GetQueryInt("vid")).success(
		function(response) {
			$scope.json = response;
			
			$scope.counta = response.body.vote_count_a;
			$scope.countb = response.body.vote_count_b;
			if($scope.counta + $scope.countb > 0){
				$scope.counta = parseInt($scope.counta * 100 / ($scope.counta + $scope.countb));
				$scope.countb = 100 - $scope.counta;
			}else{
				$scope.counta = 0;
				$scope.countb = 0;
			}
		}
	);
	
	$scope.comment = function() {

		var page = GetQueryInt("page", 1);
		if(page > 0){
			if(exists == page)
				return;
			exists = page;
		}

		$http.get("http://www.pinshe.org/v1/comment.a?vid=" + GetQueryInt("vid") + "&page=" + page).success(
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
//			auto:true,
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
		var scope = angular.element(document.querySelector('[ng-controller=vote_detail]')).scope();
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