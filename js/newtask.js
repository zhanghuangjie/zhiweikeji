
//文件上传

	$("#submit").click(function(){
		
		var title =$("#title").val();
		if(!title){ $.sticky('<b>提醒.</b><br><br><p>请输入项目名称.</p>');return false;}
		
		var team=$("#team").val();
		if(!team){$.sticky('<b>提醒.</b><br><br><p>请选择项目团队.</p>');return false;}
		var sdk= new Array();
		 $.each($('.jiekou:checkbox'),function(){
                if(this.checked){
                   sdk.push($(this).val());
                }
            });
		if(!sdk){$.sticky('<b>提醒.</b><br><br><p>请选择接口.</p>');return false;}
		 var strsdk=sdk.join(',');
		
			//sdk document.write(jiekou)
		var send= new Array();
		 $.each($('.sendbox:checkbox'),function(){
                if(this.checked){
                   send.push($(this).val());
                }
            });
		 var strsend=send.join(',');
		var ok= new Array();
		 $.each($('.okbox:checkbox'),function(){
                if(this.checked){
                   ok.push($(this).val());
                }
            });
		 var strok=ok.join(',');
		var err= new Array();
		 $.each($('.errbox:checkbox'),function(){
                if(this.checked){
                   err.push($(this).val());
                }
            });
			var strerr=err.join(',');
	
		
		var pos=$('input:radio[name="pos"]:checked').val();
            if(pos==null){
              $.sticky('<b>提醒.</b><br><br><p>请选择作业设置.</p>');return false;
            }
        var sendemail=$("#sendemail").val();
		var erremail=$("#erremail").val();
		var okemail=$("#okemail").val();
		var bag=$("#bag").val();
		var doc=$("#doc").val();
		var preset=$("#preset").val();
		var source=$("#filesrc").attr("source");
		var psdata="act=set&title="+title+"&team="+team+"&sdk="+strsdk+"&send="+strsend+"&ok="+strok+"&err="+strerr+"&doc="+doc+"&preset="+preset+"&bag="+bag+"&pos="+pos+"&sendemail="+sendemail+"&erremail="+erremail+"&okemail="+okemail+"&file="+$("#filesrc").val()+"&size="+$("#filesrc").attr("size")+"&source="+source;
		
		$.ajax({
						type: 'POST',
						url: "set/newtask.php", 
						data: psdata,
						success: function(msg) {
					
							alert("任务提交成功");
							reloadpage();
						}
					});
		
		});




 $(function () {
	 
	 		$("#voucher").on('focus',function(){
               if($("#postmode").val()==1001){
				   $( "#modal-svn" ).dialog( "open" );
				   return false;
				   }else if($("#postmode").val()==1002){
					   
					   }else{
						   alert("请选择正确的获取方式！")
						   }
            });
			$("#svnselect").change(function(){
				if($(this).val()=='-1'){
					$(".newsvnhide").show();
					}else if($(this).val()>0){
						$(".newsvnhide").hide();
						}
				});
            $("#upload").click(function () {
				
				
                ajaxFileUpload();
            })
        })
		
 function ajaxFileUpload() {
	
	   if (zipcheck()) { //自己添加的文件后缀名的验证
            $.ajaxFileUpload
            (
                {
                    url: 'set/upload.php', //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'zipupload', //文件上传域的ID
                    dataType: 'JSON', //返回值类型 一般设置为json
                    success: function (data, status)  //服务器成功响应处理函数
                    {
						data=JSON.parse(data);
						
						$("#filesrc").val(data.path);
						
						$("#filesrc").attr("size",data.size);
						$("#filesrc").attr("source",data.source);
						alert(data.info);
						
                        if (typeof (data.error) != 'undefined') {
                            if (data.error != '') {
                                alert(data.error);
                            } else {
                                alert(data.msg);
                            }
                        }
                    },
                    error: function (data, status, e)//服务器响应失败处理函数
                    {
                        alert(e);
                    }
                }
            )}
            return false;
        }
 function zipcheck(feid) { //自己添加的文件后缀名的验证
        var zip = document.getElementById('zipupload');
        return /.(zip|ZIP)$/.test(zip.value)?true:(function() {
            alert("上传文件格式不正确，必须为zip文件！");
            return false;
        })();
    }
$(".newsvnhide").hide();

$("#svnonsave").click(function(){
	if($("#svnselect").val()==-1){
		
		var svntitle=$("#svntitle").val();
	var svnzhanghao=$("#svnzhanghao").val();
	var svnmima=$("#svnmima").val();
	var svndir=$("#svndir").val();
	if(!svntitle){alert("请输入保存简称"); return false;}
	if(!svnzhanghao){alert("请输入svn帐号");return false;}
	if(!svnmima){alert("请输入svn密码");return false;}
	if(!svndir){alert("请输入svn获取地址");return false;}
	var psdata="act=save&mode=SVN&svntitle="+svntitle+"&svnzhanghao="+svnzhanghao+"&svnmima="+svnmima+"&svndir="+svndir;
	
		$.ajax({
						type: 'POST',
						url: "set/savevoucher.php", 
						data: psdata,
						success: function(msg) {
					
					if(msg>0){
							alert("保存成功");
							$("#voucher").val("SVN : "+svntitle);
							$("#voucher").attr("source",msg);
						}else{
							alert(msg);
							}
						}
						
							
						
					});
		}else{
			
			$("#voucher").val("SVN : "+$("#svnselect").find("option:selected").text());
			$("#voucher").attr("source",$("#svnselect").find("option:selected").val());
			
			}
	});
$("#svnok").click();

$("#putbotton").click(function(){
	var postmode=$("#postmode").val();
	var voucher=$("#voucher").attr("source");
	
	$.ajax({
						type: 'POST',
						url: "set/getfiles.php", 
						data: "act=put&postmode="+postmode+"&voucher="+voucher,
						success: function(data) {
							
							data=JSON.parse(data);
								if(data.code>0){
									$("#filesrc").attr("source",data.source);
									$("#filesrc").val(data.msg);
								$("#filesrc").attr("size","");
								alert("保存成功")
									}else{
										alert(data.msg);
										}
						
							
						}
					});
	
	});
	$(".jiekou").change(function(){
		if(this.checked){
		$.ajax({
						type: 'POST',
						url: "get/showmod.php", 
						data: "act=show&mode="+$(this).val(),
						success: function(data) {
							
							data=JSON.parse(data);
								if(data.code>0){
									//alert(data.views);
									$("#mod"+data.id).html(data.html);
									}else{
										
										}
						
							
						}
					});
		}else{
			$("#mod"+$(this).val()).html("");
			}
		});
		$(".poscl").change(function(){
			if($(this).val()==2){
				$("#modclock").show();
				
				}else{
					$("#modclock").hide();
					
					}
			});