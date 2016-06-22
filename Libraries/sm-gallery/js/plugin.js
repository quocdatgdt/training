/**
 * @name smGallery
 * @description description
 * @version 1.0
 * @options
 *	#thumb:
 *		show
 *		duration
 *		activeClass
 *	#preview:
 *		duration
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
;(function($, window, undefined) {
	var pluginName = 'smGallery';
	var privateVar = null;
	var privateMethod = {		
	};

	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
	
		init: function() {			
			var that = this,
				options = this.options;
			that.element.bind('mouseenter.' + pluginName, function(){
				$.fn[pluginName].curSMGallery = that;
			}).bind('mouseleave.' + pluginName, function(){
				$.fn[pluginName].curSMGallery = null;
			});		
			
			if(options.animateType == 'fade'){		
				var	jdisplaycontainer = that.element.find(options.clsContainerSlider),												
						jthumbscontainer = that.element.find(options.clsContainerListThum),
						jthumbs = jthumbscontainer.find('ul:first'),
						jthumbitems = jthumbs.children(),					
						jprevthumb = jthumbscontainer.find(options.clsIconPrev),
						jnextthumb = jthumbscontainer.find(options.clsIconNext);
					var galleryData = {
							timerId: null,
							currenIdx: 0,
							lengthContainer: null,
							containerHeight: null,
							containerWidth: null,
							thumbHeight: null,
							thumbWidth: null,
							durationAnimate: null,
							status: 1
						};
						
					galleryData.iconNext = jnextthumb;
					galleryData.iconPrev = jprevthumb;	
					$(that).data('galleryData', galleryData);	
					that.playFade(that, jnextthumb, jprevthumb, options ,jdisplaycontainer, jthumbitems, galleryData);								
			}
			else{	
				if(options.vertical){
					var	jdisplaycontainer = that.element.find(options.clsContainerSlider),
						jdisplay = jdisplaycontainer.find('ul:first'),
						jdisplayitems = jdisplay.children(),
						jthumbscontainer = that.element.find(options.clsContainerListThum),
						jthumbs = jthumbscontainer.find('ul:first'),
						jthumbitems = jthumbs.children(),					
						jprevthumb = jthumbscontainer.find(options.clsIconPrev),
						jnextthumb = jthumbscontainer.find(options.clsIconNext);
					var galleryData = {
							timerId: null,
							currenIdx: 0,
							lengthContainer: null,
							containerHeight: null,
							containerWidth: null,
							thumbHeight: null,
							thumbWidth: null,
							durationAnimate: null,
							status: 1
						};
						
					galleryData.iconNext = jnextthumb;
					galleryData.iconPrev = jprevthumb;
					$(that).data('galleryData', galleryData);
					that.playSildeVertical(that, jnextthumb, jprevthumb, options ,jdisplayitems, jthumbitems, galleryData);	
				}
				else{
					var jdisplaycontainer = that.element.find(options.clsContainerSlider),
						jdisplay = jdisplaycontainer.find('ul:first');
						jdisplayitems = jdisplay.children(),
						jthumbscontainer = that.element.find(options.clsContainerListThum),
						jthumbs = jthumbscontainer.find('ul:first'),
						jthumbitems = jthumbs.children(),
						iconNext = that.element.find(options.clsIconNext),
						iconPrev = that.element.find(options.clsIconPrev);	
					var galleryData = {
							timerId: null,
							currenIdx: 0,
							lengthContainer: null,
							containerHeight: null,
							containerWidth: null,
							thumbHeight: null,
							thumbWidth: null,
							durationAnimate: null,
							status: 1
						};
						
					galleryData.iconNext = iconNext;
					galleryData.iconPrev = iconPrev;					
					$(that).data('galleryData', galleryData);					
					if(options.showMessage){				
						that.addDesDiv(that, options ,jdisplayitems, jthumbitems, galleryData);
					}	
					that.playSildeHorizal(that, iconNext, iconPrev, options ,jdisplayitems, jthumbitems, galleryData);
				}
			}			
		},	
		
		addDesDiv: function(that, options ,jdisplayitems, jthumbitems, galleryData) {						
			for(var i = 0 ; i < jdisplayitems.length ;i++){
				var htmlStruc = $('<div class="'+options.showMessage.messageClass+'">'+
							  '<div>'+$(jthumbitems[i]).attr('data-des')+'</div>'+
							'</div>').css({
								'width': options.showMessage.w,
								'height': options.showMessage.h,
								'bottom': options.showMessage.y,
								'left': options.showMessage.x,								
								'opacity': '0'
							});
					htmlStruc.appendTo(jdisplayitems[i]);	
			}							
		},
		
		playFade: function(that, jnextthumb, jprevthumb, options ,jdisplaycontainer, jthumbitems, galleryData){
			jthumbitems.each(function(index){
				var jthumbitem = $(this);				
				if(index){
					var imgTag = jthumbitem.find('img:first'),
						aHref = jthumbitem.find('a:first');
					jdisplaycontainer.find('a:first').clone().attr({
						'href': aHref.attr('href'),
						'title': aHref.attr('title')
					}).css({
						'opacity':0,
						'z-index':-1
					}).appendTo(jdisplaycontainer).find('img').attr({
						'alt': imgTag.attr('alt'),
						'src': aHref.attr('data-src')
					});
				}					
			});	
			
			var jdisplayitems = jdisplaycontainer.children();
			
			galleryData.lengthContainer = jdisplayitems.length - 1;
			galleryData.containerWidth = jdisplayitems.eq(0).outerWidth(true);	
			galleryData.thumbWidth = jthumbitems.eq(0).outerWidth(true);	
			galleryData.durationAnimate = options.duration;			
			
			jthumbitems.removeClass(options.clsActive);
			jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);			
			
			if(options.setInterval){
				that.startInterval(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
			}
			
			jnextthumb.unbind('click.'+pluginName).bind('click.'+pluginName,function(){
				that.next(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
				return false;
			});
			
			jprevthumb.unbind('click.'+pluginName).bind('click.'+pluginName, function(){
				that.prev(that, iconNext, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
				return false;
			});
					
			that.clickThumbs(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
			that.keydown(jnextthumb, jprevthumb, galleryData);			
			
		},
		
		playSildeHorizal: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){			
			if(jdisplayitems.length < 2){				
				iconNext.css('visibility','hidden');
				iconPrev.css('visibility','hidden');
				jthumbitems.css('visibility','hidden');
			}
			
			galleryData.lengthContainer = jdisplayitems.length - 1;
			galleryData.containerWidth = jdisplayitems.eq(0).outerWidth(true);		
			galleryData.thumbWidth = jthumbitems.eq(0).outerWidth(true);	
			galleryData.durationAnimate = options.duration;
			
			jthumbitems.parent().css({
				'width':jthumbitems.length * jthumbitems.eq(0).outerWidth(true)
			});
			
			jthumbitems.removeClass(options.clsActive);
			jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);
			
			jdisplayitems.css({				
				'margin-left': - 10000
			}).eq(galleryData.currenIdx).css({
				'margin-left':0
			});
			
			if(options.setInterval){
				that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
			}
			
			if(options.showMessage){
				that.showMess(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);					
			}				
			
			iconNext.unbind('click.'+pluginName).bind('click.'+pluginName,function(){				
				that.next(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
				return false;
			});
			
			iconPrev.unbind('click.'+pluginName).bind('click.'+pluginName, function(){
				that.prev(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
				return false;
			});
					
			that.clickItems(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
			
			that.keydown(iconNext, iconPrev, galleryData);	
			
		},
		
		playSildeVertical: function(that, jnextthumb, jprevthumb, options ,jdisplayitems, jthumbitems, galleryData){			
			galleryData.lengthContainer = jdisplayitems.length - 1;
			galleryData.containerHeight = jdisplayitems.eq(0).outerHeight(true);
			galleryData.thumbHeight = jthumbitems.eq(0).outerHeight(true);
			galleryData.durationAnimate = options.duration;
			
			jthumbitems.removeClass(options.clsActive);
			jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);
			
			jdisplayitems.css({
				'position':'absolute',
				'margin-top': 10000
			}).eq(galleryData.currenIdx).css({
				'margin-top':0
			});
			
			if(options.setInterval){
				that.startInterval(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
			}
			
			
			jnextthumb.unbind('click.'+pluginName).bind('click.'+pluginName, function(){
				that.next(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);				
				return false;
			});
			
			jprevthumb.unbind('click.'+pluginName).bind('click.'+pluginName, function(){
				that.prev(that, jnextthumb, jprevthumb, options, jdisplayitems, jthumbitems, galleryData);
				return false;
			});
			
			that.clickThumbs(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
			that.keydown(iconNext, iconPrev, galleryData);			
		},
		
		keydown: function(iconNext, iconPrev, galleryData){
			$(document).bind('keydown.' + pluginName, function(e){				
				if(e.keyCode == 39)
				{	
					e.preventDefault();
					if(galleryData.status){									
						$($.fn[pluginName].curSMGallery).data('galleryData').iconNext.trigger('click.'+pluginName);
					}
				}
				if(e.keyCode == 37)
				{
					e.preventDefault();
					if(galleryData.status){						
						$($.fn[pluginName].curSMGallery).data('galleryData').iconPrev.trigger('click.'+pluginName);
					}
				}
			});
		},
		
		showMess: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){
			$(jdisplayitems).each(function() {
				var jdisplayitem = $(this),
					divMess = jdisplayitem.find('.message');
				jdisplayitem.unbind('mouseenter.'+pluginName).bind('mouseenter.'+pluginName,function(){
					that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					divMess.stop(true).animate({
						'opacity': options.showMessage.zOpacity
					});
				});
				jdisplayitem.unbind('mouseleave.'+pluginName).bind('mouseleave.'+pluginName,function(){
					that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					divMess.stop(true).animate({
						'opacity': 0
					});
				});	
				// divMess.unbind('mouseover.'+pluginName).bind('mouseover.'+pluginName,function(){					
					// divMess.css('display', 'block');
				// });
				// divMess.unbind('mouseout.'+pluginName).bind('mouseout.'+pluginName,function(){					
					// that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					// divMess.stop(true).animate({
						// 'opacity': 0
					// });
				// });
			});
		},
		
		next: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){
			
			if(options.animateType == 'fade'){
				if(jdisplayitems.length < 2 || galleryData.status == 0){
					return false;
				}
				
				that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
				
				jdisplayitems.eq(galleryData.currenIdx).stop().animate({
					'opacity':0,
					'z-index': -1
				}, galleryData.durationAnimate);
				
				galleryData.currenIdx = galleryData.currenIdx + 1;
				
				if(galleryData.currenIdx > galleryData.lengthContainer)
				{
					galleryData.currenIdx = 0;
				}
				galleryData.status = 0;
				jdisplayitems.eq(galleryData.currenIdx).css({
					'opacity': 0,
					'z-index':1006
				}).stop(true).animate({
					'opacity': 1
				}, galleryData.durationAnimate, function()
					{
						if(options.setInterval)
						{
							that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						}else{
							galleryData.status = 1;
						}
					});				
				
				that.nextThumb(options, jthumbitems, galleryData);
			}
			else{
				if(options.vertical){
					if(jdisplayitems.length < 2 || galleryData.status == 0){
						return false;
					}
					
					that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					
					jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
						'margin-top':-galleryData.containerHeight
					},galleryData.durationAnimate);
					
					galleryData.currenIdx = galleryData.currenIdx + 1;
					
					if(galleryData.currenIdx > galleryData.lengthContainer)
					{
						galleryData.currenIdx = 0;
					}
					galleryData.status = 0;
					jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-top',galleryData.containerHeight).animate({
						'margin-top':0
					}, galleryData.durationAnimate, function()
						{
							if(options.setInterval)
							{
								that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							}else{
								galleryData.status = 1;
							}
						}
					);
					
					that.nextThumb(options, jthumbitems, galleryData);			
				}
				else{
					if(jdisplayitems.length < 2 || galleryData.status == 0){
						return false;
					}
					
					that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					
					jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
						'margin-left':-galleryData.containerWidth
					},galleryData.durationAnimate);
					
					galleryData.currenIdx = galleryData.currenIdx + 1;
					
					if(galleryData.currenIdx > galleryData.lengthContainer)
					{
						galleryData.currenIdx = 0;
					}
					galleryData.status = 0;
					jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-left',galleryData.containerWidth).animate({
						'margin-left':0
					}, galleryData.durationAnimate, function()
						{
							if(options.setInterval)
							{
								that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							}else{
								galleryData.status = 1;
							}
						}
					);
					
					that.nextThumb(options, jthumbitems, galleryData);	
				}
			}					
		},
		
		prev: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){
			if(options.animateType == 'fade'){
				if(galleryData.status == 0){
					return false;
				}
				
				that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					
				jdisplayitems.eq(galleryData.currenIdx).stop().animate({
					'opacity':0,
					'z-index': -1
				}, galleryData.durationAnimate);
				
				galleryData.currenIdx = galleryData.currenIdx - 1;
				
				if(galleryData.currenIdx < 0)
				{
					galleryData.currenIdx = galleryData.lengthContainer;
				}
				galleryData.status = 0;
				jdisplayitems.eq(galleryData.currenIdx).css({
					'opacity': 0,
					'z-index':1006
				}).stop(true).animate({
					'opacity': 1
				}, galleryData.durationAnimate, function()
					{
						if(options.setInterval)
						{
							that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						}else{
							galleryData.status = 1;
						}
					});	
				
				that.prevThumb(options, jthumbitems, galleryData);	
			}else{
				if(options.vertical){
					if(galleryData.status == 0){
						return false;
					}
					
					that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						
					jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
						'margin-top': galleryData.containerHeight
					},galleryData.durationAnimate);
					
					galleryData.currenIdx = galleryData.currenIdx - 1;
					
					if(galleryData.currenIdx < 0)
					{
						galleryData.currenIdx = galleryData.lengthContainer;
					}
					galleryData.status = 0;
					jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-top',-galleryData.containerHeight).animate({
						'margin-top':0
					}, galleryData.durationAnimate, function()
						{
							if(options.setInterval)
							{
								that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							}else{
								galleryData.status = 1;
							}
						}
					);
					
					that.prevThumb(options, jthumbitems, galleryData);					
				}else{
					if(galleryData.status == 0){
						return false;
					}
					
					that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						
					jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
						'margin-left': galleryData.containerWidth
					},galleryData.durationAnimate);
					
					galleryData.currenIdx = galleryData.currenIdx - 1;
					
					if(galleryData.currenIdx < 0)
					{
						galleryData.currenIdx = galleryData.lengthContainer;
					}
					galleryData.status = 0;
					jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-left',-galleryData.containerWidth).animate({
						'margin-left':0
					}, galleryData.durationAnimate, function()
						{
							if(options.setInterval)
							{
								that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							}else{
								galleryData.status = 1;
							}
						}
					);
					
					that.prevThumb(options, jthumbitems, galleryData);
				}
			}					
		},
		
		nextThumb: function(options, jthumbitems, galleryData){
			if(options.animateType == 'fade'){
				galleryData.currenIdx = galleryData.currenIdx;
				jthumbitems.removeClass(options.clsActive);
				jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
				
				if(galleryData.currenIdx == 0){											
					jthumbitems.parent().stop(true).animate({
						'margin-left': 0
					});											
				}else{																				
					if(galleryData.currenIdx >= options.thumbShow){							
						jthumbitems.parent().stop(true).animate({
							'margin-left': -galleryData.thumbWidth * (galleryData.currenIdx - (options.thumbShow-1))
						}, 500);						
					}	
				}		
			}
			else{
				if(options.vertical){					
					galleryData.currenIdx = galleryData.currenIdx;
					jthumbitems.removeClass(options.clsActive);
					jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
					
					if(galleryData.currenIdx == 0){											
						jthumbitems.parent().stop(true).animate({
							'margin-top': 0
						});											
					}else{																				
						if(galleryData.currenIdx >= options.thumbShow){							
							jthumbitems.parent().stop(true).animate({
								'margin-top': -galleryData.thumbHeight * (galleryData.currenIdx - (options.thumbShow-1))
							}, galleryData.durationAnimate);						
						}	
					}					
				}
				else{					
					galleryData.currenIdx = galleryData.currenIdx;
					jthumbitems.removeClass(options.clsActive);
					jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
					
					if(galleryData.currenIdx == 0){											
						jthumbitems.parent().stop(true).animate({
							'margin-left': 0
						});											
					}else{					
						if(galleryData.currenIdx >= options.thumbShow){														
							jthumbitems.parent().stop(true).animate({
								'margin-left': -galleryData.thumbWidth * (galleryData.currenIdx - (options.thumbShow-1))
							}, galleryData.durationAnimate);						
						}	
					}														
				}
			}			
		},
		
		prevThumb: function(options, jthumbitems, galleryData){
			if(options.animateType == 'fade'){
				galleryData.currenIdx = galleryData.currenIdx;
				jthumbitems.removeClass(options.clsActive);
				jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
				
				if(galleryData.currenIdx == 0){											
					jthumbitems.parent().stop(true).animate({
						'margin-left': 0
					});											
				}else{																				
					if(galleryData.currenIdx >= options.thumbShow){							
						jthumbitems.parent().stop(true).animate({
							'margin-left': -galleryData.thumbWidth * (galleryData.currenIdx - (options.thumbShow-1))
						}, galleryData.durationAnimate);						
					}	
				}		
			}else{
				if(options.vertical){				
					galleryData.currenIdx = galleryData.currenIdx;
					jthumbitems.removeClass(options.clsActive);
					jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
					
					if(galleryData.currenIdx == 0){											
						jthumbitems.parent().stop(true).animate({
							'margin-top': 0
						});											
					}else{																				
						if(galleryData.currenIdx >= options.thumbShow){							
							jthumbitems.parent().stop(true).animate({
								'margin-top': -galleryData.thumbHeight * (galleryData.currenIdx - (options.thumbShow-1))
							}, galleryData.durationAnimate);						
						}	
					}					
				}else{			
					galleryData.currenIdx = galleryData.currenIdx;
					jthumbitems.removeClass(options.clsActive);
					jthumbitems.eq(galleryData.currenIdx).addClass(options.clsActive);		
					
					if(galleryData.currenIdx == 0){											
						jthumbitems.parent().stop(true).animate({
							'margin-left': 0
						});											
					}else{																				
						if(galleryData.currenIdx >= options.thumbShow){							
							jthumbitems.parent().stop(true).animate({
								'margin-left': -galleryData.thumbWidth * (galleryData.currenIdx - (options.thumbShow-1))
							}, galleryData.durationAnimate);						
						}	
					}													
				}
			}			
		},
			
		clickItems: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){
			jthumbitems.each(function(index){
				var jthumbitem = jQuery(this);
				jthumbitem.unbind('click.'+pluginName).bind('click.'+pluginName ,function(){
					if(galleryData.currenIdx == index){
						return false;
					}
					
					if(options.setInterval){
						that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
					}
					
					var leftRight = 0;
					if(index == galleryData.currenIdx){	
						if(options.setInterval){
							that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						}
						return false;
					}
					
					if(index > galleryData.currenIdx){
						leftRight = 1;
						jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
							'margin-left':-galleryData.containerWidth
						},galleryData.durationAnimate);
					}else{
						leftRight = 0;
						jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
							'margin-left':galleryData.containerWidth
						},galleryData.durationAnimate);
					}
					galleryData.currenIdx = index;
					if(leftRight){
						jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-left',galleryData.containerWidth).animate({
							'margin-left':0
						},galleryData.durationAnimate ,function(){
								if(options.setInterval)
								{
									that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
								}
							}
						);
					}else{
						jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-left',-galleryData.containerWidth).animate({
							'margin-left':0
						},galleryData.durationAnimate,function(){
								if(options.setInterval)
								{
									that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
								}
							}
						);
					}
					jthumbitems.removeClass(options.clsActive);
					jthumbitem.addClass(options.clsActive);
					return false;
				});
			});	
		},
		
		clickThumbs: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData){
			if(options.animateType == 'fade'){
				jthumbitems.each(function(index){
					var jthumbitem = jQuery(this);
					jthumbitem.unbind('click.'+pluginName).bind('click.'+pluginName ,function(){					
						if(galleryData.currenIdx == index){
							return false;
						}
						
						if(options.setInterval){
							that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						}
						
						jdisplayitems.eq(galleryData.currenIdx).stop().animate({
							'opacity':0,
							'z-index': -1
						}, galleryData.durationAnimate);						
						
						galleryData.currenIdx = index;
						
						jdisplayitems.eq(galleryData.currenIdx).css({
							'opacity': 0,
							'z-index':1006
						}).stop(true).animate({
							'opacity': 1
						}, galleryData.durationAnimate, function()
							{
								if(options.setInterval)
								{
									that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
								}
							});				
						
						
						jthumbitems.removeClass(options.clsActive);
						jthumbitem.addClass(options.clsActive);
						return false;
					});
				});	
			}else{			
				jthumbitems.each(function(index){
					var jthumbitem = jQuery(this);
					jthumbitem.unbind('click.'+pluginName).bind('click.'+pluginName ,function(){					
						if(galleryData.currenIdx == index){
							return false;
						}
						
						if(options.setInterval){
							that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
						}
						
						var leftRight = 0;
						if(index == galleryData.currenIdx){	
							if(options.setInterval){
								that.endInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
								that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
							}
							return false;
						}
						
						if(index > galleryData.currenIdx){
							leftRight = 1;
							jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
								'margin-top':-galleryData.containerHeight
							}, galleryData.durationAnimate);
						}else{
							leftRight = 0;
							jdisplayitems.eq(galleryData.currenIdx).stop(true).animate({
								'margin-top':galleryData.containerHeight
							}, galleryData.durationAnimate);
						}
						galleryData.currenIdx = index;
						if(leftRight){
							jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-top',galleryData.containerHeight).animate({
								'margin-top':0
							}, galleryData.durationAnimate, function(){
									if(options.setInterval)
									{
										that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
									}
								}
							);
						}else{
							jdisplayitems.eq(galleryData.currenIdx).stop(true).css('margin-top',-galleryData.containerHeight).animate({
								'margin-top':0
							}, galleryData.durationAnimate, function(){
									if(options.setInterval)
									{
										that.startInterval(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
									}
								}
							);
						}
						jthumbitems.removeClass(options.clsActive);
						jthumbitem.addClass(options.clsActive);
						return false;
					});
				});	
			}
		},
		
		startInterval: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData) {					
			if(options.setInterval){
				galleryData.timerId = setInterval(function(){
					that.next(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData);
				}, options.timerInterval);
				galleryData.status = 1;	
			}					
		},
		
		endInterval: function(that, iconNext, iconPrev, options, jdisplayitems, jthumbitems, galleryData) {			
			if(options.setInterval){
				clearInterval(galleryData.timerId);
				galleryData.status = 0;	
			}					
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
		thumbShow: 'value',
		showMessage: false,
		messageOpacity: 0.8,
		animateType: 'string',
		vertical: false,
		showMessage: false,
		messageClass: 'string',
		clsIconNext :'string',
		clsIconPrev : 'string',
		clsContainerSlider: 'string',
		clsContainerListThum : 'string',
		duration: 'number',
		clsActive: 'string',
		setInterval: true,				
		timerInterval: 'value',
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
