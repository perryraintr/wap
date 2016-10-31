var wcid = "";
var memberModel = "";
var choosePay = "";

//wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

var sd = localStorage.getItem("wid");
if(sd != undefined && sd.length != 0) {
	wcid = sd;
}

if(wcid.length == 0) {
	var sd = localStorage.getItem("goBase");
	if(sd != undefined && sd.length > 0) {
		localStorage.setItem("goBase", "");
		location.href = "go.html?url=" + location.href;
	} else {
		localStorage.setItem("goBase", "goBase");
		location.href = "go_base.html?url=" + location.href;
	}
}

var swiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
	direction: 'vertical',
});

var chooseList = [{
	"title": "试用会员",
	"desc": "充￥200得￥220",
	"isChoose": false,
	"cid": "114",
	"amount": "200"
}, {
	"title": "纯享会员",
	"desc": "充￥500得￥600",
	"isChoose": false,
	"cid": "113",
	"amount": "500"
}, {
	"title": "乐享会员",
	"desc": "充￥800得￥1000",
	"isChoose": false,
	"cid": "112",
	"amount": "800"
}, {
	"title": "尊享会员",
	"desc": "充￥1600得￥2000",
	"isChoose": false,
	"cid": "111",
	"amount": "1600"
}, {
	"title": "自定义充值金额",
	"desc": "",
	"isChoose": false,
	"cid": "126",
	"amount": ""
}];

$.getJSON("http://interface.pinshe.org/v1/member.a?wcid=" + wcid, function(response) {
	memberModel = response.body;
	
	if(memberModel.phone.length == 0) {
		$.dialog({
			content: $("#addTelphoneId").html(),
			title: 'ok',
			background: 'white',
			ok: function() {
				var phone = document.getElementById("phone").value;
				if(phone.length == 0 || phone.length != 11) {
					$.dialog({
						content: '请输入正确的手机号',
						title: "alert",
						time: 2000
					});
					return false;
				} else {
					$.getJSON("http://interface.pinshe.org/v1/login.a?wcid=" + wcid + "&phone=" + phone, function(response) {
						localStorage.setItem("wid", response.body.wechat_id);
						localStorage.setItem("tel", response.body.phone);
						memberModel = response.body;
						freshSwiper();
					});
				}
			},
			lock: false
		});
	} else {
		freshSwiper();
	}
});

function freshSwiper() {
	$("#swiperSlideId").show();
	if(memberModel.amount > 0) {
		swiper.appendSlide(_.template($("#isMemberTemplate").html(), memberModel));
		swiper.appendSlide(_.template($("#isMemberChooseTemplate").html(), chooseList));
	} else {
		swiper.appendSlide(_.template($("#notMemberTemplate").html(), chooseList));
		swiper.appendSlide(_.template($("#isMemberChooseTemplate").html(), chooseList));
	}
}

function nextButton() {
	swiper.slideNext();
}

function chooseMember(index) {
	if(index == 4) {
		location.href = "my_memberrecharge.html?mid=" + memberModel.guid;
		return;
	}
	for(var i = 0; i < chooseList.length; i++) {
		chooseList[i].isChoose = false;
	}
	chooseList[index].isChoose = true;
	choosePay = chooseList[index];
	if(memberModel.amount > 0) {
		swiper.appendSlide(_.template($("#isMemberChooseTemplate").html(), chooseList));
		swiper.removeSlide(1);
	} else {
		swiper.appendSlide(_.template($("#isMemberChooseTemplate").html(), chooseList));
		swiper.removeSlide(2);
	}
}

function pay() {
	if(choosePay.cid != undefined && choosePay.cid > 0) {
		var orderAddParamData = {
			"mid": memberModel.guid,
			"count": 1,
			"amount": choosePay.amount,
			"cids": choosePay.cid + ",",
			"counts": "1,",
			"current": 0,
			"amounts": choosePay.amount + ","
		};

		$.post("http://interface.pinshe.org/v1/order_add.a", orderAddParamData, function(response) {
			if(response.body.guid != undefined && response.body.guid > 0) {
				location.href = "product_ordertotal.html?id=" + response.body.guid;
			}
		});
	} else {
		$.dialog({
			content: '请选择你的充值金额',
			title: "alert",
			time: 2000
		});
	}
}