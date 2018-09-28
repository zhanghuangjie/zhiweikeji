/**
 * 上传文件类型 1：本地上传 2：远程上传
 * @type {{LOCAL: number, REMOTE: number}}
 */
var UPLOAD_TYPE = {
    LOCAL : 1,
    REMOTE : 2
};

function openFileDialog () {
    var accessToken = getAccessToken();
    var action = TASK_ADD_PREFIX + 'uploadfile';
    layer.open({
        title : "请选择文件",
        type: 1,
        skin: 'layui-layer-demo', //样式类名
        closeBtn: 1, //不显示关闭按钮
        btn : ['确认上传', '取消'],
        yes: function(index){
            var form = $("#fileForm");
            var file=$("#uploadFile").val();
            if(file === ""){
                layer.alert("请选择文件!",{icon:0,title:'错误'});
                return false;
            }
            form.ajaxSubmit(function (data) {
                var response= JSON.parse(data);
                if (response.code === "0") {
                    layer.msg("上传成功！服务器存储文件名=" + response.data.fileName, {time:2000});
                    $('#fileName').val(response.data.fileName);
                    $('#uploadType').val(UPLOAD_TYPE.LOCAL);
                    $('#fileDiv').show();
                    $('#remoteDiv').hide();
                    layer.close(index);
                } else {
                    layer.alert("上传失败！原因" + response.msg, {icon:2,title:'失败'});
                }
            });
        },
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: '<form id="fileForm" method="post" enctype="multipart/form-data" action="'+ action +'">' +
        '<input type="file" class="form-control" name="uploadFile" id="uploadFile" accept=".zip">' +
        '<input type="hidden" name="accesstoken" value="'+ accessToken +'">' +
        '</form>'
    });
}

function openRemoteDialog() {
    var lastData = {
        remoteType : $("#remoteType").val(),
        svnGitUrl : $("#svnGitUrl").val(),
        svnGitUsername : $("#svnGitUsername").val(),
        svnGitPwd : $("#svnGitPwd").val(),
        gitBranchname : $("#gitBranchname").val()
    }
    var content = template('remoteHtml', lastData);
    layer.open({
        title : "请设置远程代码仓库",
        area : ['600px','400px'],
        type: 1,
        skin: 'layui-layer-demo', //样式类名
        closeBtn: 1, //不显示关闭按钮
        btn : ['确认', '取消'],
        yes: function(index){
            $("#remoteType").val($("#pop_remoteType").val());
            $("#svnGitUrl").val($("#pop_svnGitUrl").val());
            $("#svnGitUsername").val($("#pop_svnGitUsername").val());
            $("#svnGitPwd").val($("#pop_svnGitPwd").val());
            $("#gitBranchname").val($("#pop_gitBranchname").val());

            $('#uploadType').val(UPLOAD_TYPE.REMOTE);
            $('#fileDiv').hide();
            $('#remoteDiv').show();
            layer.close(index);
        },
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: content
    });
}