
function reloadpage(url){if(url){window.location.href=url;}else{window.location.reload();}}

//add by zhanghuangjie
var urlPrefix = 'http://61.147.125.143:8080/codesecurity-api/rest/';
var USER_PREFIX = urlPrefix + 'user/';
var TEAM_PREFIX = urlPrefix + "team/";

var MODE = {
    view : { code : 'view' , name : '查看'},
    add : { code : 'add' , name : '添加'},
    edit : { code : 'edit' , name : '修改'},
    delete : { code : 'delete' , name : '删除'}
}

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

/**
 * 通用的post
 * @param url
 * @param data
 * @returns {{}}
 */
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
                //有回传数据的回转
                if (parseData.data) {
                    result = parseData.data;
                } else {
                    //没有回传数据的返回true
                    result = true;
                }
            } else if (parseData.code === "990113") {
                window.location.href = "login.html";
            } else{
                console.log("请求出错" + url);
                result =  false;
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
    this.header = {};
    this.header.accessToken = getAccessToken();
    this.body = data;
}
DataTemplate.prototype = {
    constructor : DataTemplate   //强制声明构造函数，默认是Object
};

/**
 * 获取隐藏域的token
 * @returns {*|jQuery}
 */
function getAccessToken() {
    var storage = window.localStorage;
    var token = storage.getItem("token");
    var userId = storage.getItem("userId");

    return userId + '_10028_' + token;
}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [ o[this.name] ];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

/**
 * 表单提交
 * @param formId 表单id
 * @param url
 * @returns {{}}
 */
function submitForm(formId, url) {
    var params = $('#' + formId).serializeObject();
    var fullParams = new DataTemplate(params);
    var responseData = sendPost(url,fullParams);
    console.log(responseData);
    if (responseData) {
        alert('操作成功');
        return responseData;
    }
}

(function($,undefined){
    $.fn.popupSmallMenu = function(options) {
        var $currMenu = $(this),
            defaultOptions = {
                event : null,
                onClickItem : null
            },
            options = $.extend(defaultOptions,options);

        var _smallMenu = {
            popupSmallMenu : function() {
                this._bindItemClick();
                this._bindMenuEvent();
                this._showMenu();
                return $currMenu;
            },
            _bindMenuEvent : function() {
                var thiz = this;
                $currMenu.hover(function(){
                },function(){
                    thiz._unBindItemClick();
                    $currMenu.hide();
                });

                $currMenu.click(function(){
                    thiz._unBindItemClick();
                    $currMenu.hide();
                });
            },
            _showMenu : function() {
                if(!options.event) {
                    alert('请传入鼠标事件');
                }
                $currMenu.css({
                    top:options.event.clientY+"px",
                    left:options.event.clientX+"px",
                    display:"block"
                });
            },
            _bindItemClick : function() {
                $currMenu.find('li').each(function(index,obj){
                    var $li = $(obj);
                    var itemIden = $li.attr('class');
                    $li.bind('click',function(event){
                        event.stopPropagation();
                        if(options.onClickItem
                            && typeof options.onClickItem === 'function') {
                            options.onClickItem(itemIden);
                        }
                    });
                });
            }
            ,
            _unBindItemClick : function(){
                $currMenu.find('li').each(function(index,obj){
                    $(obj).unbind();
                });
            }
        };

        return _smallMenu.popupSmallMenu();
    }
})(jQuery);




