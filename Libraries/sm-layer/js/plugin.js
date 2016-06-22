/**
 * @name smLayer
 * @description jQuery plugin for showing and hidding layer.
 * @options
 *		position
 *		animation
 *		autoOpen
 *		removeOnClose
 *		closeClass
 *		overlay
 *		opacity
 *		duration
 *		easing
 *		zIndex
 * @events
 *		beforeOpen
 * 		open
 * 		beforeClose
 * 		close
 * @methods
 *		init
 * 		open
 * 		reposition
 * 		close
 * 		destroy
 *
 **/
;(function($, window, undefined) {
	var pluginName = 'smLayer';
	var document = window.document;
	var $window = $(window);

	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var that = this,
				options = this.options;

			if (that.element.find(options.closeButtons).length) {
				that.element.css({
					'display': 'none',
					'zIndex': options.zIndex
				});
				that.element.delegate('.' + options.closeButtons, 'click.' + pluginName, function() {
					that.close();
					return false;
				});
			}

			if (options.repositionOnResize) {
				that.reposition();
			}

			if (options.autoOpen) {
				that.open();
			}
		},
		open: function(callback) {
			if (this.isOpen) {
				return;
			}

			var that = this;
			var options = this.options;
			options.duration = !options.animation ? 0 : options.duration;

			that.reposition();

			if (options.overlay) {
				that.overlay = $('<div>').addClass(options.overlay).css('zIndex', options.zIndex - 1).appendTo('body').fadeOut(0);
				that.overlay.bind('click.' + pluginName, function() {
					that.close();
					return false;
				});
			}

			options.overlay && this.overlay.fadeIn(options.duration, options.easing);

			this.element.fadeIn(options.duration, options.easing, function() {
				$.isFunction(options.open) && options.open.call(that.element);
				$.isFunction(callback) && callback.call(that.element);
				that.isOpen = true;
			});
		},
		reposition: function(position) {
			var that = this;
			var options = this.options;
			var center = {
				top: Math.max(0, ($window.height() - that.element.outerHeight(true)) / 2),
				left: Math.max(0, ($window.width() - that.element.outerWidth(true)) / 2)
			};
			var position = position || options.position;
			var left = (options.position !== 'center' && $.isArray(position)) ? position[0] : center.left;
			var top = (options.position !== 'center' && $.isArray(position) && position.length > 1) ? position[1] : center.top;

			that.element.css({
				'top': top,
				'left': left
			});
		},
		close: function(callback) {
			if (!this.isOpen) {
				return;
			}
			var that = this;
			var options = this.options;
			options.duration = !options.animation ? 0 : options.duration;

			options.overlay && this.overlay.fadeOut(options.duration, options.easing, function() {
				$(this).remove();
			});

			this.element.fadeOut(options.duration, options.easing, function() {
				$.isFunction(options.close) && options.close.call(that.element);
				$.isFunction(callback) && callback.call(that.element);
				that.isOpen = false;
			});
		},
		destroy: function() {
			if (this.isOpen) {
				this.close(this.destroy);
			}
			this.overlay.remove();
			if (this.element.find(this.options.closeButtons).length) {
				this.element.undelegate(this.options.closeButtons, 'click.' + pluginName);
			}
			$.removeData(this.element, pluginName);
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
		animation: true,
		autoOpen: true,
		repositionOnResize: true,
		removeOnClose: false,
		closeButtons: 'close',
		overlay: 'sm-overlay',
		position: 'center',
		duration: 400,
		easing: 'linear',
		zIndex: 1000,
		open: function() {},
		close: function() {}
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

