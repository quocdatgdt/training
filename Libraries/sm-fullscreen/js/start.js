/**
 * Website start here
 */
var fs;
var callBackAfterLoading = function(){


	fs = 
	jQuery('#wrap-gallery').smFullscreenSlider({
		// onBeforeInit: function(){

		// },
		onAfterSlide: function(){
			Cufon.replace(jQuery('.font-type-3'), {fontFamily: 'Sackers Gothic Std',hover: true});	
		}
	});

	setTimeout(function(){
		$('.loading-page').css({
			display: 'none'
		});
	},200);
};

var totalCufon = 0;
var countCufon = 0;
var countCufonLoading = function(){
	countCufon++;
	if (countCufon == totalCufon){
		callBackAfterLoading();
	}
};

jQuery(document).ready(function($) {
	var typeCufon = new Array();
	typeCufon[0] = jQuery('.font-type-1, #nav ul li ul a,.frm-login .option-layer li');
	typeCufon[1] = jQuery('.font-type-2');
	typeCufon[2] = jQuery('.font-type-3');
	typeCufon[3] = jQuery('#footer ul li a, .header-sitemap li a');

	for (var i = 0; i < typeCufon.length; i++){
		totalCufon +=  typeCufon[i].length;
	}

	Cufon.replace(typeCufon[0], {fontFamily: 'Mrs Eaves OT',hover: true, onAfterReplace: function(){
		countCufonLoading();
	}});	

	Cufon.replace(typeCufon[1], {fontFamily: 'P22 Cezanne Pro',hover: true, onAfterReplace: function(){
		countCufonLoading();
	}});

	Cufon.replace(typeCufon[2], {fontFamily: 'Sackers Gothic Std',hover: true, onAfterReplace: function(){
		countCufonLoading();
	}});

	Cufon.replace(typeCufon[3], {fontFamily: 'Myriad Pro',hover: true, onAfterReplace: function(){
		countCufonLoading();
	}});	
});