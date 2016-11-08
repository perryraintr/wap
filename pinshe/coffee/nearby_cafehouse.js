var wcid = "";
var longitude = 0;
if(GetQueryString("longitude").length > 0) {
	longitude = GetQueryString("longitude");
}
var latitude = 0;
if(GetQueryString("latitude").length > 0) {
	latitude = GetQueryString("latitude");
}
var storeList = [];
var page = 1;
var distance = 9007199254740993;

//wcid = "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
//longitude = 116.449272;
//latitude = 39.936395;
//getList();

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
	$.getJSON(getHeadUrl() + "wechat_sign.a?url=" + encodeURIComponent(location.href), function(response) {
		var wecharSign = response;
		wx.config({
			debug: false,
			appId: wecharSign.appId,
			timestamp: wecharSign.timestamp,
			nonceStr: wecharSign.nonceStr,
			signature: wecharSign.signature,
			jsApiList: [
				"getLocation",
				"onMenuShareTimeline",
				"onMenuShareAppMessage",
			]
		});

		wx.ready(function() {
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function(res) {
					var res_latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var res_longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					if((latitude > 0) || (longitude > 0)) {
						var locations = longitude + "," + latitude;
						$.getJSON("http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + locations + "&coordsys=gps&output=json&key=f3deedff4fa239df6844a0f292c24d1d", function(response) {
							longitude = response.locations.split(",")[0];
							latitude = response.locations.split(",")[1];
							getList();
						});
					} else {
						var locations = res_longitude + "," + res_latitude;
						$.getJSON("http://restapi.amap.com/v3/assistant/coordinate/convert?locations=" + locations + "&coordsys=gps&output=json&key=f3deedff4fa239df6844a0f292c24d1d", function(response) {
							longitude = response.locations.split(",")[0];
							latitude = response.locations.split(",")[1];
							getList();
						});
					}
				}
			});

		});
		wx.error(function(res) {
			console.log('wx.error: ' + JSON.stringify(res));
		});
	});
	
	var swiper = new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		loop: true
	});

	$.getJSON(getHeadUrl() + "member.a?wcid=" + wcid, function(response) {
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

function getList() {
	$.getJSON(getHeadUrl() + "store.a?longitude=" + longitude + "&latitude=" + latitude + "&distance=" + distance + "&page=" + page + "&by=1", function(response) {
		if(response.body.array != undefined && response.body.array.length > 0) {
			var storeModelList = response.body.array;
			for(var i = 0; i < response.body.array.length; i++) {
				storeModelList[i].distanceStr = (storeModelList[i].distance / 1000).toFixed(2);

				var starNum = storeModelList[i].star / storeModelList[i].comment;
				storeModelList[i].starList = [];
				for(var j = 0; j < starNum; j++) {
					storeModelList[i].starList.push(j);
				}

				if(storeModelList[i].guid == 83) {
					if(pinSheMember()) {
						storeList.push(storeModelList[i]);
					}
				} else {
					storeList.push(storeModelList[i]);
				}
			}

			$("#storeListLoadingId").hide();
			$("#storeListShowId").show();
			$("#storeListId").html("");
			$('#storeListId').append(_.template($("#storeListTemplate").html(), storeList));

		} else {
			if(page == 1) {
				$.dialog({
					content: '您周围没有商家入驻的咖啡店哦',
					title: "alert",
					time: 2000
				});
			} else {
				page -= 1;
				$.dialog({
					content: '没有更多咖啡店',
					title: "alert",
					time: 2000
				});
			}
		}

		if(page == 1 && storeList.length > 0) {
			wx.onMenuShareAppMessage({
				title: "附近好咖啡馆",
				desc: "全世界最好的咖啡馆", // 分享描述
				link: location.href,
				imgUrl: storeList[0].image
			});
			wx.onMenuShareTimeline({
				title: "附近好咖啡馆",
				desc: "附近好咖啡馆", // 分享标题
				link: location.href, // 分享链接
				imgUrl: storeList[0].image // 分享图标
			});
		}

	});
}

function moreClickedId() {
	page += 1;
	getList();
}

function pushMap() {
	location.href = "nearby_cafemap.html?longitude=" + longitude + "&latitude=" + latitude;
}

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

function pinSheMember() {
	var sd = localStorage.getItem("wid");
	if(sd != undefined && sd.length != 0) {
		if(sd == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || sd == "o1D_JwGKMNWZmBYLxghYYw0GIlUg" || sd == "o1D_JwGTL0ZN81hpxJSxflvtXQj8" || sd == "o1D_JwNKxR8PqF7KX_15-aOEk2HU" || sd == "o1D_JwFbCrjU1rPJdO6-ljRQC5qE") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}