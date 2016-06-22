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
	var availableTags = [
		"ActionScript",
		"AppleScript",
		"Asp",
		"BASIC",
		"C",
		"C++",
		"Clojure",
		"COBOL",
		"ColdFusion",
		"Erlang",
		"Fortran",
		"Groovy",
		"Haskell",
		"Java",
		"JavaScript",
		"Lisp",
		"Perl",
		"PHP",
		"Python",
		"Ruby",
		"Scala",
		"Scheme",
		"Drupal Worpress",
		".Net"
	];
	var dataJson = '[ { "id": "Charadrius hiaticula", "label": "Common Ringed Plover", "value": "Common Ringed Plover" }, { "id": "Charadrius alexandrinus", "label": "Kentish Plover", "value": "Kentish Plover" }, { "id": "Emberiza citrinella", "label": "Yellowhammer", "value": "Yellowhammer" }, { "id": "Hirundo rustica", "label": "Barn Swallow", "value": "Barn Swallow" }, { "id": "Phylloscopus trochilus", "label": "Willow Warbler", "value": "Willow Warbler" }, { "id": "Pluvialis apricaria", "label": "European Golden Plover", "value": "European Golden Plover" }, { "id": "Poecile montanus", "label": "Willow Tit", "value": "Willow Tit" }, { "id": "Aegithalos caudatus", "label": "Long-tailed Tit", "value": "Long-tailed Tit" }, { "id": "Pluvialis squatarola", "label": "Grey Plover", "value": "Grey Plover" }, { "id": "Buteo rufinus", "label": "Long-legged Buzzard", "value": "Long-legged Buzzard" }, { "id": "Phylloscopus inornatus", "label": "Yellow-browed Warbler", "value": "Yellow-browed Warbler" }, { "id": "Larus michahellis", "label": "Yellow-legged Gull", "value": "Yellow-legged Gull" } ]';
	
	$( "#search1" ).smAutocomplete({
		source: availableTags,
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'array'
	});
	$( "#search2" ).smAutocomplete({
		source: availableTags,
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'array',
		animation: true
	});
	$( "#search3" ).smAutocomplete({
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'combobox'
	});
	$( "#search4" ).smAutocomplete({
		source: availableTags,
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'array',
		scrollable: true
	});
	$( "#search5" ).smAutocomplete({
		urlAjax: 'http://abc.com/',
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'json',
		remote: true
	});
	$( "#search6" ).smAutocomplete({
		urlAjax: 'http://abc.com/',
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'json',
		remote: true,
		multipleValue: true
	});
	$( "#search7" ).smAutocomplete({
		source: availableTags,
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'array',
		multipleValue: true,
		change:function(){
			console.log('abc');
		}
	});
	$('.tabs').smTabDemo();
});