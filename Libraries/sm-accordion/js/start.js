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
	var pluginName = 'smAccordion',
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
	
	$('#accordionGiftLelo').smAccordion({
		clsActive: 'on',
		clsDeactive: 'off',
		hashid: true
	});
	
	$('#accordion1').smAccordion({
		defaultid: 2, 		
		autodelay: 4000
	});
	
	$('#accordion3').smAccordion({					
		multiopen:[0,3],
		vertical:true
	});
	
	$('#accordionNested').smAccordion({
		defaultid:4
	});
	
    $('#accordionNestedChild').smAccordion({
		defaultid:1,
		nestedChil:true,
		vertical:true
	});
	
	$('#accordion4').smAccordion({
		defaultid:5,
		event: 'mouseover',
		vertical:true,	
	});
	
	$('#accordion5').smAccordion({
		defaultid:2,
		clsActive: 'on',
		clsDeactive: 'off',
		vertical:true,
	});
	
	$('#accordion7').smAccordion({
		defaultid:2,
		ajax:true,		
		vertical:true,
	});
});