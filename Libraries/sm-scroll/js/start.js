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

	// Render document
	var pluginName = 'smScroll',
		instance = $('<div>')[pluginName]().data(pluginName),
		options = $.fn[pluginName].defaults,
		optionList = $('#options').find('ul.options-list'),
		eventList = $('#events').find('ul.options-list'),
		methodList = $('#methods').find('ul.options-list'),
		optionsHtml = '',
		eventHtml = '',
		methodHtml = '';
		name;
	for (name in options) {
		if (typeof (options[name]) !== 'function') {
			optionsHtml += '<li><div class="option-header">';
			optionsHtml += '<a href="#" class="options-name"><span class="ico-arrow">&nbsp;</span><span>' + name + '</span></a>';
			optionsHtml += '<a class="options-type" href="#"><span>' + typeof (options[name]) + '</span></a>';
			optionsHtml += '<dl class="options-default"><dt>Default:</dt><dd>' + options[name] + '</dd></dl>';
			optionsHtml += '</div></li>';	
		} else {
			eventHtml += '<li><div class="option-header"><a href="#" class="options-name"><span class="ico-arrow">&nbsp;</span><span>' + name + '</span></a></div></li>';		
		}
	}
	for (name in instance) {
		if (typeof instance[name] === 'function') {
			methodHtml += '<li><div class="option-header"><a href="#" class="options-name"><span class="ico-arrow">&nbsp;</span><span>' + name + '</span></a></div></li>';		
		}
	}
	optionList.html(optionsHtml);
	eventList.html(eventHtml);
	methodList.html(methodHtml);
	
	$('.tabs').smTabDemo();
	
	$('.addMore').bind('click', function(){
		$(this).closest('.scroll-cont').append('<p>Trong mô hình một ngôi nhà số hiện đại, tất cả các thiết bị điện và điện tử trong nhà đều có thể được kết nối với nhau để tạo thành một hệ thống thiết bị khép kín. Trước đây, người dùng thường phải có mặt trong hệ thống đó thì mới có thể điều khiển được các thiết bị hoạt động theo ý muốn, thông qua một chiếc điều khiển chuyên dụng hoặc bộ xử lý trung tâm như PC, laptop kết nối Internet tại nhà.</p>');
		$('#smScroll8').smScroll('refresh');
	});

	$('#smScroll8').smScroll({
		scrollContent: '.scroll-cont',
		vScroller: '.v-dragger',
		scrollerAutoHeight: true,
		upButton: '.btn-up',
		downButton: '.btn-down',
		
		contentEase: 'easeOutCirc',
		contentEaseDuration: 1000,
		scrollerEase: 'easeOutCirc',
		scrollerEaseDuration: 1000
	});

	$('#smScroll1').smScroll({
		scrollContent: '.scroll-cont',
		vScroller: '.dragger',
		upButton: '.btn-up',
		downButton: '.btn-down',
		iScrollTouch: true
	});
	
	$('#smScroll2').smScroll({
		scrollContent: '.scroll-cont',
		vScroller: '.dragger',
		upButton: '.btn-up',
		downButton: '.btn-down',
		textSelect: true,
		
		contentEase: 'easeOutCirc',
		contentEaseDuration: 1000,
		scrollerEase: 'easeOutCirc',
		scrollerEaseDuration: 1000
	});
	$('#smScroll3').smScroll({
		scrollContent: '.scroll-cont',
		vScroller: '.dragger',
		textSelect: true
	});
	$('#smScroll9').smScroll({
		scrollType: '.scroll-cont',
		vScroller: '.dragger',
		textSelect: true,
		genScroller: true,
		scrollerContainerClass: 'scroll-bar scroll-height-1',
		scrollerClass: 'dragger v-dragger'
	});
	
	$('#smScroll4').smScroll({
		scrollType: 'both',
		scrollContent: '.scroll-cont',
		vScroller: '.v-dragger',
		hScroller: '.h-dragger',
		upButton: '.btn-up',
		downButton: '.btn-down',
		prevButton: '.btn-prev',
		nextButton: '.btn-next',
		textSelect: true,
		iScrollTouch: true,
		
		contentEase: 'easeOutCirc',
		contentEaseDuration: 1000,
		scrollerEase: 'easeOutCirc',
		scrollerEaseDuration: 1000,
		
		wheelStep: 20,
		holdDelay: 700,
		holdInterval: 33
	});
	setTimeout(function(){
		$('#smScroll5').smScroll({
			scrollType: 'horizontal',
			scrollContent: '.gallery',
			ulContent: true,
			hScroller: '.h-dragger',
			prevButton: '.btn-prev',
			nextButton: '.btn-next',
			iScrollTouch: true,
			
			autoHide: false,
			
			contentEase: 'easeOutCirc',
			contentEaseDuration: 500,
			keydownStep: 50
		});
		$('#smScroll10').smScroll({
			scrollType: 'horizontal',
			scrollContent: '.gallery',
			ulContent: true,
			hScroller: '.h-dragger',
			prevButton: '.btn-prev',
			nextButton: '.btn-next',
			
			scrollerAutoHide: false,
			
			contentEase: 'easeOutCirc',
			contentEaseDuration: 500
		});
		$('#smScroll6').smScroll({
			scrollType: 'horizontal',
			scrollContent: '.gallery',
			ulContent: true,
			hScroller: '.h-dragger',
			prevButton: '.btn-prev',
			nextButton: '.btn-next'
		});
		$('#smScroll7').smScroll({
			scrollType: 'horizontal',
			scrollContent: '.gallery',
			ulContent: true,
			hScroller: '.h-dragger',
			prevButton: '.btn-prev',
			nextButton: '.btn-next'
		});
	}, 500);
});