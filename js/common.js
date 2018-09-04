
function reloadpage(url){if(url){window.location.href=url;}else{window.location.reload();}}

//add by zhanghuangjie
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
