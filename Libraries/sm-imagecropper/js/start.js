/**
 * Global variables and functions
 */
 var ProjectName = (function($, window, undefined){	 
	var privateVar = 1;
	
	function privateMethod1(){

	};
	
	return {		
		publicVar: 1,
		publicObj: {
			var1: 1,
			var2: 2
		},
		publicMethod1: privateMethod1
	};
})(jQuery, window);

/**
 * Website start here
 */
jQuery(document).ready(function($){
	var d = $('div.right:eq(3)');
	$('img:eq(3)').smImgCropper({
		tracking: true,
		appendTrackingTo: d
	});
	var collection = $('img:lt(3)').smImgCropper();
	collection.eq(1).smImgCropper('cropImage',[50,40,200,200]);
	$('#random').length && $('#random').bind('click', function(e){
		e.preventDefault();
		collection.eq(2).smImgCropper('cropRandom');
	});
	$('#cropImg').bind('click', function(){
	
	});
	$('#destroy').bind('click', function(){
		collection.eq(0).smImgCropper('destroy');
	});
	$('.tabs').find('li').bind('click', function(e){
		e.preventDefault();
		var currentTab = $('.tabs').find('.current'),
			currentSection = $('section.tabs-content').filter('.current');
		if(!$(this).hasClass('current')){
			currentTab.removeClass('current');
			$(this).addClass('current');
			currentSection.removeClass('current');
			$('section.tabs-content').eq($(this).index()).addClass('current');
		}
	});
	
});