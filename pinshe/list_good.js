var page = 1;
var app = angular.module('pinshe', []);
app.controller('list_good', function($scope, $http) {
	$http.get("http://www.pinshe.org/v1/tag.a?t1=1&page=1").success(function(response) {
		page = page + 1;
		$scope.tag = [];
		if(response.body.array.length > 0){
			for(var i = 0; i < response.body.array.length; i++){
				$scope.tag.push(response.body.array[i]);
			}
		}
	});

	$scope.getMore = function(){
		$http.get("http://www.pinshe.org/v1/tag.a?t1=1&page=" + page).success(function(response) {
			page = page + 1;
			
			if(response.body.array.length > 0){
				mui('#scroll').pullRefresh().refresh(false);
				for(var i = 0; i < response.body.array.length; i++){
					$scope.tag.push(response.body.array[i]);
				}
			}
			mui('#scroll').pullRefresh().refresh(true);
		});
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
		var scope = angular.element(document.querySelector('[ng-controller=list_good]')).scope();
		scope.getMore();
	}, 500);
}
//var w=$(".tagImage").width();// 这里获取到宽度
//$(".tagImage").height(w) //然后让宽度等与高度就是正方形
document.getElementById("menu-btn").addEventListener('tap', ShowMenu);
function ShowMenu(){
	if($("menu").style.display == "")
		$("menu").style.display = "none";
	else
		$("menu").style.display = "";
}