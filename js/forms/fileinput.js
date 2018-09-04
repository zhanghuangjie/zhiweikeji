$(document).ready(function () {

filetext

$('input[type=file]').change(function(e){
				//get file name
				var fileName = $(this).val().split(/\\/).pop();
				//get file extension
				var fileExt = 'customfile-ext-' + fileName.split('.').pop().toLowerCase();
				//update the feedback
				filetext
					.text(fileName)
					.removeClass(filetext.data('fileExt') || '')
					.addClass(fileExt)
					.data('fileExt', fileExt) 
			})

var filetext = $('<span class="filetext" aria-hidden="true">选择上传文件...</span>').appendTo(".file-upload");

});