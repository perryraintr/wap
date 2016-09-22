
function getwcid() {
	if (GetQueryString("wcid").length > 0) {
		return GetQueryString("wcid");
	}
	var sd = localStorage.getItem("wid");
	if (sd != undefined && sd.length != 0) {
		return sd;
	} else {
//		return "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
		return "";
	}
}

function getTel() {
	var sd = localStorage.getItem("tel");
	if (sd != undefined && sd.length != 0) {
		return sd;
	} else {
		return "";
	}
}

function getStoreTel() {
	var sd = localStorage.getItem("store_tel");
	if (sd != undefined && sd.length != 0) {
		return sd;
	} else {
		return "";
	}
}

function getHeadUrl() {
//	return "http://192.168.1.85/v1/";
	return "http://interface.pinshe.org/v1/";
}
