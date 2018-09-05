
function reloadpage(url){if(url){window.location.href=url;}else{window.location.reload();}}

//add by zhanghuangjie
var urlPrefix = 'http://61.147.125.143:8080/codesecurity-api/rest/';
var TEAM_PREFIX = urlPrefix + "team/";
/**
 * 封装jquery load页面方法
 * @param containerId 载入的容器id (位置)
 * @param url html路径
 * @param postData
 * @param callback
 */
function loadPage(containerId, url, postData, callback) {
    $('#'+containerId).load(url, postData, callback);
}

function sendPost(url,data) {
    var result ={};
    $.ajax({
        url:url,
        data:JSON.stringify(data),
        type:"POST",
        contentType:"application/json;charset=utf-8",
        async:false,
        success : function (data) {
            var parseData= JSON.parse(data);
            if(parseData.code === "0"){
                result = parseData.data;
            } else {
                console.log("请求出错" + url);
            }
        }
    });
    return result;
}

/**
 * 定义请求模板
 * @param data
 * @constructor
 */
function DataTemplate(data) {
    this.header={};
    this.header.accessToken= getAccessToken();
    this.body=data;
}
DataTemplate.prototype = {
    constructor: DataTemplate   //强制声明构造函数，默认是Object
};

function getAccessToken() {
    return $('#'+'accessToken').val();
}

