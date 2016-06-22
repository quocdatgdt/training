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
jQuery(document).ready(function($) {
	// Render document
	var pluginName = 'smGallery',
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
	
	$('.contGallery-1').smGallery({				
		clsIconNext :'.down',
		clsIconPrev : '.up',
		clsContainerSlider:'.imgBig',
		clsContainerListThum : '.imgThumb',
		duration:500,		
		thumbShow: 4,
		vertical: true,
		clsActive: 'active',
		setInterval: false,
		animateType: 'silde',
		timerInterval: 3000
	});
	
	$('.contGallery-2').smGallery({		
		clsIconNext :'.next',
		clsIconPrev : '.pre',
		clsContainerSlider:'.imgBig',
		clsContainerListThum : '.imgThumb',
		duration:500,					
		thumbShow: 4,
		vertical: false,
		clsActive: 'active',
		setInterval: false,
		animateType: 'fade',
		timerInterval: 3000
	});
	
	$('.contGallery-3').smGallery({		
		clsIconNext :'.next',
		clsIconPrev : '.pre',
		clsContainerSlider:'.imgBig',
		clsContainerListThum : '.imgThumb',
		duration:500,					
		thumbShow: 4,
		vertical: false,
		showMessage: {
			messageClass: 'message',
			w: 730,
			h: 15,
			x: 0,
			y: 0,
			zOpacity: 0.5
		},
		clsActive: 'active',
		setInterval: false,
		animateType: 'silde',
		timerInterval: 3000
	});
	
	$('.contGallery-4').smGallery({
		clsIconNext :'.btnNext',
		clsIconPrev : '.btnPre',
		clsContainerSlider:'.imgBig',
		clsContainerListThum : '.imgThumb',
		duration:500,		
		thumbShow: 4,
		vertical: false,
		clsActive: 'active',
		setInterval: false,
		animateType: 'silde',
		timerInterval: 3000
	});
});