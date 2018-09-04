

$(function(){
	
	$(".madd").click(function(){
		var manage=$(this).attr("manage");
	
	$.ajax({
						type: 'POST',
						url: "get/manage.php", 
						data: "act=madd&manage="+manage,
						success: function(msg) {
							if(msg==-1){
								$.sticky('<b>错误：</b><br><br><p>信息错误！</p>');
								return false;
								}
							data=JSON.parse(msg);
						$("#itemtitle").html(data.name+"=>添加分管");
						$("#item").val(data.id);
						}
					});
		
		});
	$(".mdel").click(function(){
		var manage=$(this).attr("manage");
		$.ajax({
			
			type: 'POST',
						url: "get/manage.php", 
						data: "act=mdel&manage="+manage,
						success: function(msg) {
							if(msg==-1){
								$.sticky('<b>错误：</b><br><br><p>信息错误！</p>');
								return false;
								}else if(msg==0){
									$.sticky('<b>错误：</b><br><br><p>该管理还不能删除！</p>');
									return false;
									}else{
										$.sticky('<b>提醒：</b><br><br><p>删除成功！</p>');
										reloadpage();
										return false;
										}
							
						}
			
			
			});
		});
	
	$(".medit").click(function(){
		var manage=$(this).attr("manage");
		$.ajax({
			
			type: 'POST',
						url: "get/manage.php", 
						data: "act=medit&manage="+manage,
						success: function(msg) {
							if(msg==-1){
								$.sticky('<b>错误：</b><br><br><p>信息错误！</p>');
								return false;
								}
							data=JSON.parse(msg);
							
						$("#itemtitle").html(data.name+"=>修改");
						$("#name").val(data.name);
						$("#email").val(data.email);
						$("#zhanghao").val(data.zhanghao);
						$("#mima").val(data.mima);
						$("#item").val(data.item);
						$("#content").val(data.shuoming);
						$("#id").val(data.id);
						}
			
			
			});
		
		});
	
	});