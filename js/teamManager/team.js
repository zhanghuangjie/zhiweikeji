var setting = {
    async: {
        enable: true,
        url: TEAM_PREFIX + 'query/teamanduser',
        contentType: "application/json",
        dataFilter :filter,
        type : "post",
        otherParam : getParams
    },
    data: {
        key: {
            title:"t"
        },
        simpleData: {
            enable:true,
            idKey: "teamOrUserId",
            pIdKey: "pid",
            rootPId: ""
        }
    },
    callback: {
        beforeClick: beforeClick,
        onClick: onClick,
        beforeAsync : beforeAsync,
        onRightClick: OnRightClick,
        beforeRemove : beforeRemove,
        onRemove : onRemove
    },
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        showLine: false,
        //showIcon: false,
        selectedMulti: false,
        dblClickExpand: false,
        addDiyDom : addDiyDom,
    }

};

function beforeRemove(treeId, treeNode) {
    zTree.selectNode(treeNode);
    return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}

function onRemove(e, treeId, treeNode) {
    var request = new DataTemplate({userId: treeNode.teamOrUserId});
    var getUserUrl = USER_PREFIX + 'delete';
    var result = sendPost(getUserUrl, request);
    if (result) {
        layer.alert("删除成功");
    }
}


var zTree;

function OnRightClick(event, treeId, treeNode) {
    zTree.selectNode(treeNode);
    if(treeNode) {
        if (treeNode.isParent) {
            $("#m_add_team").show();
            $("#m_edit_team").show();
            $("#m_add_user").show();
            $("#m_edit_user").hide();
            $("#m_del").hide();
        } else {
            $("#m_add_team").hide();
            $("#m_edit_team").hide();
            $("#m_add_user").hide();
            $("#m_edit_user").show();
            $("#m_del").show();
        }
    //弹出菜单
        $("#menu").popupSmallMenu({
            event : event,
            onClicfkItem  : function(item) {
            }
        });
    }
}



//自定义Dom
function addDiyDom(treeId, treeNode) {
    var spaceWidth = 10;
    var switchObj = $("#" + treeNode.tId + "_switch"),
        icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    if (treeNode.level >= 1) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}

function beforeClick(treeId, treeNode, clickFlag) {
    if (treeNode.level === 0 ) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.expandNode(treeNode);
        return false;
    }
    return true;
}
function onClick(event, treeId, treeNode, clickFlag) {
    if (treeNode.isParent) {
        showViewTeam();
    } else {
        showViewUser();
    }
}

function addHoverDom(treeId, treeNode) {

}
function removeHoverDom(treeId, treeNode) {

}

function getParams(treeId, treeNode) {
    return new DataTemplate({teamId:treeNode.teamOrUserId});
}
function beforeAsync(treeId, treeNode) {
    //团队才可以加载
    return treeNode.isParent === true;
}
function initRootNode(rootNode) {
    rootNode.teamId = 1;
    rootNode.teamOrUserId = 1;
    rootNode.name = rootNode.teamName;
    rootNode.isParent = true;
    rootNode.icon = '../img/icons/team/icon-team.png';
}

$(document).ready(function(){
    var initRequestData = new DataTemplate({teamId:1});
    var url = TEAM_PREFIX + 'query';
    var rootNode = sendPost(url,initRequestData);
    initRootNode(rootNode);
    var treeObj = $("#treeDemo");
    zTree = $.fn.zTree.init(treeObj, setting, rootNode);
    treeObj.addClass("showIcon");
    var initRightHtml = template('teamFormHtml', {
        mode : MODE.add,
        parentTeamId : 1,
        parentName : rootNode.name
    });
    $('#rightContent').html(initRightHtml);
});

/**
 * 转换name
 * @param nodes
 */
function parseNodes(nodes) {
    if (nodes) {
        for (var i in nodes) {
            nodes[i].name = nodes[i].teamOrUserName;
            if (nodes[i].type === "1") {
                nodes[i].isParent = true;
                nodes[i].icon = '../img/icons/team/icon-team.png';
            } else {
                nodes[i].icon = '../img/icons/team/man-user.png';
            }
        }
    }
    return nodes;
}

function filter(treeId, parentNode, responseData) {
    if (responseData.code === '0') {
        return parseNodes(responseData.data.datas);
    } else {
        return null;
    }
}

/**
 * 刷新当前节点
 */
function refreshNode() {
    /*根据 treeId 获取 zTree 对象*/
    var type = "refresh",
        silent = false,
        /*获取 zTree 当前被选中的节点数据集合*/
        nodes = zTree.getSelectedNodes();
    /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
    zTree.reAsyncChildNodes(nodes[0], type, silent);
}

/**
 * 刷新当前选择节点的父节点
 */
function refreshParentNode() {
    var type = "refresh",
        silent = false,
        nodes = zTree.getSelectedNodes();
    /*根据 zTree 的唯一标识 tId 快速获取节点 JSON 数据对象*/
    var parentNode = zTree.getNodeByTId(nodes[0].parentTId);
    /*选中指定节点*/
    zTree.selectNode(parentNode);
    zTree.reAsyncChildNodes(parentNode, type, silent);
}


function showAddTeam() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var showAddTeamHtml = template('teamFormHtml', {
        mode : MODE.add,
        parentTeamId : selectedNode.teamOrUserId,
        parentName : selectedNode.name
    });
    $('#rightContent').html(showAddTeamHtml);
    $("#menu").hide();
}

function addTeam() {
    var addTeamUrl = TEAM_PREFIX + 'add';
    submitForm('teamForm', addTeamUrl);
    refreshParentNode();

}

function showEditTeam() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var parent = selectedNode.getParentNode();
    var showEditTeamHtml = template('teamFormHtml', {
        mode : MODE.edit,
        parentTeamId : parent.teamOrUserId,
        parentName : parent.name,
        teamId : selectedNode.teamOrUserId,
        name : selectedNode.name
    });
    $('#rightContent').html(showEditTeamHtml);
    $("#menu").hide();
}

function editTeam() {
    var editTeamUrl = TEAM_PREFIX + 'modify';
    submitForm('teamForm', editTeamUrl);
    refreshParentNode();
}

function showViewTeam() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var parent = selectedNode.getParentNode();
    var showViewTeamHtml = template('teamFormHtml', {
        mode : MODE.view,
        parentTeamId : parent.teamOrUserId,
        parentName : parent.name,
        teamId : selectedNode.teamOrUserId,
        name : selectedNode.name
    });
    $('#rightContent').html(showViewTeamHtml);
    $("#menu").hide();
}

function showAddUser() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var showAddUserHtml = template('userFormHtml', {
        mode : MODE.add,
        //增加用户 当前被选中的节点为新增用户的父节点
        teamId : selectedNode.teamOrUserId,
        parentName : selectedNode.name
    });
    $('#rightContent').html(showAddUserHtml);
    $("#menu").hide();
}

function addUser() {
    var addUserUrl = USER_PREFIX + 'add';
    submitForm('userForm', addUserUrl);
    refreshNode();
}

function showEditUser() {
    var fullUserInfo = getFullUserInfo();
    var showEditUserHtml = template('userFormHtml', {
        mode : MODE.edit,
        teamId : fullUserInfo.teamId,
        userId : fullUserInfo.userId,
        userName : fullUserInfo.userName,
        userMail : fullUserInfo.userMail,
        userAccount : fullUserInfo.userAccount,
        userPassword : fullUserInfo.userPassword,
        note : fullUserInfo.note
    });
    console.log(fullUserInfo);
    $('#rightContent').html(showEditUserHtml);
    $("#menu").hide();
}

function editUser() {
    var editUserUrl = USER_PREFIX + 'modify';
    submitForm('userForm', editUserUrl);
    refreshNode();
}

function getFullUserInfo() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var teamId = selectedNode.pid;
    var request = new DataTemplate({userId: selectedNode.teamOrUserId});
    var getUserUrl = USER_PREFIX + 'query';
    var fullUserInfo = sendPost(getUserUrl, request);
    fullUserInfo.teamId = teamId;
    fullUserInfo.userId = selectedNode.teamOrUserId;
    return fullUserInfo;
}

function showViewUser() {
    var fullUserInfo = getFullUserInfo();
    var showViewUserHtml = template('userFormHtml', {
        mode : MODE.view,
        teamId : fullUserInfo.teamId,
        userName : fullUserInfo.userName,
        userMail : fullUserInfo.userMail,
        userAccount : fullUserInfo.userAccount,
        userPassword : fullUserInfo.userPassword,
        note : fullUserInfo.note
    });
    $('#rightContent').html(showViewUserHtml);
    $("#menu").hide();
}

/**
 * 右键菜单调用删除 zTree 的callback失效
 */
function removeUser() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var confirmNode = beforeRemove('treeDemo', selectedNode);
    if (confirmNode) {
        var request = new DataTemplate({userId: selectedNode.teamOrUserId});
        var getUserUrl = USER_PREFIX + 'delete';
        var result = sendPost(getUserUrl, request);
        if (result) {
            layer.alert("删除成功");
            refreshParentNode();
        }
    }
}
