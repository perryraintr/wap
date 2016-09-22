var app = angular.module('pinshe', []);
app.controller('vote_share', function($scope, $http) {
	$http.get("http://www.pinshe.org/v1/vote.a?vid=" + GetQueryInt("vid")).success(
		function(response){
			$scope.json = response;
		}
	);
	
	$scope.GetCountA = function(counta, countb) {
		counta = counta + 1;

		if(counta + countb > 0){
			counta = parseInt(counta * 100 / (counta + countb));
			countb = 100 - counta;
		}else{
			counta = 0;
			countb = 0;
		}

		if(counta >= countb){
			$("imga").innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + counta + "%</font></div><a href=\"vote_detail.html?vid=" + GetQueryInt("vid") + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
			$("imgb").innerHTML = "<div class='line-right' style='height:" + (countb / counta) * 60 + "%; display: block;'><div>" + countb + "%</div></div>";
		}else{
			$("imga").innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:" + (counta / countb) * 60 + "%; display: block;'><div>" + counta + "%</div><a href=\"vote_detail.html?vid=" + GetQueryInt("vid") + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
			$("imgb").innerHTML = "<div class='line-right' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + countb + "%</font></div></div>";
		}
		
		$http.get("http://www.pinshe.org/v1/modifyvote.a?id=" + GetQueryInt("vid") +"&a=1").success();
	};
		
	$scope.GetCountB = function(counta, countb) {				
		countb = countb + 1;
				
		if(counta + countb > 0){
			counta = parseInt(counta * 100 / (counta + countb));
			countb = 100 - counta;
		}else{
			counta = 0;
			countb = 0;
		}
				
		if(counta >= countb){
			$("imga").innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + counta + "%</font></div></div>";
			$("imgb").innerHTML = "<div class='line-right' style='height:" + (countb / counta) * 60 + "%; display: block;'><div>" + countb + "%</div><a href=\"vote_detail.html?vid=" + GetQueryInt("vid") + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";
		}else{
			$("imga").innerHTML = "<div class='background-overlay'></div><div class='line-left' style='height:" + (counta / countb) * 60 + "%; display: block;'><div>" + counta + "%</div></div>";
			$("imgb").innerHTML = "<div class='line-right' style='height:60%;background:rgba(255,87,101,0.9) none repeat scroll 0% 0%; display: block;'><div><font style='color:rgba(255,87,101,0.9)'>" + countb + "%</font></div><a href=\"vote_detail.html?vid=" + GetQueryInt("vid") + "\"><img src=\"img/logo.png\" width=\"24px\" height=\"24px\"/></a></div>";		
		}
				
		$http.get("http://www.pinshe.org/v1/modifyvote.a?id=" + GetQueryInt("vid") +"&b=1").success();
	};
	
});

function ShowIt(){
	$("shareId").style.display="";
};
		
document.getElementById("menu-btn").addEventListener('tap', ShowMenu);
function ShowMenu(){
	if($("menu").style.display == "")
		$("menu").style.display = "none";
	else
		$("menu").style.display = "";
}