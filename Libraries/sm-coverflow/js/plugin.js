/**
 * @name smCoverFlow
 * @description description
 * @version 1.0
 * @options
 *		deg
 *		scale
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
;(function($, window, undefined) {
	var pluginName = 'smCoverFlow';
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
			var element = this.element;
			var ulElement = element.find('ul');
			var aElements = ulElement.find('a');
			var currentIndex = 4;
			var distance = 0;

			ulElement.css('margin-left',0)
			aElements.each(function(index){
				aElement = $(this);
				aElement.unbind('click').bind('click',function(e){
					if(e) e.preventDefault();
					var activeIdx = aElements.index($('.active'));
					var pos = index >= activeIdx ? 'right' : 'left';
					if(pos == 'right'){
						distance = index - currentIndex;
						aElements.eq(currentIndex).attr('class','');
						for(var i = 0 ; i < index ; i++){
							aElements.eq(i).attr('class','').attr('style','').css({
								'transition': '0.5s',
								'-moz-transition':'-moz-transform 0.5s',
								'-moz-transform': 'skew(0,'+that.options.deg+'deg)',
								'-webkit-transition':'-webkit-transform 0.5s',
								'-webkit-transform':'skew(0,'+that.options.deg+'deg)',
								'-ms-transition':'-ms-transform 0.5s',
								'-ms-transform':'skew(0,'+that.options.deg+'deg)',
								'-o-transition':'-o-transform 0.5s',
								'-o-transform':'skew(0,'+that.options.deg+'deg)',
								'z-index':i+1
							}).addClass('img-left');
						}
						aElements.eq(index).attr('class','').attr('style','').css({
							'transition': '0.5s',
							'-moz-transition':'-moz-transform 0.5s',
							'-moz-transform': 'scale('+that.options.scale+')',
							'-webkit-transition':'-webkit-transform 0.5s',
							'-webkit-transform':'scale('+that.options.scale+')',
							'-ms-transition':'-ms-transform 0.5s',
							'-ms-transform':'scale('+that.options.scale+')',
							'-o-transition':'-o-transform 0.5s',
							'-o-transform':'scale('+that.options.scale+')',
							'z-index':aElements.length
						}).addClass('img-center').addClass('active');
						
						ulElement.animate({
							'margin-left': parseInt(ulElement.css('margin-left')) - (60*distance)
						},500);
						currentIndex = index;
					}
					else if(pos == 'left'){
						distance = currentIndex - index;
						aElements.eq(currentIndex).attr('class','');
						aElements.eq(index).attr('class','');
						aElements.eq(index).addClass('img-center active');
						var aRights = ulElement.find('.active').parent().nextAll();
						for(var i = 0; i < aRights.length; i++){
							aRights.eq(i).find('a').attr('class','').attr('style','').css({
								'transition': '0.5s',
								'-moz-transition':'-moz-transform 0.5s',
								'-moz-transform': 'skew(0,-'+that.options.deg+'deg)',
								'-webkit-transition':'-webkit-transform 0.5s',
								'-webkit-transform':'skew(0,-'+that.options.deg+'deg)',
								'-ms-transition':'-ms-transform 0.5s',
								'-ms-transform':'skew(0,-'+that.options.deg+'deg)',
								'-o-transition':'-o-transform 0.5s',
								'-o-transform':'skew(0,-'+that.options.deg+'deg)',
								'z-index':aRights.length - i
							}).addClass('img-right');
						}
						
						aElements.eq(index).attr('style','').css({
							'transition': '0.5s',
							'-moz-transition':'-moz-transform 0.5s',
							'-moz-transform': 'scale('+that.options.scale+')',
							'-webkit-transition':'-webkit-transform 0.5s',
							'-webkit-transform':'scale('+that.options.scale+')',
							'-ms-transition':'-ms-transform 0.5s',
							'-ms-transform':'scale('+that.options.scale+')',
							'-o-transition':'-o-transform 0.5s',
							'-o-transform':'scale('+that.options.scale+')',
							'z-index':aElements.length
						});
						ulElement.animate({
							'margin-left': parseInt(ulElement.css('margin-left')) + (60*distance)
						},500);
						currentIndex = index;
					}
				});
				$(window).unbind('keyup.animate').bind('keyup.animate',function(e){
					if(e.keyCode == 39){
						aElements.eq(currentIndex + 1).trigger('click');
					}
					else if(e.keyCode == 37){
						aElements.eq(currentIndex - 1).trigger('click');
					}
				});
			});

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
		deg: '15',
		scale: '1.4'
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
