/**
 * Global variables and functions
 */
var ProjectName = (function($, window, undefined){	 
	
	function initAudio(){
		$('.sound-block').smAudio({
			
		});
	};
	
	return {		
		init: function(){
			initAudio();
		}
	};
})(jQuery, window);

/**
 * Website start here
 */
jQuery(document).ready(function($) {
	ProjectName.init();

	$('.tabs').smTabDemo();
	
});