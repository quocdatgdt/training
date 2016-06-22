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
    $('a').smPlugin();		
    $('a').smPlugin('publicMethod');
});