// 句柄
$ = function(_this) {
    return document.getElementById(_this);
}
// Flash 句柄
$M = function(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
}

// 日期 - 格式化
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month  
        "d+": this.getDate(),    //day  
        "h+": this.getHours(),   //hour  
        "m+": this.getMinutes(), //minute  
        "s+": this.getSeconds(), //second  
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter  
        "S": this.getMilliseconds() //millisecond  
    }

    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }

    return format;
}

// 数值四舍五入
Number.prototype.toFixeds = function(len, v) {
    if (this == 0)
        return v;
    else
        return (Math.round(this * Math.pow(10, len)) / Math.pow(10, len)).toFixed(len);
}

// 数值 - 补前导0
Number.prototype.padLeft = function(length) {
    var thisLength = this.toString().length;

    if (thisLength < length) {
        var count = length - thisLength;
        var zero = "";
        for (var i = 0; i < count; i++)
            zero += "0";

        var value = zero + this;

        zero = null;
        count = null;
        i = null;
        thisLength = null;

        return value;
    }

    thisLength = null;
    return this;
}

// Request
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];

    reg = null;
    r = null;

    return context == null || context == "" || context == "undefined" ? "" : context;
}

function GetQueryInt(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];

    reg = null;
    r = null;

    return context == null || context == "" || context == "undefined" ? 0 : new Number(context);
}

function GetQueryInt(name, value) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null)
        context = r[2];

    reg = null;
    r = null;

    return context == null || context == "" || context == "undefined" ? value : new Number(context);
}

// String.format("{0} - 宏观数据 - 和讯网", "www");
String.format = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
        re = null;
    }
    i = null;
    return str;
}
// var a = "12.1"; a.toFloat(1.1);   value出错返回值
String.prototype.toFloat = function(value) {
    if (this == null || this == "") return value;
    try { return parseFloat(this); } catch (ex) { return value; }
}
// var a = "12"; a.toInt(1);   value出错返回值
String.prototype.toInt = function(value) {
    if (this == null || this == "") return value;
    try { return parseInt(this); } catch (ex) { return value; }
}

// 字符串四舍五入
String.prototype.toFixeds = function(len, v) {
    var _this = this.toFloat(0);
    return _this.toFixeds(len, v);
}

// 截取固定长度子字符串 source为字符串len为长度
String.prototype.toTrim = function(len, v) {
    if (this.replace(/[^\x00-\xff]/g, "xx").length <= len)
        return this;

    var str = "";
    var l = 0;
    var schar;
    for (var i = 0; schar = this.charAt(i); i++) {
        str += schar;
        l += (schar.match(/[^\x00-\xff]/) != null ? 2 : 1);
        if (l >= len)
            break;
    }

    return str + v;
}

// 字符串处理函数
// var sb = new StringBuilder();
// sb.append("test");
// sb.toString();
function StringBuffer() {
    this._string = new Array();
}

StringBuffer.prototype.append = function(value) {
    this._string.push(value);
}

StringBuffer.prototype.toString = function() {
    return this._string.join("");
}

StringBuffer.prototype.clear = function() {
    this._string.length = 1;
}


// 通过Select ID得到数据
function $SelectText(obj) {
    try { return obj.options[obj.selectedIndex].text; } catch (ex) { return obj.options[0].text; }
}

// 通过Select ID得到数据
function $SelectValue(obj) {
    try { return obj.options[obj.selectedIndex].value; } catch (ex) { return obj.options[0].value; }
}
// 通过value选中
function $SelectSetValue(obj, value) {
    for (var i = obj.options.length - 1; i >= 0; i--) {
        if (obj[i].value == value) {
            obj.options[i].selected = true;
            break;
        }
    }
}



// 验证价格格式
function IsCapital(text) {
    if (!/^([1-9]\d+|[0-9])(\.\d\d?)?$/.test(text))
        return false;

    try { if (parseFloat(text) != text) return false; } catch (ex) { return false; }

    return true;
}

//检查是否为任意数（实数）  
function IsNumeric(strNumber) {
    var newPar = /^(-  ?\+)?\d+(\.\d+)?$/
    return newPar.test(strNumber);
}
//检查是否为正数  
function IsUnsignedNumeric(strNumber) {
    var newPar = /^\d+(\.\d+)?$/
    return newPar.test(strNumber);
}
//检查是否为整数  
function IsInteger(strInteger) {
    var newPar = /^(-  ?\+)?\d+$/
    return newPar.test(strInteger);
}
//检查是否为正整数  
function IsUnsignedInteger(strInteger) {
    var newPar = /^\d+$/
    return newPar.test(strInteger);
}

// 得到Json的长度
function GetJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
}
// 回车
function ClickButton(key, evt) {
    if (evt.keyCode == 13)
        document.getElementById(key).click();
}

function GetQueryStringEx(name) {
    var s = GetQueryString(name);
    if (s == null || s.length == 0) {
        var r = location.href;
        return r.substr(r.lastIndexOf("/") + 1, 6);
    }
    return s;
}