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
(function($){
	$(document).ready(function(){
		var cmbDate1TextArray = $('option', '#cmb-date1').map(function() {
			return $(this).text();
		});
		var cmbDate1ValueArray = $('option', '#cmb-date1').map(function( ) {
			return $(this).attr('value');
		});
		var cmbDate3TextArray = $('option', '#cmb-date3').map(function() {
			return $(this).text();
		});
		var cmbDate3ValueArray = $('option', '#cmb-date3').map(function( ) {
			return $(this).attr('value');
		});	
		var cmbDate5TextArray = $('option', '#cmb-date5').map(function() {
			return $(this).text();
		});
		var cmbDate5ValueArray = $('option', '#cmb-date5').map(function( ) {
			return $(this).attr('value');
		});	
		
		$('.tabs').smTabDemo();
		// $('select').smSelect();	
		$('#cmb-date1').smSelect({
			liTemplate: {
				'template': '<li value="{value}"><img alt="{text}" src="{image}"/>{text}</li>',
				'source': {
					'text': cmbDate1TextArray,
					'value': cmbDate1ValueArray,
					'image': [
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg'
					]
				}				
			},
			generateHandler: false,
			handlerClass: 'type-combobox',
			height: 200,
			animation: true,
			initClass: 'dropdown-list',			
			activeClass: 'active',
			hoverClass: 'hover',
			disableClass: 'disable',
			nativeMenu: false,
			duration: 500,
			labelOption: '---labelOption---',
			onChange: function(){
				console.log('change #1');
			},
			onSelect: function(index){
				console.log('select #1', 'ban dang chon index thu ' + index);
			},
			onBeforeOpen: function(){			
				console.log('beforeOpen #1', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onAfterOpen: function(){			
				console.log('afterOpen #1', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onBeforeClose: function(){
				console.log('beforeClose #1');
			},			
			onAfterClose: function(){
				console.log('afterClose #1');
			}			
		});
		$('#cmb-date2').smSelect({
			liTemplate: {
				'template': '<li value="{value}"><img alt="{text}" src="{image}"/>{text}</li>',
				'source': {
					'text': [
						'France',
						'English',
						'German',
						'Japan'
					],
					'value': [
						'1',
						'2',
						'3',
						'4'
					],
					'image': [
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-ger.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-jp.jpg'
					]
				}				
			},		
			nativeMenu: true,
			onChange: function(){
				console.log('change #2');
			},
			onSelect: function(index){
				console.log('select #2', 'ban dang chon index thu ' + index);
			},
			onBeforeOpen: function(){			
				console.log('beforeOpen #2', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onAfterOpen: function(){			
				console.log('afterOpen #2', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onBeforeClose: function(){
				console.log('beforeClose #2');
			},			
			onAfterClose: function(){
				console.log('afterClose #2');
			}		
		});
		$('#cmb-date3').smSelect({
			liTemplate: {
				'template': '<li value="{value}">{text}</li>',
				'source': {
					'text': cmbDate3TextArray,
					'value': cmbDate3ValueArray
				}				
			},
			generateHandler: false,
			handlerClass: 'type-combobox',
			height: 150,
			animation: false,
			initClass: 'dropdown-list',			
			activeClass: 'active',
			hoverClass: 'hover',			
			disableClass: 'disable',
			nativeMenu: false,
			labelOption: false,
			onChange: function(){
				console.log('change #3');
			},
			onSelect: function(index){
				console.log('select #3', 'ban dang chon index thu ' + index);
			},
			onBeforeOpen: function(){			
				console.log('beforeOpen #3', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onAfterOpen: function(){			
				console.log('afterOpen #3', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onBeforeClose: function(){
				console.log('beforeClose #3');
			},			
			onAfterClose: function(){
				console.log('afterClose #3');
			}			
		});		
		$('#cmb-date4').smSelect({
			liTemplate: {
				'template': '<li value="{value}"><img alt="{text}" src="{image}"/>{text}</li>',
				'source': {
					'text': [
						'France',
						'English',
						'German',
						'Japan'
					],
					'value': [
						'1',
						'2',
						'3',
						'4'
					],
					'image': [
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg'
					]
				}				
			},
			generateHandler: false,
			handlerClass: 'type-combobox',
			labelOption: false,
			onChange: function(){
				console.log('change #4');
			},
			onSelect: function(index){
				console.log('select #4', 'ban dang chon index thu ' + index);
			},
			onBeforeOpen: function(){			
				console.log('beforeOpen #4', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onAfterOpen: function(){			
				console.log('afterOpen #4', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onBeforeClose: function(){
				console.log('beforeClose #4');
			},			
			onAfterClose: function(){
				console.log('afterClose #4');
			}				
		})
		.smSelect('update', {
			option: '<option value="">--Select option--</option><option value="10">Oct 2012</option><option value="11">Nov 2012</option><option value="12">Dec 2012</option>',
			liTemplate: {
				'template': '<li value="{value}"><img alt="{text}" src="{image}"/>{text}</li>',
				'source': {
					'text': [
						'France',
						'English',
						'German',
						'Japan'
					],
					'value': [
						'1',
						'2',
						'3',
						'4'
					],
					'image': [
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-fr.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-en.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-ger.jpg',
						'http://dxo.local.sutrix.com/sites/all/themes/dxo/images/icon-flag-jp.jpg'
					]
				}				
			}
		});
		$('#cmb-date5').smSelect({
			liTemplate: {
				'template': '<li value="{value}">{text}</li>',
				'source': {
					'text': cmbDate5TextArray,
					'value': cmbDate5ValueArray
				}				
			},
			generateHandler: true,
			labelOption: false,
			onChange: function(){
				console.log('change #demo');		
			},
			onSelect: function(index){
				console.log('select #demo', 'ban dang chon index thu ' + index);
				if(index == 1){
					var cmbDate1 = $('#cmb-date1').data('smSelect');
					$('#cmb-date1').smSelect('open');
				}
				if(index == 2){
					$('#cmb-date1').smSelect('close');
				}
				if(index == 3){
					$('#cmb-date1').smSelect('disable', true);
				}
				if(index == 4){
					$('#cmb-date1').smSelect('disable', false);
				}
				if(index == 5){
					$('#cmb-date1').smSelect('reset', function(){
						console.log('reset Callback #1');
					});
				}
				if(index == 6){
					$('#cmb-date1').smSelect('select', 3);
				}
				if(index == 7){
					$('#cmb-date3').smSelect('update', {
						option: '<option value="">--Select option--</option><option value="1">Test update 1</option><option value="2">Test update 2</option><option value="3">Test update 3</option>',
						liTemplate: '<li value="{value}"><a href="#">{text}</a></li>'							
					});
				}
				if(index == 8){
					$('#cmb-date4').smSelect('destroy');
				}
			},
			onBeforeOpen: function(){			
				console.log('beforeOpen #demo', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onAfterOpen: function(){			
				console.log('afterOpen #demo', this.originDL, this.listDL, this.outputDL, this.handlerDL);
			},
			onBeforeClose: function(){
				console.log('beforeClose #demo');
			},			
			onAfterClose: function(){
				console.log('afterClose #demo');
			}		
		});
	});	
})(jQuery);