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
        onRightClick: OnRightClick
    },
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        showLine: false,
        //showIcon: false,
        selectedMulti: false,
        dblClickExpand: false,
        addDiyDom : addDiyDom
    }

};

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
}

function showEditTeam() {
    var selectedNode = zTree.getSelectedNodes()[0];
    var showEditTeamHtml = template('teamFormHtml', {
        mode : MODE.edit,
        parentTeamId : selectedNode.teamOrUserId,
        parentName : selectedNode.name
    });
    $('#rightContent').html(showEditTeamHtml);
    $("#menu").hide();
}

function editTeam() {
    var editTeamUrl = TEAM_PREFIX + 'modify';
    submitForm('teamForm', editTeamUrl);
}

function showAddUser() {
    var selectedNode = zTree.getSelectedNodes()[0];
    console.log(selectedNode);
    var showAddUserHtml = template('userFormHtml', {
        mode : MODE.add,
        teamId : selectedNode.teamOrUserId,
        parentName : selectedNode.name
    });
    $('#rightContent').html(showAddUserHtml);
    $("#menu").hide();
}

function addUser() {
    var addUserUrl = USER_PREFIX + 'add';
    //submitForm('teamForm', addUserUrl);
}
