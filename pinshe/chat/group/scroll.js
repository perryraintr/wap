var index = 0;
var isStart = false;
// pull down height
var downOffset = 0;
var down = $("#wrapper #pullDown");
if (down.length > 0)
	downOffset = down[0].offsetHeight;
//	var downLable = down.children(".pullDownLabel")[0];
var downImage = $("#pullDownImage");
// pull up height
var upOffset = 0;
var up = $("#wrapper #pullUp");	
if(up.length > 0)
	upOffset = up[0].offsetHeight;
//	var upLable = up.children(".pullUpLabel")[0];
var upImage = $("#pullUpImage");	

down.hide();
up.hide();

var scroll = new IScroll("#wrapper", {
	probeType:3,
	tap:false,
	click:true,
	preventDefaultException:{tagName:/.*/},
	mouseWheel:false,
	scrollbars:false,
	fadeScrollbars:false,
	interactiveScrollbars:false,
	keyBindings:false,
	startY:-downOffset
});

scroll.on("scrollStart", function () {
	if(!isStart && this.maxScrollY != 0){
		down.show();
//		up.show();
		isStart = true;
	}
});

scroll.on("scroll", function(){
	if(this.y >= 0 && this.y <= 40){
		downImage.attr("src", "img/down.png"); 
		return;
	}
	
	if(this.y > 40){
		downImage.attr("src", "img/up.png"); 
		return;
	}
		
	if(this.y > this.maxScrollY - 40 && this.y <= this.maxScrollY){
		upImage.attr("src", "img/up.png"); 
		return;
	}

	if(this.y <= this.maxScrollY - 40){
		upImage.attr("src", "img/down.png"); 
		return;
	}
});


scroll.on("slideDown",function(){
	if(this.y > 40){
		downImage.attr("src", "img/loading.gif");
		pullDownAction();
		scroll.refresh();
	}
});

scroll.on("slideUp",function(){
	if(this.maxScrollY - this.y > 40){
		upImage.attr("src", "img/loading.gif");
		pullUpAction();
		scroll.refresh();
	}
});

var pullDownAction = function(){
//	var li = document.createElement('li');
//	li.innerText = index++;
//	list.prepend(li);
}

var pullUpAction = function(){
//	var li = document.createElement('li');
//	li.innerText = index++;
//	list.append(li);
}

var refreshScroll = function(){
	scroll.refresh();
	scroll.scrollToElement("li:nth-child(" + $('#wrapper div > li').length + ")", 100);
}

document.addEventListener("touchmove", function(e){e.preventDefault();}, false);