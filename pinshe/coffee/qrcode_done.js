var orderno = GetQueryString("orderno");
var sid = GetQueryString("id");
var wcid = "";
var memberModel = "";
var storeModel = "";
var orderModel = "";

//orderno = 1476842595761;
//sid = 83;
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
} else {

	$.getJSON("http://interface.pinshe.org/v1/member.a?wcid=" + wcid, function(response) {
		memberModel = response.body;

		$.getJSON("http://interface.pinshe.org/v1/store.a?id=" + sid, function(response) {
			storeModel = response.body;
			var starNum = storeModel.star / storeModel.comment;
			storeModel.starList = [];
			for(var j = 0; j < starNum; j++) {
				storeModel.starList.push(j);
			}
			$('#headId').append(_.template($("#headTemplate").html(), storeModel));

			var height = $(window).width() * 0.42 * 900 / 1242.0;
			$("#imageHeight").attr("height", height);

			$.getJSON("http://interface.pinshe.org/v1/order.a?orderno=" + orderno, function(response) {
				orderModel = response.body;
				document.getElementById("orderStatusStrId").innerHTML = "订单已完成";
				document.getElementById("orderAmountId").innerHTML = orderModel.amount;
				document.getElementById("orderNoId").innerHTML = orderModel.order_no;

				var requestParams = "&amount=" + orderModel.amount + "&order=" + orderModel.order_no + "&title=付款人：【" + encodeURIComponent(memberModel.name) + "】";
				if(storeModel.merchant_wechat_id.length > 0) {
					$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=" + storeModel.merchant_wechat_id + requestParams + " ", function(response) {});
				}
				if(storeModel.merchant_getui_id.length > 0) {
					$.getJSON("http://interface.pinshe.org/v1/getui.a?cid=" + storeModel.merchant_getui_id + "&title=成功收取" + orderModel.amount + "元, 付款人" + memberModel.name + ", &body=订单号: " + orderModel.order_no + "。", function(response) {});
				}
				for(var i = 0; i < storeModel.store_member.length; i++) {
					var storeMemberWcid = storeModel.store_member[i].wechat_id;
					$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=" + storeMemberWcid + requestParams + " ", function(response) {});
					
					var storeMemberGetTui = storeModel.store_member[i].getui_id;
					if(storeMemberGetTui.length > 0) {
						$.getJSON("http://interface.pinshe.org/v1/getui.a?cid=" + storeMemberGetTui + "&title=成功收取" + orderModel.amount + "元, 付款人" + memberModel.name + ", &body=订单号: " + orderModel.order_no + "。", function(response) {});
					}
				}
				$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwFbCrjU1rPJdO6-ljRQC5qE" + requestParams + "－" + storeModel.name, function(response) {
					$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwHikK5LBt_Y__Ukr9p4tKsY" + requestParams + "－" + storeModel.name, function(response) {
						$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=o1D_JwGKMNWZmBYLxghYYw0GIlUg" + requestParams + "－" + storeModel.name, function(response) {});
					});
				});
			});
			
		});
	});

}

$('#followClicked').click(function() {
	WeixinJSBridge.call('closeWindow');
	$.getJSON("http://interface.pinshe.org/v1/wechat_send.a?wcid=" + wcid + "&sid=" + sid + "&oid=" + orderModel.guid).success(function(response) {
	});
});

// Request
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	var context = "";
	if(r != null)
		context = r[2];

	reg = null;
	r = null;

	return context == null || context == "" || context == "undefined" ? "" : context;
}