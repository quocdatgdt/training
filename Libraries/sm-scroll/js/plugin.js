
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
 * @name smScroll
 * @description description
 * @version 1.0
 * @options
 *		scrollType
		scrollContent
		contentContainer
		ulContent

		upButton
		downButton
		vScroller
		prevButton
		nextButton
		hScroller
		
		autoHide
		textSelect
		clickToScroll
		scrollerAutoHeight
		
		scrollerGenerate
		vSrollbarClass
		vScrollerClass
		hSrollbarClass
		hScrollerClass

		iScrollTouch
		friction
		touchDelay
		iscrollInterval
		
		wheelStep
		keydownStep
		holdDelay:
		holdInterval
		hideScrollTime
		
		contentEase:
		contentEaseDuration
		scrollerEase
		scrollerEaseDuration
 * @events
 		onScroll
 * @methods
 *		init
 *		scroll
 *		hScroll
 *		refresh
 *		destroy
 */

;(function($, window, undefined){
	var pluginName = 'smScroll';
	var userAgent = navigator.userAgent;
	var isIOS = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i);
	var touchable = isIOS || ('ontouchstart' in document.documentElement);

	function Plugin(element, options){
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.vars = {};
		this.nameSpace = '.' + pluginName + Math.round(Math.random() * 1000).toString();

		if(/vertical|both/i.test(this.options.scrollType)){
			this.upButton = this.element.find(this.options.upButton);
			this.downButton = this.element.find(this.options.downButton);
			if(this.options.scrollerGenerate){
				var vScrollerContainer = $('<div class="' + this.options.vSrollbarClass + '"><a class="' + this.options.vScrollerClass + '">&nbsp;</a></div>').appendTo(this.element);
				this.vScroller = vScrollerContainer.children();
			}else{
				this.vScroller = this.element.find(this.options.vScroller);
			}
			this.vertical = true;
		}
		if(/horizontal|both/i.test(this.options.scrollType)){
			this.prevButton = this.element.find(this.options.prevButton);
			this.nextButton = this.element.find(this.options.nextButton);
			if(this.options.scrollerGenerate){
				var hScrollerContainer = $('<div class="' + this.options.hSrollbarClass + '"><a class="' + this.options.hScrollerClass + '">&nbsp;</a></div>').appendTo(this.element);
				this.hScroller = hScrollerContainer.children();
			}else{
				this.hScroller = this.element.find(this.options.hScroller);
			}
			this.horizontal = true;
		}

		this.refresh();
		this.init();
	};

	Plugin.prototype = {
		init: function(){
			var thisObj = this;
			var vars = thisObj.vars;
						
			var vTouching = false;
			var hTouching = false;
			var vTouch = false;
			var hTouch = false;
			var prevContentTop = 0;
			var prevContentLeft = 0;
			var isIscroll = thisObj.options.iScrollTouch;

			vars.vDragging = false;
			vars.hDragging = false;
			vars.startX = 0;
			vars.startY = 0;
			vars.prevScrollerTop = 0;
			vars.prevScrollerLeft = 0;
			
			vars.curScrollerTop = 0;
			vars.curContentTop = 0;
			vars.curScrollerLeft = 0;
			vars.curContentLeft = 0;
			
			vars.yDirection = 1;
			vars.xDirection = 1;
			vars.movedY = 0;
			vars.movedX = 0;
			this.inited = true;
			
			this.element.bind('mouseenter' + this.nameSpace, function(){
				$.fn[pluginName].curSMScroll = thisObj;
			}).bind('mouseleave' + this.nameSpace, function(){
				$.fn[pluginName].curSMScroll = null;
			});
			
			this.vScroller && this.vScroller.bind('mousedown' + this.nameSpace, function(e){
				e.preventDefault();
				vars.vDragging = true;
				vars.startY = e.pageY;
				vars.prevScrollerTop = vars.curScrollerTop;
				$.fn[pluginName].draggingSMScroll = thisObj;
			});
			
			this.hScroller && this.hScroller.bind('mousedown' + this.nameSpace, function(e){
				e.preventDefault();
				vars.hDragging = true;
				vars.startX = e.pageX;
				vars.prevScrollerLeft = vars.curScrollerLeft;
				$.fn[pluginName].draggingSMScroll = thisObj;
			});

			if(!$(document).data('smScrollEvent')){
				$(document).data('smScrollEvent', true);
				$(document).bind('mousemove.' + pluginName, function(e){
					e.preventDefault();
					var curScroll = $.fn[pluginName].draggingSMScroll;
					if(!curScroll){
						return;
					}
					if(curScroll.vars.vDragging){
						curScroll.vars.curContentTop = -(curScroll.vars.prevScrollerTop + e.pageY - curScroll.vars.startY) / curScroll.vars.maxScrollerTop * curScroll.vars.maxContentTop;
						curScroll.vScroll(curScroll.vars.curContentTop);
					}
					if(curScroll.vars.hDragging){
						curScroll.vars.curContentLeft = -(curScroll.vars.prevScrollerLeft + e.pageX - curScroll.vars.startX) / curScroll.vars.maxScrollerLeft * curScroll.vars.maxContentLeft;
						curScroll.hScroll(curScroll.vars.curContentLeft);
					}
				}).bind('mouseup.' + pluginName, function(e){
					var curScroll = $.fn[pluginName].draggingSMScroll;
					if(!curScroll){
						return;
					}

					curScroll.vars.vDragging = false;
					curScroll.vars.hDragging = false;

					clearInterval(curScroll.vars.holdInterval);
					clearTimeout(curScroll.vars.waitHoldTimeout);
					
					if(curScroll.options.textSelect){
						clearTimeout(curScroll.vars.textSelectTimeout);
					}
					$.fn[pluginName].draggingSMScroll = null;
				}).bind('keydown.' + pluginName, function(e){
					var curScroll = $.fn[pluginName].curSMScroll;
					if(curScroll == null || curScroll.vars.disable){
						return;
					}
					if(curScroll.vertical){
						if(e.which == 38){
							e.preventDefault();
							curScroll.vars.curContentTop += curScroll.options.keydownStep;
							curScroll.vScroll(curScroll.vars.curContentTop);
						}
						if(e.which == 40){
							e.preventDefault();
							curScroll.vars.curContentTop -= curScroll.options.keydownStep;
							curScroll.vScroll(curScroll.vars.curContentTop);
						}
					}
					if(curScroll.horizontal){
						if(e.which == 37){
							e.preventDefault();
							curScroll.vars.curContentLeft += curScroll.options.keydownStep;
							curScroll.hScroll(curScroll.vars.curContentLeft);
						}
						if(e.which == 39){
							e.preventDefault();
							curScroll.vars.curContentLeft -= curScroll.options.keydownStep;
							curScroll.hScroll(curScroll.vars.curContentLeft);
						}
					}
				});
			}

			this.contentContainer.bind('mousewheel' + this.nameSpace, function(e, delta){
				if(!vars.disable){
					e.preventDefault();
					if(thisObj.vertical){
						vars.curContentTop += delta * thisObj.options.wheelStep;
						thisObj.vScroll(vars.curContentTop);
					}
					if(thisObj.options.scrollType == 'horizontal'){
						vars.curContentLeft += delta * thisObj.options.wheelStep;
						thisObj.hScroll(vars.curContentLeft);
					}
				}
			});

			if(thisObj.vertical){
				thisObj.vScrollBar.bind('mousewheel' + this.nameSpace, function(e, delta){
					if(!vars.disable){
						e.preventDefault();
						vars.curContentTop += delta * thisObj.options.wheelStep;
						thisObj.vScroll(vars.curContentTop);
					}
				});
				
				this.upButton.bind('mousedown' + this.nameSpace, function(e){
					e.preventDefault();
					$.fn[pluginName].draggingSMScroll = thisObj;
					thisObj.vScroll(vars.curContentTop + thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentTop >= 0){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.vScroll(vars.curContentTop + thisObj.options.keydownStep);
							}
						}, thisObj.options.holdInterval);
					}, thisObj.options.holdDelay);
				});
				
				this.downButton.bind('mousedown' + this.nameSpace, function(e){
					e.preventDefault();
					$.fn[pluginName].draggingSMScroll = thisObj;
					thisObj.vScroll(vars.curContentTop - thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentTop <= -vars.maxContentTop){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.vScroll(vars.curContentTop - thisObj.options.keydownStep);
							}
						}, thisObj.options.holdInterval);
					}, thisObj.options.holdDelay);
				});
			}
			
			if(thisObj.horizontal){
				thisObj.hScrollBar.bind('mousewheel' + this.nameSpace, function(e, delta){
					if(!vars.disable){
						e.preventDefault();
						vars.curContentLeft += delta * thisObj.options.wheelStep;
						thisObj.hScroll(vars.curContentLeft);
					}
				});
				this.prevButton.bind('mousedown' + this.nameSpace, function(e){
					e.preventDefault();
					$.fn[pluginName].draggingSMScroll = thisObj;
					thisObj.hScroll(vars.curContentLeft + thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentLeft >= 0){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.hScroll(vars.curContentLeft + thisObj.options.keydownStep);
							}
						}, thisObj.options.holdInterval);
					}, thisObj.options.holdDelay);
				});
				
				this.nextButton.bind('mousedown' + this.nameSpace, function(e){
					e.preventDefault();
					$.fn[pluginName].draggingSMScroll = thisObj;
					thisObj.hScroll(vars.curContentLeft - thisObj.options.keydownStep);
					clearTimeout(vars.waitHoldTimeout);
					vars.waitHoldTimeout = setTimeout(function(){
						vars.holdInterval = setInterval(function(){
							if(vars.curContentLeft <= -vars.maxContentLeft){
								clearInterval(vars.holdInterval);
							}else{
								thisObj.hScroll(vars.curContentLeft - thisObj.options.keydownStep);
							}
						}, thisObj.options.holdInterval);
					}, thisObj.options.holdDelay);
				});
			}

			if(thisObj.options.textSelect){
				var xPadding = 50,
				yPadding = 100,
				maxXVal = 10,
				maxYVal = 10;
				
				var centerX = 0;
				var centerY = 0;
				
				var viewportLeft = thisObj.contentContainer.offset().left;
				var viewportWidth = thisObj.contentContainer.width();
				var viewportTop = thisObj.contentContainer.offset().top;
				var viewportHeight = thisObj.contentContainer.height();
				
				vars.textSelect = false;
				var selectSpeedX = 0;
				var selectSpeedY = 0;
				vars.textSelectTimeout = null;
				
				var selectScroll = function(){
					if(thisObj.vertical && thisObj.horizontal){
						if(Math.abs(selectSpeedY) > Math.abs(selectSpeedX)){
							selectSpeedY != 0 && thisObj.vScroll(vars.curContentTop - selectSpeedY);
						}else{
							selectSpeedX != 0 && thisObj.hScroll(vars.curContentLeft - selectSpeedX);
						}
					}else{
						if(thisObj.vertical){
							selectSpeedY != 0 && thisObj.vScroll(vars.curContentTop - selectSpeedY);
						}
						if(thisObj.horizontal){
							selectSpeedX != 0 && thisObj.hScroll(vars.curContentLeft - selectSpeedX);
						}
					}
					vars.textSelectTimeout = setTimeout(function(){
						selectScroll();
					}, thisObj.options.holdInterval);
				};
				
				centerX = viewportWidth / 2 - xPadding;
				centerY = viewportHeight / 2 - yPadding;
				
				thisObj.contentContainer.bind('mousemove' + this.nameSpace, function(e){
					var speedX = 0;
					var curX = e.pageX - viewportLeft - viewportWidth / 2;
					var signX = (curX > 0)?1:-1;
					curX = Math.abs(curX) - centerX;
					if(curX > 0){
						speedX = signX * curX * maxXVal / xPadding;
					}
				 
					var speedY = 0;
					var curY = e.pageY - viewportTop - viewportHeight / 2;
					var signY = (curY > 0)?1:-1;
					curY = Math.abs(curY) - centerY;
					if(curY > 0){
						speedY = signY * curY * maxYVal / yPadding;
					}
					if(vars.textSelect){
						selectSpeedX = speedX;
						selectSpeedY = speedY;
					}
				});
				
				this.contentContainer.bind('mousedown' + this.nameSpace, function(e){
					$.fn[pluginName].draggingSMScroll = thisObj;
					clearTimeout(vars.textSelectTimeout);
					vars.textSelect = true;
					selectSpeedX = 0;
					selectSpeedY = 0;
					selectScroll();
				});
			}

			if(thisObj.options.clickToScroll){
				if(thisObj.vertical){
					thisObj.vScrollBar.bind('mousedown' + thisObj.nameSpace, function(e){
						if(e.target.tagName.toLowerCase() == 'a'){
							return;
						}
						var scrollTarget = (thisObj.vScrollBar.offset().top - e.pageY) * vars.maxContentTop / vars.maxScrollerTop;
						var sign = (scrollTarget < vars.curContentTop)?-1:1;
						$.fn[pluginName].draggingSMScroll = thisObj;
						vars.holdInterval = setInterval(function(){
							if(sign < 0){
								if(vars.curContentTop <= scrollTarget){
									clearInterval(vars.holdInterval);
								}else{
									thisObj.vScroll(Math.max(vars.curContentTop + sign * thisObj.options.keydownStep, scrollTarget));
								}
							}
							if(sign > 0){
								if(vars.curContentTop >= scrollTarget){
									clearInterval(vars.holdInterval);
								}else{
									thisObj.vScroll(Math.min(vars.curContentTop + sign * thisObj.options.keydownStep, scrollTarget));
								}
							}
						}, thisObj.options.holdInterval);
					});
				}
				if(thisObj.horizontal){
					thisObj.hScrollBar.bind('mousedown' + thisObj.nameSpace, function(e){
						if(e.target.tagName.toLowerCase() == 'a'){
							return;
						}
						
						var scrollTarget = (thisObj.hScrollBar.offset().left - e.pageX) * vars.maxContentLeft / vars.maxScrollerLeft;
						var sign = (scrollTarget < vars.curContentLeft)?-1:1;
						$.fn[pluginName].draggingSMScroll = thisObj;
						vars.holdInterval = setInterval(function(){
							if(sign < 0){
								if(vars.curContentLeft <= scrollTarget){
									clearInterval(vars.holdInterval);
								}else{
									thisObj.hScroll(Math.max(vars.curContentLeft + sign * thisObj.options.keydownStep, scrollTarget));
								}
							}
							if(sign > 0){
								if(vars.curContentLeft >= scrollTarget){
									clearInterval(vars.holdInterval);
								}else{
									thisObj.hScroll(Math.min(vars.curContentLeft + sign * thisObj.options.keydownStep, scrollTarget));
								}
							}
						}, thisObj.options.holdInterval);
					});
				}
			}
			
			var startIscroll = function(dir){
				clearTimeout(vars.runMoreTimeout);
				vars.startTime = (new Date()).getTime();
				if(dir == 'y'){
					vars.moveY = vars.startY;
					vars.yMoving = true;
				}
				if(dir == 'x'){
					vars.moveX = vars.startX;
					vars.xMoving = true;
				}
			};
			
			var vMovingIscroll = function(e){
				if(vars.yDirection * (e.touches[0].pageY - vars.moveY) < 0){
					vars.yDirection *= -1;
					
					vars.startY = e.touches[0].pageY;
					vars.curContentTop += vars.movedY;
					vars.startTime = (new Date()).getTime();
				}
				vars.moveY = e.touches[0].pageY;
				
				vars.movedY = e.touches[0].pageY - vars.startY;
				
				thisObj.vScroll(vars.curContentTop + vars.movedY, {
					temp: true,
					contentEaseDuration: 0,
					contentEase: 'linear',
					scrollerEaseDuration: 0,
					scrollerEase: 'linear'
				});
				clearTimeout(vars.yScrollTimeout);
				vars.yScrollMore = true;
				vars.yScrollTimeout = setTimeout(function(){
					vars.yScrollMore = false;
				}, thisObj.options.touchDelay);
			};
			var hMovingIscroll = function(e){
				if(vars.xDirection * (e.touches[0].pageX - vars.moveX) < 0){
					vars.xDirection *= -1;
					
					vars.startX = e.touches[0].pageX;
					vars.curContentLeft += vars.movedX;
					vars.startTime = (new Date()).getTime();
				}
				vars.moveX = e.touches[0].pageX;
				
				vars.movedX = e.touches[0].pageX - vars.startX;
				thisObj.hScroll(vars.curContentLeft + vars.movedX, {
					temp: true,
					contentEaseDuration: 0,
					contentEase: 'linear',
					scrollerEaseDuration: 0,
					scrollerEase: 'linear'
				});
				clearTimeout(vars.xScrollTimeout);
				vars.xScrollMore = true;
				vars.xScrollTimeout = setTimeout(function(){
					vars.xScrollMore = false;
				}, thisObj.options.touchDelay);
			};
			var vRun = function(vt, f){
				if(vt <= 0 || vars.curContentTop >= 0 || vars.curContentTop <= -vars.maxContentTop){
					return;
				}
				vars.curContentTop += vars.yDirection * vt * thisObj.options.iscrollInterval;
				
				thisObj.vScroll(vars.curContentTop + vars.movedY, {
					temp: true,
					contentEaseDuration: 0,
					contentEase: 'linear',
					scrollerEaseDuration: 0,
					scrollerEase: 'linear'
				});
				vars.runMoreTimeout = setTimeout(function(){
					vt -= f;
					vRun(vt, f);
				}, thisObj.options.iscrollInterval);
			};
			var vEndIscroll = function(){
				vars.yMoving = false;
				var spendTime = (new Date()).getTime() - vars.startTime;
				var v = vars.movedY / spendTime;
				vars.curContentTop = Math.max(Math.min(0, vars.curContentTop + vars.movedY), -vars.maxContentTop);
				
				vars.movedY = 0;
				
				vRun(Math.abs(v), thisObj.options.friction/100 * Math.abs(v));
			};
			var hRun = function(vt, f){
				if(vt <= 0 || vars.curContentLeft >= 0 || vars.curContentLeft <= -vars.maxContentLeft){
					return;
				}
				vars.curContentLeft += vars.xDirection * vt * thisObj.options.iscrollInterval;
				
				thisObj.hScroll(vars.curContentLeft + vars.movedX, {
					temp: true,
					contentEaseDuration: 0,
					contentEase: 'linear',
					scrollerEaseDuration: 0,
					scrollerEase: 'linear'
				});
				vars.runMoreTimeout = setTimeout(function(){
					vt -= f;
					hRun(vt, f);
				}, thisObj.options.iscrollInterval);
			};
			var hEndIscroll = function(){
				vars.xMoving = false;
				var spendTime = (new Date()).getTime() - vars.startTime;
				var v = vars.movedX / spendTime;
				vars.curContentLeft = Math.max(Math.min(0, vars.curContentLeft + vars.movedX), -vars.maxContentLeft);
				
				vars.movedX = 0;
				
				hRun(Math.abs(v), thisObj.options.friction/100 * Math.abs(v));
			};
			
			this.scrollContent.bind('touchstart' + this.nameSpace, function(){
				event.preventDefault();
				vars.startY = event.touches[0].pageY;
				vars.startX = event.touches[0].pageX;
				if(thisObj.vertical){
					vTouching = true;
					prevContentTop = vars.curContentTop;
					if(isIscroll){
						startIscroll('y');
					}
				}
				if(thisObj.horizontal){
					hTouching = true;
					prevContentLeft = vars.curContentLeft;
					if(isIscroll){
						startIscroll('x');
					}
				}
			});
			
			$(document).bind('touchmove' + this.nameSpace, function(){
				if(vTouching && hTouching){
					if(!vTouch && !hTouch){
						if(Math.abs(event.touches[0].pageY - vars.startY) > Math.abs(event.touches[0].pageX - vars.startX)){
							vTouch = true;
						}else{
							hTouch = true;
						}
					}
					if(vTouch){
						if(isIscroll && vars.yMoving){
							vMovingIscroll(event);
						}else{
							vars.curContentTop = prevContentTop + event.touches[0].pageY - vars.startY;
							thisObj.vScroll(vars.curContentTop);
						}
					}else{
						if(isIscroll && vars.xMoving){
							hMovingIscroll(event);
						}else{
							vars.curContentLeft = prevContentLeft + event.touches[0].pageX - vars.startX;
							thisObj.hScroll(vars.curContentLeft);
						}
					}
					return;
				}
				else{
					if(vTouching){
						if(isIscroll && vars.yMoving){
							vMovingIscroll(event);
						}else{
							vars.curContentTop = prevContentTop + event.touches[0].pageY - vars.startY;
							thisObj.vScroll(vars.curContentTop);
						}
					}
					if(hTouching){
						if(isIscroll && vars.xMoving){
							hMovingIscroll(event);
						}else{
							vars.curContentLeft = prevContentLeft + event.touches[0].pageX - vars.startX;
							thisObj.hScroll(vars.curContentLeft);
						}
					}
				}
			}).bind('touchend' + this.nameSpace, function(){
				if(isIscroll){
					if(!vTouching || !hTouching){
						vTouch = vTouching;
						hTouch = hTouching;
					}
					if(vTouch){
						if(vars.yScrollMore){
							vEndIscroll();
						}else{
							vars.curContentTop = vars.curTempContentTop;
							vars.curScrollerTop = vars.curTempScrollerTop;
						}
					}
					if(hTouch){
						if(vars.xScrollMore){
							hEndIscroll();
						}else{
							vars.curContentLeft = vars.curTempContentLeft;
							vars.curScrollerLeft = vars.curTempScrollerLeft;
						}
					}
				}
				
				vTouching = false;
				hTouching = false;
				vTouch = false;
				hTouch = false;
			});
		},
		vScroll: function(contentTop, scrollOptions){
			var thisObj = this;
			var vars = this.vars;
			var contentDuration = '';
			var contentEase = '';
			var scrollerDuration = '';
			var scrollerEase = ''
			
			vars.curTempContentTop = Math.max(Math.min(0, contentTop), -vars.maxContentTop);
			vars.curTempScrollerTop = -vars.curTempContentTop / vars.maxContentTop * vars.maxScrollerTop;
			
			if(!scrollOptions || (scrollOptions && !scrollOptions.temp)){
				vars.curContentTop = vars.curTempContentTop;
				vars.curScrollerTop = vars.curTempScrollerTop;
			}
			
			if(scrollOptions){
				contentDuration = scrollOptions.contentEaseDuration;
				contentEase = scrollOptions.contentEase;
				scrollerDuration = scrollOptions.scrollerEaseDuration;
				scrollerEase = scrollOptions.scrollerEase;
			}else{
				contentDuration = this.options.contentEaseDuration;
				contentEase = this.options.contentEase;
				scrollerDuration = this.options.scrollerEaseDuration;
				scrollerEase = this.options.scrollerEase;
			}
			
			clearTimeout(vars.hideScroller);

			if(this.options.autoHide){
				thisObj.vScroller.css({
					'opacity': 1,
					'display': ''
				});
			}

			this.scrollContent.stop().animate({
				'margin-top': vars.curTempContentTop
			}, contentDuration, contentEase);

			this.vScroller && this.vScroller.stop().animate({
				'margin-top': vars.curTempScrollerTop
			}, scrollerDuration, scrollerEase, function(){
				if(thisObj.options.autoHide){
					vars.hideScroller = setTimeout(function(){
						thisObj.vScroller.fadeOut();
					}, thisObj.options.hideScrollTime);
				}
			});
			if(thisObj.options.onScroll){
				thisObj.options.onScroll(this.element, {top: vars.curTempContentTop || 0, left: vars.curTempContentLeft || 0});
			}
		},
		hScroll: function(contentLeft, scrollOptions){
			var thisObj = this;
			var vars = this.vars;
			vars.curTempContentLeft = Math.max(Math.min(0, contentLeft), -vars.maxContentLeft);
			vars.curTempScrollerLeft = -vars.curTempContentLeft / vars.maxContentLeft * vars.maxScrollerLeft;
			
			if(!scrollOptions || (scrollOptions && !scrollOptions.temp)){
				vars.curContentLeft = vars.curTempContentLeft;
				vars.curScrollerLeft = vars.curTempScrollerLeft;
			}
			
			var contentDuration = this.options.contentEaseDuration;
			var contentEase = this.options.contentEase;
			var scrollerDuration = this.options.scrollerEaseDuration;
			var scrollerEase = this.options.scrollerEase;
			
			if(scrollOptions){
				contentDuration = scrollOptions.contentEaseDuration;
				contentEase = scrollOptions.contentEase;
				scrollerDuration = scrollOptions.scrollerEaseDuration;
				scrollerEase = scrollOptions.scrollerEase;
			}
			
			clearTimeout(vars.hideHScroller);
			if(this.options.scrollerAutoHide){
				thisObj.hScroller.css({
					'opacity': 1,
					'display': ''
				});
			}
			this.scrollContent.stop().animate({
				'margin-left': vars.curTempContentLeft
			}, contentDuration, contentEase);
			this.hScroller && this.hScroller.stop().animate({
				'margin-left': vars.curTempScrollerLeft
			}, scrollerDuration, scrollerEase, function(){
				if(thisObj.options.scrollerAutoHide){
					vars.hideHScroller = setTimeout(function(){
						thisObj.hScroller.fadeOut();
					}, thisObj.options.hideScrollTime);
				}
			});
			if(thisObj.options.onScroll){
				thisObj.options.onScroll(thisObj.element, {top: vars.curTempContentTop || 0, left: vars.curTempContentLeft || 0});
			}
		},
		refresh: function(){
			var vars = this.vars;
			var hideElement = function(elem){
				elem.css('visibility', 'hidden');
			},
			showElement = function(elem){
				elem.css('visibility', 'visible');
			};
			vars.disable = false;
			
			this.scrollContent = $(this.options.scrollContent, this.element);
			this.contentContainer = this.options.contentContainer || this.scrollContent.parent();
			
			if(this.options.autoHide){
				this.vScroller && this.vScroller.fadeOut();
				this.hScroller && this.hScroller.fadeOut();
			}
			
			if(this.vertical){
				this.vScrollBar = this.vScroller.parent();
				vars.vScrollBarHeight = this.vScrollBar.innerHeight();
				// vars.contentHeight = this.scrollContent.outerHeight();
				if(!this.options.ulContent){
					vars.contentHeight = this.scrollContent.outerHeight();
				}else{
					vars.contentHeight = this.scrollContent.children().length * this.scrollContent.children().outerHeight(true);
				}
				vars.viewportHeight = this.contentContainer.innerHeight();
				vars.maxContentTop = vars.contentHeight - vars.viewportHeight;

				if(this.options.scrollerAutoHeight){
					this.vScroller && this.vScroller.css({
						height: vars.viewportHeight / vars.contentHeight * vars.vScrollBarHeight
					});
				}
				vars.maxScrollerTop = vars.vScrollBarHeight - this.vScroller.outerHeight();
				if(vars.maxContentTop <= 0){
					vars.maxContentTop = 0;
					this.inited && this.vScroll(0);
					hideElement(this.vScrollBar);
					hideElement(this.upButton);
					hideElement(this.downButton);
					vars.disable = true;
				}
				else{
					this.inited && this.vScroll(vars.curContentTop);
					showElement(this.vScrollBar);
					showElement(this.upButton);
					showElement(this.downButton);
				}
			}
			
			if(this.horizontal){
				this.hScrollBar = this.hScroller.parent();
				vars.hScrollBarHeight = this.hScroller.parent().innerWidth();
				if(!this.options.ulContent){
					vars.contentWidth = this.scrollContent.outerWidth();
				}else{
					vars.contentWidth = this.scrollContent.children().length * this.scrollContent.children().outerWidth(true);
				}
				vars.viewportWidth = this.contentContainer.innerWidth();
				vars.maxContentLeft = vars.contentWidth - vars.viewportWidth;

				if(this.options.scrollerAutoHeight){
					this.hScroller && this.hScroller.css({
						width: vars.viewportWidth / vars.contentWidth * vars.hScrollBarHeight
					});
				}
				vars.maxScrollerLeft = vars.hScrollBarHeight - this.hScroller.outerWidth();
				if(vars.maxContentLeft <= 0){
					vars.maxContentLeft = 0;
					this.inited && this.hScroll(0);
					hideElement(this.hScrollBar);
					hideElement(this.prevButton);
					hideElement(this.nextButton);
					vars.disable = true;
				}
				else{
					this.inited && this.hScroll(this.curContentLeft);
					showElement(this.hScrollBar);
					showElement(this.prevButton);
					showElement(this.nextButton);
				}
			}
		},
		destroy: function(){
			this.element.removeData(pluginName);
			this.element.unbind(this.nameSpace);
			if(this.vertical){
				this.vScroller && this.vScroller.unbind(this.nameSpace);
				this.upButton.unbind(this.nameSpace);
				this.downButton.unbind(this.nameSpace);
			}
			if(this.hType){
				this.hScroller && this.hScroller.unbind(this.nameSpace);
				this.prevButton.unbind(this.nameSpace);
				this.nextButton.unbind(this.nameSpace);
			}
			$(document).unbind('.' + pluginName).unbind(this.nameSpace);
			this.scrollContent.unbind(this.nameSpace);
			this.vScrollBar.unbind(this.nameSpace);
			this.hScrollBar.unbind(this.nameSpace);
			this.contentContainer.unbind(this.nameSpace);
			delete this;
		}
	};

	$.fn[pluginName] = function(options, params){
		return this.each(function(){
			var instance = $.data(this, pluginName);
			if(!instance){
				$.data(this, pluginName, new Plugin(this, options));
			}else if(instance[options]){
				if($.isArray(params)){
					instance[options].apply(instance, params);
				}else{
					instance[options](params);
				}
			}else{
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};
	
	$.fn[pluginName].defaults = {
		scrollType: 'vertical',
		scrollContent: '.scroll-cont',
		contentContainer: '',
		ulContent: false,

		upButton: '',
		downButton: '',
		vScroller: '',

		prevButton: '',
		nextButton: '',
		hScroller: '',
		
		autoHide: false,
		textSelect: false,
		clickToScroll: false,
		scrollerAutoHeight: false,
		
		scrollerGenerate: false,
		vSrollbarClass: 'v-scrollBar',
		vScrollerClass: 'v-scroller',
		hSrollbarClass: 'h-scrollBar',
		hScrollerClass: 'h-scroller',

		iScrollTouch: false,
		friction: 2,
		touchDelay: 100,
		iscrollInterval: 20,
		
		wheelStep: 20,
		keydownStep: 10,
		holdDelay: 700,
		holdInterval: 33,
		hideScrollTime: 1000,
		
		contentEase: 'linear',
		contentEaseDuration: 0,
		scrollerEase: 'linear',
		scrollerEaseDuration: 0,

		onScroll: function(){}
	};
})(jQuery, window);

