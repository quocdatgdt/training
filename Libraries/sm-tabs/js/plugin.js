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
;(function($, window, undefined) {
	var pluginName = 'smPlugin';
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

		},		
		publicMethod: function(param) {

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
		option1: 'value',
		option2: true,
		option3: 100,
		event1: function() {},
		event2: function() {},
		event3: function() {}
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
;(function($, window, undefined) {
	var pluginName = 'smTabs';
	var privateVar = null;
	var getHeightContent = function(content) {
		var wrapperCopy = content.parent().clone().appendTo('body').css('width',content.parent().width());
		wrapperCopy.html(content.clone().css('display','block')).css({
			'position':'absolute',
			'top': -200000,
			'height':'auto'
		});		
		var result = wrapperCopy.height();
		wrapperCopy.remove();
		return result;
	};

	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function() {
			var that = this;
			var last_handler = this.element.find('.' + that.options.currentClass),
				wrapper = this.element.find('.' + that.options.wrapper),
				last_id = last_handler.find('a').attr('href'),
				current_handler = null;
				current_id = null;
			if(that.options.animate && that.options.effect.length){
				if(that.options.effect == 'opacity' || that.options.effect == 'slideUpDown')
				setTimeout(function(){
					var heightDefault = getHeightContent($(last_id));
					$(wrapper).css('height', heightDefault);
				},500);
			}
			this.element.delegate('a', 'click.'+pluginName, function(){
				if($(this).parent().hasClass(that.options.currentClass)) 
					return false;
				if($(current_id).is(':animated') || $(last_id).is(':animated') || wrapper.is(':animated')){
					return false;
				}
				current_handler = $(this).parent();
				current_id = $(this).attr('href');
				last_handler.removeClass(that.options.currentClass);
				current_handler.addClass(that.options.currentClass);
				if(that.options.animate && that.options.effect.length){
					var heightContent = getHeightContent($(current_id));
					
					if(that.options.effect == 'opacity'){
						$(last_id).animate({
							'opacity' : 0
						},400,function(){
							$(last_id).removeClass(that.options.currentClass);
							wrapper.animate({
								'height':heightContent
							},200,function(){
								$(last_id).removeClass(that.options.currentClass);
								$(current_id).css('opacity',0).addClass(that.options.currentClass);
								$(current_id).animate({
									'opacity' : 1
								},400,function(){
									last_handler = current_handler;
									last_id = current_id;
								});
							});
						});
					}else if(that.options.effect == 'slideUpDown'){
						$(last_id).animate({
							'opacity': 0
						},200,function(){
							$(this).removeClass(that.options.currentClass);
						})
						$(wrapper).animate({
							'height' : 0
						},400,function(){
							$(current_id).css('opacity',0).addClass(that.options.currentClass).animate({
								'opacity': 1
							},200);
							wrapper.animate({
								'height':heightContent
							},400,function(){
								last_handler = current_handler;
								last_id = current_id;
							});
						});
					}else{
						$(last_id).removeClass(that.options.currentClass);
						$(current_id).addClass(that.options.currentClass);
						
						last_handler = current_handler;
						last_id = current_id;
					}
					
				}else{
					$(last_id).removeClass(that.options.currentClass);
					$(current_id).addClass(that.options.currentClass);
					
					last_handler = current_handler;
					last_id = current_id;
				}
				
				
			});
			if(location.hash.length){				
				if($(location.hash).length){
					setTimeout(function(){
						$('a[href='+location.hash+']').trigger('click');
					},1000);
				}
			}
			window.onhashchange = function(){				
				if($(location.hash).length){
					$('a[href='+location.hash+']').trigger('click');
				}
			}; 
		},		
		destroy: function() {
			this.element.undelegate('a', 'click');
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
		currentClass:'current',
		animate:false,
		wrapper:'wrap-tabs-content',
		effect:''
	};
}(jQuery, window));
