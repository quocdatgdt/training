/***********************************************************/
/***********************************************************/
/***********************************************************/
//BEGIN SMSELECT LIBRARY
/**
 * @name smPlugin
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
;(function($, window, undefined){
	var pluginName = 'smSelect';
	
	function createlistDL(){
		var that = this,
			options = that.options,
			source = that.liTemplate.source,
			originDL = that.originDL,
			liTemplate = null,
			regExp = null,
			ul = '',
			li = '',
			allOption = originDL.find('option'),
			startIndex = 0,
			originDLName = originDL.attr('name');
		if(!$('#' + originDLName + '-list').length){
			if(allOption.eq(0).is('.labelOption')){
				startIndex = 1;
				li += '<li>' + allOption.eq(0).text() + '</li>';
			}
			for(var i = 0; i < allOption.length - startIndex; i++){
				liTemplate = that.liTemplate.template;
				$.each(source, function(key, value){
					regExp = new RegExp('\{' + key + '\}', 'gi');
					liTemplate = liTemplate.replace(regExp, value[i]);				
				});				
				li += liTemplate;
			}
			ul = '<ul>' + li + '</ul>';					
			return $(ul).appendTo(document.body).attr('id', originDLName + '-list');					
		}
		else{
			return $('#' + originDLName + '-list');						
		}
	}
	
	function checkReverseDisplay(){
		var that = this,
			listDL = that.listDL,
			handlerDL = that.handlerDL,
			windowHeight = $(window).height(),
			windowScrollTop = $(window).scrollTop(),
			listDLTop = parseInt(listDL.css('top')),
			listDLHeight = listDL.outerHeight(),
			handlerDLHeight = handlerDL.outerHeight();
		if(listDLTop + listDLHeight > (windowHeight + windowScrollTop)){
			listDL.css({
				'top': '-=' + (listDLHeight + handlerDLHeight)
			});
		}		
	}
	
	function Plugin(element, options){
		this.originDL = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};
	
	Plugin.prototype = {
		init: function(){
			var that = this,
				listDL = null,
				handlerDL = null,
				outputDL = null,
				originDL = that.originDL,				
				hoverIndex = null,
				options = that.options,
				timeout = 500,
				initClass = options.initClass,
				hoverClass = options.hoverClass,
				onChange = options.onChange,
				generateHandler = options.generateHandler,
				handlerClass = options.handlerClass,
				nativeMenu = options.nativeMenu,
				originDLName = originDL.attr('name');			
			that.liTemplate = options.liTemplate;
			that.lockHover = false;
			that.opened = false;		
			that.handlerDL = handlerDL = originDL.closest('.' + handlerClass);
			that.outputDL = outputDL = originDL.closest('.' + handlerClass).children('span');
			that.disable(false);
			if(generateHandler){
				if(!handlerDL.length){
					originDL.wrap('<div class="' + handlerClass + '"/>');
					that.handlerDL = handlerDL = originDL.closest('.' + handlerClass);
					handlerDL
						.prepend('<a href="javascript:void(0);" title=""/>')
						.prepend('<span/>');
					that.outputDL = outputDL = originDL.closest('.' + handlerClass).children('span');					
				}
			}
			if(!nativeMenu){
				if(options.labelOption){
					originDL.prepend('<option value="" class="labelOption">' + options.labelOption + '</option>');
				}
				that.listDL = listDL = createlistDL.call(that);
				originDL.css('display', 'none');
				listDL
					.addClass(initClass)
					.css({
						'position': 'absolute',
						'z-index': 171985,
						'max-height': options.height,
						'overflow-y': 'auto',
						'display': 'none'
					})
					.off('click.smSelect hover', 'li')
					.on({
						'click.smSelect': function(evt){
							var allLi = listDL.find('li');
							if(!that.disableToggle){
								that.select(allLi.index(this));
								evt.preventDefault();
							}
						},
						'hover': function(evt){
							var currentHover = listDL.find('.' + hoverClass);
							if(that.lockHover == false){
								if(evt.type == 'mouseenter'){
									currentHover.removeClass(hoverClass);
									$(this).addClass(hoverClass);
								}
								if(evt.type == 'mouseleave'){
									$(this).removeClass(hoverClass);
								}								
							}							
						}
					}, 'li')			
					.off('mouseenter.smSelect mouseleave.smSelect')
					.on({
						'mouseenter.smSelect': function(){
							clearTimeout(that.timeout);
						},
						'mouseleave.smSelect': function(){
							clearTimeout(that.timeout);
							that.timeout = setTimeout(function(){
								!that.disableToggle && that.opened && that.close();
							}, timeout);
						}						
					});				
				handlerDL
					.off('click.smSelect mouseenter.smSelect mouseleave.smSelect')
					.on({
						'click.smSelect': function(){
							listDL.is(":hidden") ? that.open() : that.close();
						},
						'mouseenter.smSelect': function(){
							clearTimeout(that.timeout);
						},
						'mouseleave.smSelect': function(){
							clearTimeout(that.timeout);
							that.timeout = setTimeout(function(){
								!that.disableToggle && that.opened && that.close();
							}, timeout);
						}						
					});
				$(document)
					.off('keydown.' + originDLName)
					.on('keydown.' + originDLName, function(evt){
						var hoverClass = options.hoverClass,
							allLi = listDL.find('li'),
							minCount = 0,
							maxCount = allLi.length - 1,							
							currentHover = listDL.find('.' + hoverClass),
							hoverIndex = allLi.index(currentHover),
							hoverIndexTop = allLi.eq(hoverIndex).position().top,
							liHeight = allLi.eq(hoverIndex).height(),
							maxScrollTop = allLi.eq(maxCount).position().top,
							listDLScrollTop = listDL.scrollTop(),
							listDLHeight = listDL.height();
						if(that.opened == true){
							that.lockHover = true;
							clearTimeout(that.clearLockHover);
							that.clearLockHover = setTimeout(function(){
								that.lockHover = false;
							}, timeout);
							switch(evt.which){
								case 38:
									(hoverIndex >= minCount) && hoverIndex--;
									(hoverIndex < minCount) && (hoverIndex = maxCount);
									if(hoverIndexTop < liHeight){
										listDL.scrollTop(listDLScrollTop - 5 * liHeight);
									}
									if(hoverIndex == maxCount){
										listDL.scrollTop(maxScrollTop);
									}
									currentHover.removeClass(hoverClass);
									allLi.eq(hoverIndex).addClass(hoverClass);								
									evt.preventDefault();
								break;
								case 40:
									(hoverIndex <= maxCount) && hoverIndex++;
									(hoverIndex > maxCount) && (hoverIndex = minCount);
									if(hoverIndexTop > (listDLHeight - liHeight)){
										listDL.scrollTop(listDLScrollTop + 5 * liHeight);
									}
									if(hoverIndex == minCount){
										listDL.scrollTop(0);
									}
									currentHover.removeClass(hoverClass);
									allLi.eq(hoverIndex).addClass(hoverClass);								
									evt.preventDefault();
								break;
								case 13:
									that.select(hoverIndex);								
									evt.preventDefault();								
								break;
								case 32:								
									evt.preventDefault();								
								break;
							}
						}
					});
				$(window)
					.off('resize.smSelect' + originDLName)
					.on('resize.smSelect' + originDLName, function(){
						that.reposition();
					});					
			}
			originDL
				.off('change.smSelect')
				.on('change.smSelect', function(evt, index){
					if(!that.disableToggle){
						!nativeMenu && outputDL.html(listDL.find('li').eq(index).html());
						nativeMenu && outputDL.html(originDL.find('option:selected').html());	
						$.isFunction(onChange) && onChange.call(that);
					}			
				});
			originDL.prop('selectedIndex', 0);
			!nativeMenu && outputDL.html(listDL.find('li:eq(0)').html());
			nativeMenu && outputDL.html(originDL.find('option').eq(0).html());				
		},
		reposition: function(){
			var that = this,
				options = that.options,
				deltaTop = options.deltaTop,
				deltaLeft = options.deltaLeft,
				deltaWidth = options.deltaWidth,
				originDL = that.originDL,
				listDL = that.listDL,
				handlerClass = options.handlerClass;
			handlerDL = originDL.closest('.' + handlerClass);
			listDL
				.css({
					'top': handlerDL.offset().top + handlerDL.outerHeight(true) + deltaTop,
					'left':  handlerDL.offset().left + deltaLeft,
                    'width': handlerDL.outerWidth(true) + deltaWidth
				});				
		},
		update: function(params){
			var that = this,
				originDL = that.originDL,
				li = '',
				listDL = that.listDL,
				allOption = null,
				source = that.liTemplate.source,
				liTemplate = null,
				regExp = null,				
				eachOption = null;
			originDL.html(params.option);
			that.liTemplate = params.liTemplate;
			allOption = originDL.find('option');
			for(var i = 0, len = allOption.length; i < len; i++){
				liTemplate = that.liTemplate.template;					
				$.each(source, function(key, value){
					regExp = new RegExp('\{' + key + '\}', 'gi');
					liTemplate = liTemplate.replace(regExp, value[i]);					
				});
				li += liTemplate;
			}
			listDL.html(li);
		},	
		disable: function(option){
			var that = this,
				handlerDL = that.handlerDL,
				disableClass = that.options.disableClass;	
			that.disableToggle = option;
			if(that.disableToggle){
				handlerDL.addClass(disableClass);
			}
			else{
				handlerDL.removeClass(disableClass);
			}
		},		
		open: function(){		
			var that = this,
				listDL = that.listDL,
				options = that.options,
				animation = options.animation,
				duration = options.duration;			
			if(!that.disableToggle && !that.opened){
				that.reposition();
				checkReverseDisplay.call(that);
				$.isFunction(options.onBeforeOpen) && options.onBeforeOpen.call(that);
				if(animation){										
					listDL.slideDown(duration, function(){
						that.opened = true;
						$.isFunction(options.onAfterOpen) && options.onAfterOpen.call(that);
					});
				}
				else{			
					listDL.css('display', 'block');
					that.opened = true;
					$.isFunction(options.onAfterOpen) && options.onAfterOpen.call(that);
				}
				
			}			
		},		
		close: function(){
			var that = this,
				listDL = that.listDL,
				options = that.options,
				hoverClass = options.hoverClass,
				duration = options.duration,
				animation = options.animation;			
			if(!that.disableToggle && that.opened){				
				listDL.find('.' + hoverClass).removeClass(hoverClass);
				$.isFunction(options.onBeforeClose) && options.onBeforeClose.call(that);				
				if(animation){
					listDL.slideUp(duration, function(){
						that.opened = false;
						$.isFunction(options.onAfterClose) && options.onAfterClose.call(that);
					});				
				}
				else{
					listDL.css('display', 'none');
					that.opened = false;
					$.isFunction(options.onAfterClose) && options.onAfterClose.call(that);
				}			
			}			
		},
		select: function(index){
			var that = this,
				options = that.options,
				listDL = that.listDL,
				originDL = that.originDL,
				currentIndex = originDL.prop('selectedIndex'),
				activeClass = options.activeClass
				onSelect = options.onSelect;
			if(!that.disableToggle){
				listDL.find('.' + activeClass).removeClass(activeClass);
				listDL.find('li').eq(index).addClass(activeClass);				
				$.isFunction(onSelect) && onSelect.call(that, index);
				if(index != currentIndex){
					originDL
						.prop('selectedIndex', index)
						.trigger('change.smSelect', index);							
				}
				that.close();
			}
		},
		reset: function(resetCallback){
			var that = this,
				originDL = that.originDL,
				options = that.options,
				hoverClass = options.hoverClass,
				activeClass	= options.activeClass;
			if(!that.disableToggle){
				that.select(0);
				originDL.find('.' + hoverClass).removeClass(hoverClass);
				originDL.find('.' + activeClass).removeClass(activeClass);
				$.isFunction(resetCallback) && resetCallback.call(that);				
			}
		},
		destroy: function(){
			var that = this;
			if(!that.disableToggle){
				$(document).off('keydown.' + that.originDL.attr('name'));
				that.handlerDL.off('.smSelect');
				that.listDL.off('.smSelect').remove();
				that.originDL.removeData(pluginName);
			}
		}
	};
	
	$.fn[pluginName] = function(options, params){
		return this.each(function(){
			var instance = $.data(this, pluginName);
			if(!instance){
				$.data(this, pluginName, new Plugin(this, options));
			}
			else if(instance[options]){
				instance[options](params);
			}
			else{
				console && console.warn('This method does not exists in ' + pluginName);
			}
		});
	};	
	$.fn[pluginName].defaults = {
		liTemplate: false,
		labelOption: null,
		generateHandler: true,
		handlerClass: 'type-combobox',
		deltaTop: 0,
		deltaLeft: 0,
		deltaWidth: 0,
		height: 300,
		animation: true,
		nativeMenu: false,
		initClass: 'dropdown-list',
		hoverClass: 'hover',
		activeClass: 'active',
		disableClass: 'disable',
		duration: 300,
		onBeforeOpen: null,
		onAfterOpen: null,
		onBeforeClose: null,
		onAfterClose: null,
		onChange: null,
		onSelect: null
	};
}(jQuery, window));
//INSTANCE
	//this.originDL: origin dropdownlist,
	//this.listDL: custom dropdownlist,
	//this.outputDL: ouput text or value,
	//this.handlerDL: click to show dropdowlist
//END SMSELECT LIBRARY
/***********************************************************/
/***********************************************************/
/***********************************************************/

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