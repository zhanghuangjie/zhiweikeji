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
        /*onRightClick: OnRightClick*/
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

var zTree,rMenu;

/*function OnRightClick(event, treeId, treeNode) {
    zTree.selectNode(treeNode);
    showRMenu(treeNode.isParent, event.clientX, event.clientY);
}*/

/*function showRMenu(isParent, x, y) {
    $("#rMenu ul").show();
    if (isParent) {
        $("#m_del").hide();
        $("#m_edit_user").hide();
    } else {
        $("#m_add_team").hide();
        $("#m_edit_team").hide();
    }

    y += document.body.scrollTop;
    x += document.body.scrollLeft;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});
    $("body").bind("mousedown", onBodyMouseDown);
}*/
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
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
    rMenu = $("#rMenu");
    $('.context').contextmenu();
    var initRightHtml = template('teamFormHtml', {
        mode : MODE.add,
        parentTeamId : 1
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

function addTeam() {
    var addTeamUrl = TEAM_PREFIX + 'add';
    submitForm('teamForm', addTeamUrl)
}