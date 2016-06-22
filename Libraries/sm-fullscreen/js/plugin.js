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
		init: function(){

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
 * @name fullScreenSlider
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
	var pluginName = 'smFullscreenSlider';
	var loadAndScale = function(jimages, fixWidth, fixHeight, isLeft, isTop){

		jimages.each(function(){
			if(this._loaded){
				var imgWidth = fixWidth,
					imgHeight = imgWidth / this._naturalRatio;
					
				if(imgHeight < fixHeight){
					imgHeight = fixHeight;
					imgWidth = fixHeight * this._naturalRatio;
				}
				$(this).css({
					width: imgWidth,
					height: imgHeight
				});	
				
				var marginTop = 0;
				if (isTop && $(this).height() > fixHeight){
					marginTop = -($(this).height() - fixHeight) / 2;							
				}
				
				var marginLeft = 0;						
				if (isLeft && $(this).width() > fixWidth){
					marginLeft = -($(this).width() - fixWidth) / 2;
				}
				$(this).css({
					marginTop: marginTop,
					marginLeft: marginLeft
				});
				
			}else{
				var imgInst = new Image(),
					imgElm = this;
					
				imgInst.onload = function(){						
					var nwidth = this.naturalWidth,
						nheight = this.naturalHeight;
						
					if(!nwidth){
						nwidth = this.width;
						nheight = this.height;
					}
					
					imgElm._naturalWidth = nwidth;
					imgElm._naturalHeight = nheight;
					imgElm._naturalRatio = nwidth / nheight;
					
					var imgWidth = fixWidth,
						imgHeight = imgWidth / imgElm._naturalRatio;
					
					if(imgHeight < fixHeight){
						imgHeight = fixHeight;
						imgWidth = fixHeight * imgElm._naturalRatio;
					}
					
					$(imgElm).css({
						width: imgWidth,
						height: imgHeight
					});
					
					var marginTop = 0;
					if (isTop && $(imgElm).height() > fixHeight){
						marginTop = -($(imgElm).height() - fixHeight) / 2;							
					}
					
					var marginLeft = 0;
					if (isLeft && $(imgElm).width() > fixWidth){
						marginLeft = -($(imgElm).width() - fixWidth) / 2;
					}
					$(imgElm).css({
						marginTop: marginTop,
						marginLeft: marginLeft
					});					
					
					imgElm._loaded = true;
				};
				
				imgInst.src = this.src;
			}
		});
	};
	

	function SMPlugin(element, options, iNamespace){
		this.element = $(element);
		this.iNamespace = iNamespace === undefined ? '0' : iNamespace;
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
		return this;
	};

	SMPlugin.prototype = {
		init: function(){
			var that = this;

			if ($.isFunction(that.options.onBeforeInit)){
				that.options.onBeforeInit.call(that.element);
			}

			var container = $(that.options.containerSelecter);				
			var wrapGallery = that.element;
			var listImgBG = wrapGallery.find(that.options.backgroundImgSelecter);
			var listSlider = wrapGallery.find(that.options.listSliderSelecter);
			var blockGallery = listSlider.parent();
			var btnNext = wrapGallery.find(that.options.btnNextSelecter);
			var btnPrev = wrapGallery.find(that.options.btnPrevSelecter);
			var lengthGallery = listSlider.length;
			var listThumbs = $(that.options.listThumbSelecter);			

			that.container = container;
			that.wrapGallery = wrapGallery;
			that.listImgBG = listImgBG
			that.listSlider = listSlider;
			that.blockGallery = blockGallery;
			that.btnNext = btnNext;
			that.btnPrev = btnPrev;
			that.lengthGallery = lengthGallery;
			that.listThumbs = listThumbs;

			that.currentIndex = 0;

			var fnScale = function(){
				var winW = $(window).width();
				var winH = $(window).height();				

				container.css({
					width: winW,
					height: winH
				});
				listSlider.css({
					width: winW
				});

				loadAndScale(listImgBG, winW, winH, true, true);
			};

			fnScale();
			$(window).unbind('resize.' + that.options.namespace + that.iNamespace).bind('resize.' + that.options.namespace + that.iNamespace, function(){
				fnScale();
				listSlider.css({
					width: $(window).width()
				});
			});

			listSlider.each(function(i,e){
				$(e).attr('data-index', i);
			});

			listSlider.css({
				width: $(window).width()
			});

			btnNext.unbind('click.' + that.options.namespace + that.iNamespace).bind('click.' + that.options.namespace + that.iNamespace, function(e){
				e.preventDefault();
				that.slide(1, (that.currentIndex + 1) % lengthGallery);
			});

			btnPrev.unbind('click.' + that.options.namespace + that.iNamespace).bind('click.' + that.options.namespace + that.iNamespace, function(e){
				e.preventDefault();
				that.slide(-1, (that.currentIndex - 1 + lengthGallery) % lengthGallery);
			});

			listThumbs.unbind('click.' + that.options.namespace + that.iNamespace).bind('click.' + that.options.namespace + that.iNamespace, function(e){
				e.preventDefault();
				var index = listThumbs.index($(this));
				if (index == that.currentIndex){
					return;
				}
				listThumbs.parent().removeClass(that.options.classCurrent);
				$(this).parent().addClass(that.options.classCurrent);
				that.slide(index > that.currentIndex ? 1 : -1, index);
			});

			$(document).unbind('keyup.' + that.options.namespace + that.iNamespace).bind('keyup.' + that.options.namespace + that.iNamespace, function(e){
				if (e.which == 37) {
					btnPrev.trigger('click.' + that.options.namespace + that.iNamespace);
				}
				if (e.which == 39) {
					btnNext.trigger('click.' + that.options.namespace + that.iNamespace);
				}
			});

		},		
		slide: function(direction, slideTo, duration, callback){
			var that = this;			
			if (that.blockGallery.is(':animated')){
				return;
			}
			duration = duration !== undefined ? duration : that.options.duration || 800;
			callback = callback !== undefined ? callback : that.options.onAfterSlide;
			if (!that.options.isLoop){

			}
			else{
				that.currentIndex = slideTo;
				that.listThumbs.removeClass(that.options.classCurrent);
				that.listThumbs.eq(that.currentIndex).addClass(that.classCurrent);
				Cufon.replace(jQuery('#nav ul li ul a'), {
					fontFamily: 'Mrs Eaves OT',
					hover: true
				});

				var galleryWidth = that.listSlider.eq(0).width();

				if (direction > 0){
					var alpha = null;
					for (var i = 0; i < that.listSlider.length; i++){							
						if (that.listSlider.eq(i).attr('data-index') == slideTo){
							alpha = i;
							break;
						}
					}
					if (alpha !== null){
						that.currentIndex = slideTo;

						that.blockGallery.stop().animate({
							marginLeft: -galleryWidth * alpha
						}, duration, that.options.easing, function(){
							for (var i = 0; i < alpha; i++){
								that.listSlider.first().appendTo(that.blockGallery);
								that.listSlider = that.wrapGallery.find(that.options.listSliderSelecter);
								that.blockGallery = that.listSlider.parent();
							}
							that.blockGallery.css('marginLeft', 0);
							if ($.isFunction(callback)){
								callback.call(that.element);
							}
						});
					}
				}
				else if (direction < 0){					
					var lengthGallery = that.listSlider.length;
					var alpha = null;
					for (var i = 0; i < that.listSlider.length; i++){							
						if (that.listSlider.eq(i).attr('data-index') == slideTo){
							alpha = i;
							break;
						}
					}
					if (alpha){
						that.currentIndex = slideTo;
						var count = 0;
						for (var i = lengthGallery; i > alpha; i--){
							count++;
							that.listSlider.last().prependTo(that.blockGallery);
							that.listSlider = that.wrapGallery.find(that.options.listSliderSelecter);
							that.blockGallery = that.listSlider.parent();
						}
						that.blockGallery.css('marginLeft', - count * galleryWidth);
						that.blockGallery.stop().animate({
							marginLeft: 0
						}, duration, that.options.easing, function(){							
							if ($.isFunction(callback)){
								callback.call(that.element);
							}
						});
					}
					
				}
			}
		}
	};

	$.fn[pluginName] = function(options, params){
		var objects = new Array();
		this.each(function(i){
			objects[i] = new SMPlugin(this, options, i);
		});
		return objects;
	};

	

	$.fn[pluginName].defaults = {
		containerSelecter: '#container',
		btnNextSelecter:'.lnk-next > a',
		btnPrevSelecter: '.lnk-pre > a',		
		listSliderSelecter: '.gallery-cnt',
		backgroundImgSelecter: '.img-gallery > img',
		classCurrent: 'current',
		listThumbSelecter: '#nav ul li a',
		isLoop: true,
		iGallery: 0,
		durationSlide: 1000,
		namespace: 'fullSlide',
		autoSlide: 0,
		easing: '',
		onAfterSlide: function(){
			if (console){
				console.log('Slid');
			}
		},
		onBeforeInit: function(){

		}
	};
}(jQuery, window));

// $.fn[pluginName] = function(options, params){
// 		var objects = new Array();
// 		this.each(function(i){
// 			var instance = $.data(this, pluginName);
// 			if (!instance){
// 				objects[i] = 
// 				$.data(this, pluginName, new SMPlugin(this, options, i));
// 			}
// 			else if (instance[options]){
// 				instance[options](params);
// 			} 
// 			else{
// 				if (console){
// 					console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
// 				}
// 			}
// 		});
// 		return objects;
// 	};

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
