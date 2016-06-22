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
	$('.tabs').smTabDemo();
	
	$('#layer-1').smLayer({
		position: [100, 200],
		animation: true,
		autoOpen: false,
		removeOnClose: false,
		closeButtons: '.lnk-close',
		overlay: 'sm-overlay transparent',
		duration: 400,
		easing: 'linear',
		zIndex: 1000,
		open: function() {
			console.log('Layer #1 opened');
		},
		close: function() {
			console.log('Layer #1 closed');
		}
	});

	$('#layer-2').smLayer({
		position: 'center',
		animation: true,
		autoOpen: false,
		removeOnClose: false,
		closeButtons: '.lnk-close',
		overlay: 'sm-overlay',
		duration: 400,
		easing: 'linear',
		zIndex: 1002
	});

	$('#show-layer').click(function() {
		$('#layer-1').smLayer('open');
		return false;
	});

	$('#show-modal').click(function() {
		$('#layer-2').smLayer('open', function() {
			console.log('Layer #2 opened');
		});
		return false;
	});

	$('#layer-1').find('.show-layer').click(function() {
		$('#layer-2').smLayer('open', function() {
			console.log('Layer #2 opened');
		});
		return false;
	});
});

