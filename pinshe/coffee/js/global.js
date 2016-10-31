
function getwcid() {
//	return "o1D_JwHikK5LBt_Y__Ukr9p4tKsY";
	
	if (GetQueryString("wcid").length > 0) {
		return GetQueryString("wcid");
	}
	var sd = localStorage.getItem("wid");
	if (sd != undefined && sd.length != 0) {
		return sd;
	} else {
		return "";
	}
}

function pinSheMember() {
	var sd = localStorage.getItem("wid");
	if (sd != undefined && sd.length != 0) {
		if(sd == "o1D_JwHikK5LBt_Y__Ukr9p4tKsY" || sd == "o1D_JwGKMNWZmBYLxghYYw0GIlUg" || sd == "o1D_JwGTL0ZN81hpxJSxflvtXQj8" || sd == "o1D_JwNKxR8PqF7KX_15-aOEk2HU" || sd == "o1D_JwFbCrjU1rPJdO6-ljRQC5qE") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
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

function getStoreGuid() {
	var sd = localStorage.getItem("store_guid");
	if (sd != undefined && sd.length != 0) {
		return sd;
	} else {
		return "";
	}
}

function getStoreManager() {
	var sd = localStorage.getItem("store_manager");
	if (sd == "yes") {
		return true;
	} else if (sd == "no"){
		return false;
	}
}

function getStoreMember() {
	var sd = localStorage.getItem("store_member");
	if (sd == "yes") {
		return true;
	} else if (sd == "no"){
		return false;
	}
}

function getHeadUrl() {
//	return "http://192.168.0.138/v1/";
	return "http://interface.pinshe.org/v1/";
}

function verifyMoney(moneyStr) {
	if( ! /^\d{0,8}\.{0,1}(\d{1,2})?$/.test(moneyStr)){
		return false;
	} else {
		return true;
	}
}
