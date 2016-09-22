var vids = "";
var app = angular.module('pinshe', []);
app.controller('vote', function($scope, $http) {
	$http.get("http://www.pinshe.org/v1/vote.a?uid=1").success(
		function(response){
			$scope.json = [];
			if(response.body.array.length > 0){
				vids = response.body.array[0].vote_guid;
				$scope.json.push(response.body.array[0]);
				for(var i = 1; i < response.body.array.length; i++){
					vids += "," + response.body.array[i].vote_guid;
					$scope.json.push(response.body.array[i]);
				}
			}
		}
	);
	
	$scope.getMore = function(){
		$http.get("http://www.pinshe.org/v1/vote.a?uid=1&vids=" + vids).success(
			function(response) {
				if(response.body.array.length > 0){
					mui('#scroll').pullRefresh().refresh(false);
					
					for(var i = 0; i < response.body.array.length; i++){
						vids += "," + response.body.array[i].vote_guid;
						$scope.json.push(response.body.array[i]);
					}
				}
				
				mui('#scroll').pullRefresh().refresh(true);
			}
		);
	};
	
	$scope.httpGet = function(url){
		$http.get(url).success();
	}
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

mui("body").on("tap","img",function(){
	eval(this.alt);
})

function PullDown() {
	setTimeout(function() {
		mui('#scroll').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 500);
}

function PullUp() {
	setTimeout(function() {
		mui('#scroll').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
		var scope = angular.element(document.querySelector('[ng-controller=vote]')).scope();
		scope.getMore();
	}, 500);
}

document.getElementById("menu-btn").addEventListener('tap', ShowMenu);
function ShowMenu(){
	if($("menu").style.display == "")
		$("menu").style.display = "none";
	else
		$("menu").style.display = "";
}


function GetCountA(counta, countb, index, vid) {
		counta = counta + 1;

		if(counta + countb > 0){
			counta = parseInt(counta * 100 / (counta + countb));
			countb = 100 - counta;
		}else{
			counta = 0;
			countb = 0;
		}

		if(counta >= countb){
			$("imga" + index).innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + counta + "%</font></div><a href=\"vote_detail.html?vid=" + vid + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
			$("imgb" + index).innerHTML = "<div class='line-right' style='height:" + (countb / counta) * 60 + "%; display: block;'><div>" + countb + "%</div></div>";
		}else{
			$("imga" + index).innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:" + (counta / countb) * 60 + "%; display: block;'><div>" + counta + "%</div><a href=\"vote_detail.html?vid=" + vid + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
			$("imgb" + index).innerHTML = "<div class='line-right' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + countb + "%</font></div></div>";
		}
		
		var scope = angular.element(document.querySelector('[ng-controller=vote]')).scope();
		scope.httpGet("http://www.pinshe.org/v1/modifyvote.a?id=" + vid +"&a=1");
	}
		
function GetCountB(counta, countb, index, vid) {				
		countb = countb + 1;
				
		if(counta + countb > 0){
			counta = parseInt(counta * 100 / (counta + countb));
			countb = 100 - counta;
		}else{
			counta = 0;
			countb = 0;
		}
				
		if(counta >= countb){
			$("imga" + index).innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + counta + "%</font></div></div>";
			$("imgb" + index).innerHTML = "<div class='line-right' style='height:" + (countb / counta) * 60 + "%; display: block;'><div>" + countb + "%</div><a href=\"vote_detail.html?vid=" + vid + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
		}else{
			$("imga" + index).innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:" + (counta / countb) * 60 + "%; display: block;'><div>" + counta + "%</div></div>";
			$("imgb" + index).innerHTML = "<div class='line-right' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + countb + "%</font></div><a href=\"vote_detail.html?vid=" + vid + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";		
		}
				
		var scope = angular.element(document.querySelector('[ng-controller=vote]')).scope();
		scope.httpGet("http://www.pinshe.org/v1/modifyvote.a?id=" + vid +"&b=1");
	}


function ShowIt(index){
	$("shareId" + index).style.display = "";
}