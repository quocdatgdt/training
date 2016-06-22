/**
 * Global variables and functions
 */
 var ProjectName = (function($, window, undefined){	 
	return {		
		init : function(){
			$('.uploader').smUploader({
				onMouseEnter: function(){
					$(this.element).addClass('active');					
				},
				onMouseLeave: function(){
					$(this.element).removeClass('active');
				},
				onCreate: function(container){					
					container.insertAfter($('#frm-upload-file'));
				},
				onBeforeSend: function(){
					// alert(10);
					// return false;
				},
				onComplete: function(response){
					response = $.parseJSON(response);					
					var html = '<li><span class="upload-content"><img src=' + response.path + ' width="30" height="30"/></span>'
								+ '<span class="upload-content"><span><span>' + response.Upload + '</span></span></span>'
								+ '<span class="upload-content"><span><span>' + Number(response.Size).toFixed(2) + ' KB</span></span></span>'
								+ '<span class="upload-content"><span><span>' + response.Type + '</span></span></span>'
								+ '<span class="upload-content"><span><span>' + response.path + '</span></span></span></li>';					
					
					
					$('.demo-file-upload').append(html);
					
				}
			});
			$('.demo-file-upload').css('width', 855);
			$('.tabs').smTabDemo();
		}
	};
})(jQuery, window);

/**
 * Website start here
 */
jQuery(document).ready(function($) {		
	ProjectName.init();
	
});