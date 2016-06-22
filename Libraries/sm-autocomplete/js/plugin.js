/**
 * @name smAutocomplete
 * @description description
 * @version 1.0
 * @options
 *		source
 *		appendTo: default(body)
 *		activeClass
 *		autoFocus
 *		typeData: Array,Json,combobox
 *		remote: true/false
 *		scrollable: true/false
 *		multipleValue: true/false
 *		multipleRemote: true/false
 *		animation: true/false
 * @events
 *		change
 * @methods
 *		init
 *		change
 */
;(function($, window, undefined) {
	var pluginName = 'smAutocomplete';
	var privateVar = null;
	var privateMethod = function() {

	};

	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function() {
			var that = this;
			var element = that.element;
			var filterLayer = (that.options.animation) ? $('<ul class="autocomplete-filter animation '+ element.attr('id') +'"></ul>') : $('<ul class="autocomplete-filter '+ element.attr('id') +'"></ul>');
			var rowSelected  = null;
			var currentIndex = -1;
			var txtSearch = null;
			var pattern = [];
			var scrolltop = 0;
			var currIndx = 0;
			var cancelBtn = $('.cancel');
			if(that.options.typeData == 'array' && that.options.remote == false){
				pattern = that.options.source;
			}
			if(that.options.typeData == 'json' && that.options.remote == false){
				var obj = jQuery.parseJSON(that.options.source);
				for(var j = 0 ; j < obj.length ; j++){
					pattern.push(obj[j].label);
				}
			}
			if(that.options.typeData == 'combobox' && that.options.remote == false){
				var optEls = element.prev().find('option').not(':first');
				for(var j = 0 ; j < optEls.length ; j++){
					pattern.push(optEls.eq(j).val());
				}
			}
			if(that.options.autoFocus){
				element.focus();
			}
			
			filterLayer.appendTo($(that.options.appendTo)).css({
															'display':'none',
															'top':0,
															'left':0,
															'z-index':1
														});
			
			
			
			element.unbind('keyup.filter').bind('keyup.filter',function(e){
				if(e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13 && e.keyCode != 27){
					txtSearch = element.val();
					filterLayer.html('');
					if(that.options.remote == false){
						for(var i = 0 ; i < pattern.length ; i++){
							var patt = new RegExp(txtSearch.toUpperCase());
							if(patt.test(pattern[i].toUpperCase())){
								$('<li>' + pattern[i] + '</li>').appendTo(filterLayer);
							}
						}
						if(txtSearch != ''){
							if(that.options.animation){
								var filterHeight = filterLayer.css({'display':'block','position':'absolute'}).children().length * filterLayer.children().eq(0).outerHeight(true);
								filterLayer.css({'display':'none','height':0});
								
								if(that.options.scrollable == true){
									if(filterLayer.children().length > 5){
										filterLayer.css({
											'display':'block',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1,
											'overflow-y':'scroll'
										}).animate({'height':filterLayer.children().eq(0).outerHeight(true)*5},500);
									}
									else{
										filterLayer.css({
											'display':'block',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1,
											'overflow-y':'hidden'
										}).animate({'height':filterLayer.children().eq(0).outerHeight(true)*filterLayer.children().length},500);
									}
								}
								else{
									filterLayer.css({
										'display':'block',
										'top':element.position().top + element.outerHeight(true),
										'left':element.position().left,
										'z-index':1
									}).animate({'height':filterHeight},500);
								}
							}
							else{
								if(that.options.scrollable == true){
									if(filterLayer.children().length > 5){
										filterLayer.css({
											'display':'block',
											'position':'absolute',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1,										
											'overflow-y':'scroll'
										});
										filterLayer.css({										
											'height': (filterLayer.children().eq(0).outerHeight(true)*5)										
										});
									}
									else{
										filterLayer.css({
											'display':'block',
											'position':'absolute',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1,										
											'overflow-y':'hidden'
										});
										filterLayer.css({										
											'height': filterLayer.children().eq(0).outerHeight(true)*filterLayer.children().length										
										});
									}
									
								}
								else{
									filterLayer.css({
										'position':'absolute',
										'display':'block',
										'top':element.position().top + element.outerHeight(true),
										'left':element.position().left,
										'z-index':1
									});
								}
								
							}
						}
						else{
							if(that.options.animation){
								filterLayer.animate({'height':0},500,function(){ filterLayer.html(''); });
							}
							else{
								filterLayer.css('display','none');
								filterLayer.html('');
							}
						}
					}
					if(that.options.remote == true && that.options.urlAjax != null){
						$.ajax({
							url: that.options.urlAjax,
							type: 'POST',
							data: {
								'dataSearch': txtSearch
							},
							success: function(resp){
								if(that.options.typeData == 'array'){
									pattern = resp;
									for(var i = 0 ; i < pattern.length ; i++){
										var patt = new RegExp(txtSearch.toUpperCase());
										if(patt.test(pattern[i].toUpperCase())){
											$('<li>' + pattern[i] + '</li>').appendTo(filterLayer);
										}
									}
								}
								else if(that.options.typeData == 'json'){
									var obj = jQuery.parseJSON(resp);
									pattern = null;
									for(var m = 0 ; m < obj.length ; m++){
										pattern.push(obj[m].label);
									}
									for(var i = 0 ; i < pattern.length ; i++){
										var patt = new RegExp(txtSearch.toUpperCase());
										if(patt.test(pattern[i].toUpperCase())){
											$('<li>' + pattern[i] + '</li>').appendTo(filterLayer);
										}
									}
								}
								if(txtSearch != ''){
									if(that.options.animation){
										var filterHeight = filterLayer.css({'display':'block','position':'absolute'}).children().length * filterLayer.children().eq(0).outerHeight(true);
										filterLayer.css({'display':'none','height':0});
										filterLayer.css({
											'display':'block',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1
										}).animate({'height':filterHeight},500);
									}
									else{
										filterLayer.css({
											'position':'absolute',
											'display':'block',
											'top':element.position().top + element.outerHeight(true),
											'left':element.position().left,
											'z-index':1
										});
									}
								}
								else{
									if(that.options.animation){
										filterLayer.animate({'height':0},500,function(){ filterLayer.html(''); });
									}
									else{
										filterLayer.css('display','none');
										filterLayer.html('');
									}
								}
							}
						});
					}

					filterLayer.children().unbind('click').bind('click',function(){
						if(that.options.multipleValue == true){
							var spanEl = $('<span><span>'+$(this).html()+'</span><input type="hidden" name="search" value="'+$(this).html()+'"/><a class="cancel" title="cancel" href="#">x</a></span>');
							spanEl.insertBefore(element.parent());
							that.change('');
							element.focus();
							$('.tag-input .active').removeClass('active');
							currIndx = element.closest('.tag-input').find('> span').length;
							$('.cancel').unbind('click').bind('click',function(e){
								if(e) e.preventDefault();
								$(this).parent().remove();
								element.focus();
							});
						}
						else if(that.options.multipleValue == false){
							that.change($(this).html());
						}
						currentIndex = -1;
						if(that.options.animation){
							filterLayer.animate({'height':0},500,function(){ filterLayer.html(''); });
						}
						else{
							filterLayer.css('display','none');
						}
						return;
					});
					if(that.options.multipleValue == true && e.keyCode == 8){
						if(parseInt(element.css('width')) > 10){
							element.css({'width':parseInt(element.css('width')) - 10});
						}
					}
					if(that.options.multipleValue == true && e.keyCode == 37 && element.val().length == 0) {
						if(currIndx > 0){
							currIndx--;
							element.closest('.tag-input').find('.active').removeClass('active');
							element.closest('.tag-input').find('> span').eq(currIndx).addClass('active');
						}
					}
					if(that.options.multipleValue == true && e.keyCode == 39 && element.val().length == 0){
						if(currIndx >= 0 && currIndx < $('.tag-input > span').length - 1){
							currIndx++;
							element.closest('.tag-input').find('.active').removeClass('active');
							element.closest('.tag-input').find('> span').eq(currIndx).addClass('active');
						}
					}
					if(that.options.multipleValue == true && e.keyCode == 46){
						$('.tag-input .active').remove();
						currIndx = element.closest('.tag-input').find('> span').length;
					}
				}
			});
			element.unbind('keydown.filter').bind('keydown.filter',function(e){
				if(filterLayer.is(':visible')){
					if(that.options.multipleValue == true && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40){
						element.css({'width':parseInt(element.css('width')) + 10});
					}
					if(e.keyCode == 40){
						if(currentIndex == -1){
							currentIndex = 0;
							filterLayer.children().eq(currentIndex).addClass(that.options.activeClass);
							if(that.options.multipleValue){
								element.css({'width':filterLayer.children().eq(currentIndex).html().length * 10});
							}
							element.val(filterLayer.children().eq(currentIndex).html());
							if(that.options.scrollable == true){
								filterLayer.scrollTop(0);
							}
						}
						else if(currentIndex >= 0 && currentIndex < filterLayer.children().length){
							rowSelected  = filterLayer.find('.'+that.options.activeClass);
							currentIndex = rowSelected.index();
							filterLayer.children().removeClass(that.options.activeClass);
							currentIndex++;
							filterLayer.children().eq(currentIndex).addClass(that.options.activeClass);
							if(that.options.multipleValue){
								element.css({'width':filterLayer.children().eq(currentIndex).html().length * 10});
							}
							element.val(filterLayer.children().eq(currentIndex).html());
							if(currentIndex == filterLayer.children().length){
								currentIndex = -1;
								filterLayer.children().removeClass(that.options.activeClass);
								if(that.options.multipleValue){
									element.css({'width':txtSearch.length * 10});
								}
								element.val(txtSearch);
							}
							if(that.options.scrollable == true){
								scrollTop = filterLayer.scrollTop() + filterLayer.children().eq(currentIndex).outerHeight(true);
								filterLayer.scrollTop(scrollTop);
							}
						}
					}
					if(e.keyCode == 38){
						if(currentIndex == -1){
							currentIndex = filterLayer.children().length - 1;
							filterLayer.children().eq(currentIndex).addClass(that.options.activeClass);
							if(that.options.multipleValue){
								element.css({'width':filterLayer.children().eq(currentIndex).html().length * 10});
							}
							element.val(filterLayer.children().eq(currentIndex).html());
							if(that.options.scrollable == true){
								filterLayer.scrollTop(filterLayer.children().length * filterLayer.outerHeight(true));
							}
						}
						else if(currentIndex > 0 &&currentIndex < filterLayer.children().length){
							rowSelected  = filterLayer.find('.'+that.options.activeClass);
							currentIndex = rowSelected.index();
							filterLayer.children().removeClass(that.options.activeClass);
							currentIndex--;
							filterLayer.children().eq(currentIndex).addClass(that.options.activeClass);
							if(that.options.multipleValue){
								element.css({'width':filterLayer.children().eq(currentIndex).html().length * 10});
							}
							element.val(filterLayer.children().eq(currentIndex).html());
							if(that.options.scrollable == true){
								scrollTop = filterLayer.scrollTop() - filterLayer.children().eq(currentIndex).outerHeight(true);
								filterLayer.scrollTop(scrollTop);
							}
						}
						else{
							currentIndex = -1;
							filterLayer.children().removeClass(that.options.activeClass);
							if(that.options.multipleValue){
								element.css({'width':txtSearch.length * 10});
							}
							element.val(txtSearch);
						}
					}
					if(e.keyCode == 13){
						if(that.options.multipleValue == false){
							if(currentIndex == -1){
								element.val(txtSearch);
							}
							else{
								that.change(filterLayer.children().eq(currentIndex).html());
							}
						}
						else if(that.options.multipleValue == true){
							element.css('width',10);
							if(currentIndex == -1){
								var spanEl = $('<span><span>'+txtSearch+'</span><input type="hidden" name="search" value="'+txtSearch+'"/><a class="cancel" title="cancel" href="#">x</a></span>');
							}
							else{
								var spanEl = $('<span><span>'+filterLayer.children().eq(currentIndex).html()+'</span><input type="hidden" name="search" value="'+filterLayer.children().eq(currentIndex).html()+'"/><a class="cancel" title="cancel" href="#">x</a></span>');
							}
							spanEl.insertBefore(element.parent());
							that.change('');
							element.focus();
							$('.tag-input .active').removeClass('active');
							currIndx = element.closest('.tag-input').find('> span').length;
							$('.cancel').unbind('click').bind('click',function(e){
								if(e) e.preventDefault();
								$(this).parent().remove();
								element.focus();
							});
						}
						currentIndex = -1;
						if(that.options.animation){
							filterLayer.animate({'height':0},500,function(){ filterLayer.html(''); });
						}
						else{
							filterLayer.css('display','none');
						}
						return;
					}
					if(e.keyCode == 27){
						if(that.options.multipleValue == true){
							element.val('');
							element.css('width',10);
						}
						if(that.options.animation){
							filterLayer.animate({'height':0},500,function(){ filterLayer.html(''); });
						}
						else{
							filterLayer.css('display','none');
						}
					}
				}
			});
			$(document).unbind('click.layer').bind('click.layer',function(e){
				var layerFilters = $('.autocomplete-filter').not($('.animation'));
				var layerAnimates = $('.animation');
				layerFilters.each(function(indx){
					$(this).css('display','none');
				});
				layerAnimates.each(function(indx){
					$(this).animate({'height':0},500,function(){ $(this).html(''); });
				});
			});
			$('.tag-input').each(function(index){
				$(this).unbind('click').bind('click',function(e){
					$(this).find('.tag-inner input').focus();
				});
			});
		},
		change:function(value){
			var that = this;
			that.element.val(value);
			$.isFunction(that.options.change) && that.options.change.call(that.element);
		}
	};

	$.fn[pluginName] = function(options, params) {
		return this.each(function() {
			var instance = $.data(this, pluginName);
			if (!instance) {
				$.data(this, pluginName, new Plugin(this, options));
			} else if (instance[options]) {
				instance[options](params);
			} else {
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};

	$.fn[pluginName].defaults = {
		source: null,
		urlAjax: null,
		appendTo: 'body',
		autoFocus: true,
		activeClass: 'active',
		typeData: 'array',
		remote: false,
		scrollable: false,
		multipleValue: false,
		multipleRemote: false,
		animation: false,
		change: function(){}
	};
}(jQuery, window));


/**
 * @name smTabs
 * @description description
 * @version 1.0
 * @options
 *		option
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
;(function($, window, undefined) {
	var pluginName = 'smTabDemo';
	
	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function() {
			var options = this.options,
				curTab = this.element.find('.current'),
				curContent = $('.' + options.contentClass + '.current');
			this.element.delegate('li', 'click.' + pluginName, function() {
				var clicked = $(this),
					content = $(clicked.children().attr('href'));
				if (curTab.length) {
					curTab.removeClass('current');
					curTab = clicked.addClass('current');
				}
				if (curContent.length) {
					curContent.removeClass('current');
				}
				if (content.length) {
					curContent = content.addClass('current');
				}
				return false;
			});
		}
	};

	$.fn[pluginName] = function(options, params) {
		return this.each(function() {
			var instance = $.data(this, pluginName);
			if (!instance) {
				$.data(this, pluginName, new Plugin(this, options));
			} else if (instance[options]) {
				instance[options](params);
			} else {
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};

	$.fn[pluginName].defaults = {
		contentClass: 'tabs-content'
	};
}(jQuery, window));