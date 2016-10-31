var sid = GetQueryString("sid");
var wcid = "";
var memberModel = "";
//sid = 83;
//wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";

$("#isMemberId").hide();
$("#isNotMemberId").hide();
$("#isCafeMemberId").hide();

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
		if(memberModel.amount > 0) {
			$("#isMemberId").show();
			$("#isNotMemberId").hide();
			document.getElementById("memberCurrentId").innerHTML = memberModel.current;
		} else {
			$("#isNotMemberId").show();
			$("#isMemberId").hide();
		}
	});
}

$.getJSON("http://interface.pinshe.org/v1/store.a?id=" + sid, function(response) {
	document.getElementById("storeName").innerHTML = response.body.name;
});

var isPay = false;

// 会员买单
$('#memberActionId').click(function() {
	var money = document.getElementById("money").value;
	if(money.length == 0 || money == 0) {
		$.dialog({
			content: '请输入金额',
			title: "alert",
			time: 2000
		});
		return;
	}

	if(!verifyMoney(money)) {
		$.dialog({
			content: '输入金额格式错误',
			title: "alert",
			time: 2000
		});
		return;
	}

	if(money > memberModel.current) {
		$.dialog({
			content: '余额不足',
			title: "alert",
			time: 2000
		});
		return;
	}
	
	if(isPay) {
		return;
	}
	isPay = true;
	
	//询问框
	$.dialog({
		content: "您确定要使用会员支付 <span style='font-size: 18px; color: #ce1736;'>" + money + "</span> 元吗?",
		title: 'ok',
		background: 'white',
		ok: function() {
			$.getJSON("http://interface.pinshe.org/v1/member.a?wcid=" + wcid, function(response) {
				memberModel = response.body;
				if(memberModel.current >= money) {
					var memberCurrent = memberModel.current - money;
					var orderAddParamData = {
						"mid": memberModel.guid,
						"count": 1,
						"amount": money,
						"sids": sid + ",",
						"counts": "1",
						"current": money,
						"amounts": money + ","
					};

					$.post('http://interface.pinshe.org/v1/order_add.a', orderAddParamData, function(response) {
						var order = response.body;
						$.getJSON("http://interface.pinshe.org/v1/member_modify.a?id=" + memberModel.guid + "&current=" + memberCurrent, function(response) {
							$.getJSON("http://interface.pinshe.org/v1/order_modify.a?type=1&status=3&id=" + order.guid, function(response) {
								$.getJSON("http://interface.pinshe.org/v1/store_cash_add.a?sid=" + sid + "&memberid=" + memberModel.guid + "&oid=" + order.guid + "&amount=" + order.amount + "&type=1&status=1", function(response) {
									location.href = "qrcode_done.html?orderno=" + order.order_no + "&id=" + sid;
								});
							});
						});
					});

				} else {
					isPay = false;
					$.dialog({
						content: '余额不足',
						title: "alert",
						time: 2000
					});
				}
			});
			return false;
		},
		cancel: function() {
			isPay = false;
		},
		lock: false
	});

});

$('#wxpayActionId').click(function() {
	var money = document.getElementById("money").value;
	if(money.length == 0 || money == 0) {
		$.dialog({
			content: '请输入金额',
			title: "alert",
			time: 2000
		});
		return;
	}

	if(!verifyMoney(money)) {
		$.dialog({
			content: '输入金额格式错误',
			title: "alert",
			time: 2000
		});
		return;
	}

	if(isPay) {
		return;
	}
	isPay = true;

	var orderAddParamData = {
		"mid": memberModel.guid,
		"count": 1,
		"amount": money,
		"sids": sid + ",",
		"counts": "1",
		"current": money,
		"amounts": money + ","
	};

	$.post('http://interface.pinshe.org/v1/order_add.a', orderAddParamData, function(response) {
		var order = response.body;
		$.getJSON("http://interface.pinshe.org/v1/order_modify.a?type=2&id=" + order.guid, function(response) {
			location.href = "http://interface.pinshe.org/v1/pay/wechat_pay.a?type=1&wcid=" + wcid + "&order_no=" + order.order_no + "-3-" + sid + "&amount=" + order.amount * 100;
		});
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

function verifyMoney(moneyStr) {
	if(!/^\d{0,8}\.{0,1}(\d{1,2})?$/.test(moneyStr)) {
		return false;
	} else {
		return true;
	}
}