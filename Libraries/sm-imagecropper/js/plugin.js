/**
 * @name smPlugin
 * @description description
 * @version 1.0
 * @options
 *		options
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
;(function($, window, undefined) {
	var pluginName = 'smImgCropper';
		
	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function() {
			if(!$(this.element).is('img')) return;
			var plugin = this,
				that = plugin.element,
				width = that.width = that.width(), 		// get width of img
				height = that.height = that.height(), 	// get height of img
				top = that.offset().top, 	// determine top coordinate of img
				left = that.offset().left, 	// determine left coordinate of img
				srcImg = that.srcImg = that.attr('src'), 	// leech src of img
				initCrop = that.initCrop = false,			// initiation crops img
				rightBarDrag = false,		//
				bottomBarDrag = false,		//
				leftBarDrag = false,		//
				topBarDrag = false,			//
				initDrag = false,			// init to drag
				topRightDrag = false,		//
				topLeftDrag = false,		//
				botRightDrag = false,		//
				botLeftDrag = false,		//
				dragTo = null,				// a variable is created to adjust
				topFrame = 0,				// the top space between wrapper to frame
				leftFrame = 0,				// the left space between wrapper to frame
				rightB = null,
				leftB = null,
				topB = null,
				bottomB = null,
				topRightBtn = null,
				topLeftBtn = null,
				bottomRightBtn = null,
				bottomLeftBtn = null,
				//if(!$('.jcrop-holder').length){
				// cropHolder variable is used to create the effect as if it cropped image
				cropHolder = that.cropHolder = $('<div class="jcrop-holder" style="width:'+ width +'px; height:'+ height +'px; position: relative;"></div>').insertAfter(that),
				// cropWrapper vaariable simulate crop
				cropWrapper = that.cropWrapper =	$('<div style="position: absolute; z-index: 600;top: 0px; left: 0px; ">' + 
									'<div style="width: 100%; height: 100%; z-index: 310; position: absolute; overflow: hidden; ">' +
										'<img src="'+ srcImg +'" style="border: medium none; visibility: visible; margin: 0px; padding: 0px; position: absolute; top: 0px; left: 0px; width:'+ width +'px; height:'+ height +'px;">' +
										'<div style="position: absolute; opacity: 0.4;" class="jcrop-hline"></div>' + 
										'<div style="position: absolute; opacity: 0.4;" class="jcrop-hline bottom"></div>' +
										'<div style="position: absolute; opacity: 0.4;" class="jcrop-vline right"></div>' +
										'<div style="position: absolute; opacity: 0.4;" class="jcrop-vline"></div>' +
										'<div style="position: absolute; opacity: 0.4; cursor: move; background-color: white; opacity: 0; filter:alpha(opacity: 0);" class="jcrop-tracker"></div>' +
									'</div>' +
									'<div style="width: 100%; height: 100%; z-index: 320; display: none; ">' +
										'<div style="cursor: n-resize; position: absolute; z-index: 370;" class="mTop jcrop-dragbar"></div>' +
										'<div style="cursor: s-resize; position: absolute; z-index: 371;" class="mBottom jcrop-dragbar"></div>' +
										'<div style="cursor: e-resize; position: absolute; z-index: 372;" class="mRight jcrop-dragbar"></div>' +
										'<div style="cursor: w-resize; position: absolute; z-index: 373;" class="mLeft jcrop-dragbar"></div>' +
										
										'<div style="cursor: n-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="mTop jcrop-handle"></div>' +
										'<div style="cursor: s-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="mBottom jcrop-handle"></div>' +
										'<div style="cursor: e-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="mRight jcrop-handle"></div>' +
										'<div style="cursor: w-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="mLeft jcrop-handle"></div>' +
										'<div style="cursor: nw-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="topLeft jcrop-handle"></div>' +
										'<div style="cursor: ne-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="topRight jcrop-handle"></div>' +
										'<div style="cursor: se-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="botRight jcrop-handle"></div>' +
										'<div style="cursor: sw-resize; position: absolute; z-index: 374; opacity: 0.5; width: 7px; height: 7px;" class="botLeft jcrop-handle"></div>' +
									'</div>' +
								'</div>').appendTo(cropHolder),
				cropTracker = that.cropTracker = $('<div class="jcrop-tracker" style="width: '+ width +'px; height: '+ height +'px; position: absolute; z-index: 290; cursor: crosshair; background-color: white; opacity: 0; filter:alpha(opacity: 0);" ></div>').appendTo(cropHolder),
				imgOverlay = that.imgOverlay = $('<img style="display: block; visibility: visible; width:'+ width +'px; height:'+ height +'px; border: medium none; margin: 0px; padding: 0px; position: absolute; top: 0px; left: 0px; opacity: 1;" src="'+ srcImg +'">').appendTo(cropHolder),
				//}
				// cropFrame holds all the things such as bars and btn of frame				
				imgCropped = that.imgCropped = cropWrapper.find('img'),
				cropFrame = that.cropFrame = cropWrapper.children('div').eq(1),
				// these variable is created for dragging the bars around Frame
				rightB = cropFrame.find('.mRight'),
				leftB = cropFrame.find('.mLeft'),
				topB = cropFrame.find('.mTop'),
				bottomB = cropFrame.find('.mBottom'),
				// these variable is created for dragging the buttons at corner of Frame
				topRightBtn = cropFrame.find('.topRight'),
				topLeftBtn = cropFrame.find('.topLeft'),
				bottomRightBtn = cropFrame.find('.botRight'),
				bottomLeftBtn = cropFrame.find('.botLeft');
				that.widthFrame = 0;				// width of cropWrapper
				that.heightFrame = 0;				// height of cropWrapper
				that.startedCoord = {};				// first coordinate 
				that.endedCoord = {};				// last coordinate
				//that.heightRatio = height/100;
				//that.widthRatio = width/100;
				that.moveBy = false; // boolean for moving by keys
				that.hide();
				var trackingCropper = null;
				// tracking
				if(plugin.options.tracking){
					trackingCropper = tracking(plugin.options.appendTrackingTo, srcImg);
				}
				// attach event for cropping
				cropTracker.bind({
					'mousedown.crop': function(e){
						initCrop = that.initCrop = true;
						that.moveBy = true;
						that.widthFrame = 0;
						that.heightFrame = 0;
						cropFrame.css('display', 'none');
						that.startedCoord = {
							top: e.pageY,
							left: e.pageX
						};
						$.isFunction(plugin.options.beforeCrop) && plugin.options.beforeCrop.call(that);
						return false;
					}
				});
				$(document).bind({
					'mousemove.crop': function(e){
						// this is for beginning of cropping image
						if(initCrop){
							// calculate width and height of cropWrapper
							if(e.pageX > left){
								that.endedCoord.left = e.pageX;
							}
							else if(e.pageX >= left + width){
								that.endedCoord.left = left + width;
							}
							if(e.pageY > top){
								that.endedCoord.top = e.pageY;
							}
							else if(e.pageY >= top + height){
								that.endedCoord.top = top + height;
							}
							if(plugin.options.tracking){
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.startedCoord.top - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top, that.widthFrame, that.heightFrame);
							}
							else if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.startedCoord, left, width);
								that.heightFrame = getHeightTop(e, that.startedCoord, top, height);
								var x2 = (that.endedCoord.left >= that.startedCoord.left) ? ((that.endedCoord.left <=left + width) ? (that.endedCoord.left - left) : (width)) : ((that.endedCoord.left >= left) ? (that.endedCoord.left - left) : (0)),
									y2 = (that.endedCoord.top >= that.startedCoord.top) ? ((that.endedCoord.top <=top + height) ? (that.endedCoord.top - top) : (height)) : ((that.endedCoord.top >= top) ? (that.endedCoord.top - top) : (0));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, x2, y2);
							}
							$.isFunction(plugin.options.crop) && plugin.options.crop.call(that);
						}
						// this code is wrote for dragging the frame
						else if(initDrag){
							var topT = topFrame + (e.pageY - dragTo.top),
								leftT = leftFrame + (e.pageX - dragTo.left);
							if(topT <= 0){
								topT = 0;
							}
							else if(topT + cropWrapper.height() >= cropHolder.height()){
								topT = cropHolder.height() - cropWrapper.height();
							}
							if(leftT <= 0){
								leftT = 0;
							}
							else if(leftT + cropWrapper.width() >= cropHolder.width()){
								leftT = cropHolder.width() - cropWrapper.width();
							}
							cropWrapper.css({
								top: topT,
								left: leftT
							});
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top,
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
							if(plugin.options.tracking){
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							$.isFunction(plugin.options.move) && plugin.options.move.call(that);
						}
						// this is for handling the bars around frame
						else if(rightBarDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.startedCoord, left, width);
								cropWrapper.css({
									width: that.widthFrame,
									left: getWidthLeft(e, that.startedCoord, left)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						else if(bottomBarDrag){
							if(!plugin.options.tracking){
								that.heightFrame = getHeightTop(e, that.startedCoord, top, height);
								cropWrapper.css({
									height: that.heightFrame,
									top: getHeightTop(e, that.startedCoord, top)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top
							});
						}
						else if(leftBarDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.endedCoord, left, width);
								cropWrapper.css({
									width: that.widthFrame,
									left: getWidthLeft(e, that.endedCoord, left)
								});		
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						else if(topBarDrag){
							if(!plugin.options.tracking){
								that.heightFrame = getHeightTop(e, that.endedCoord, top, height);
								cropWrapper.css({
									height: that.heightFrame,
									top: getHeightTop(e, that.endedCoord, top)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top
							});
						}
						// bind event for btns at each conner of Frame
						else if(topRightDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.startedCoord, left, width);
								that.heightFrame = getHeightTop(e, that.endedCoord, top, height);
								cropWrapper.css({
									width: that.widthFrame,
									height: that.heightFrame,
									top: getHeightTop(e, that.endedCoord, top),
									left: getWidthLeft(e, that.startedCoord, left)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top,
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						else if(topLeftDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.endedCoord, left, width);
								that.heightFrame = getHeightTop(e, that.endedCoord, top, height);
								cropWrapper.css({
									width: that.widthFrame,
									height: that.heightFrame,
									top: getHeightTop(e, that.endedCoord, top),
									left: getWidthLeft(e, that.endedCoord, left)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top,
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						else if(botRightDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.startedCoord, left, width);
								that.heightFrame = getHeightTop(e, that.startedCoord, top, height);
								cropWrapper.css({
									width: that.widthFrame,
									height: that.heightFrame,
									top: getHeightTop(e, that.startedCoord, top),
									left: getWidthLeft(e, that.startedCoord, left)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top,
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						else if(botLeftDrag){
							if(!plugin.options.tracking){
								that.widthFrame = getWidthLeft(e, that.endedCoord, left, width);
								that.heightFrame = getHeightTop(e, that.startedCoord, top, height);
								cropWrapper.css({
									width: that.widthFrame,
									height: that.heightFrame,
									top: getHeightTop(e, that.startedCoord, top),
									left: getWidthLeft(e, that.endedCoord, left)
								});
							}
							else if(plugin.options.tracking){
								if(e.pageX > left){
									that.endedCoord.left = e.pageX;
								}
								else if(e.pageX >= left + width){
									that.endedCoord.left = left + width;
								}
								if(e.pageY > top){
									that.endedCoord.top = e.pageY;
								}
								else if(e.pageY >= top + height){
									that.endedCoord.top = top + height;
								}
								that.widthFrame = Math.abs(that.startedCoord.left - getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left);
								that.heightFrame = Math.abs(that.endedCoord.top - top - (getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top));
								plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).left, getCoord(that.startedCoord, that.endedCoord, e, left, top, width, height).top);
								recordTracking(plugin, trackingCropper, topLeftBtn.offset().left + 4 - left, topLeftBtn.offset().top + 4 - top, bottomRightBtn.offset().left + 5 - left, bottomRightBtn.offset().top + 5 - top, that.widthFrame, that.heightFrame);
							}
							imgCropped.css({
								top: cropHolder.offset().top - cropWrapper.offset().top,
								left: cropHolder.offset().left - cropWrapper.offset().left
							});
						}
						if(plugin.options.tracking){
							if(initCrop == true || rightBarDrag == true ||bottomBarDrag == true 
								|| leftBarDrag == true || topBarDrag == true || initDrag == true
								|| topRightDrag == true || topLeftDrag == true ||botRightDrag == true
								|| botLeftDrag == true){
									var	xCo = cropHolder.offset().left - cropWrapper.offset().left,
										yCo = cropHolder.offset().top - cropWrapper.offset().top;
									imageTracking(trackingCropper, that.width, that.height, that.widthFrame, that.heightFrame, xCo, yCo);
								}
						}
						return false;
					},
					'mouseup.crop': function(e){
						initCrop = that.initCrop = false;
						rightBarDrag = false;
						bottomBarDrag = false;
						leftBarDrag = false;
						topBarDrag = false;
						initDrag = false;
						topRightDrag = false;
						topLeftDrag = false;
						botRightDrag = false;
						botLeftDrag = false;
						if(!that.widthFrame || !that.heightFrame){
							cropFrame.css('display', 'none');
							cropWrapper.css({
								width: 0,
								height: 0,
								display: 'none'
							});
							imgOverlay.css('opacity', '1.0');
						}
						else cropFrame.css('display', 'block');
						that.startedCoord = {
							top: topLeftBtn.offset().top + 4,
							left: topLeftBtn.offset().left + 4
						};
						that.endedCoord= {
							top: bottomRightBtn.offset().top + 5,
							left: bottomRightBtn.offset().left + 5
						};
						return false;	
					},
					'mousedown.crop': function(){
						that.moveBy = false;
					},
					'keydown.crop': function(key){
						if(that.moveBy){
							if(key.which == 40){ //down
								if(that.endedCoord.top + 1 <= top + height){
									that.startedCoord.top +=1;
									that.endedCoord.top +=1;	
									plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, that.endedCoord.left - left, that.endedCoord.top - top);
								}
							}
							else if(key.which == 38){ // up
								if(that.startedCoord.top - 1 >= top){
									that.startedCoord.top -=1;
									that.endedCoord.top -=1;	
									plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, that.endedCoord.left - left, that.endedCoord.top - top);
								}
							}
							else if(key.which == 37){ //left
								if(that.startedCoord.left - 1 >= left){
									that.startedCoord.left -=1;
									that.endedCoord.left -=1;	
									plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, that.endedCoord.left - left, that.endedCoord.top - top);
								}
							}
							else if(key.which == 39){ //right
								if(that.endedCoord.left + 1 <= left + width){
									that.startedCoord.left +=1;
									that.endedCoord.left +=1;	
									plugin.cropImage(that.startedCoord.left - left, that.startedCoord.top - top, that.endedCoord.left - left, that.endedCoord.top - top);
								}
							}
							var	xCo = cropHolder.offset().left - cropWrapper.offset().left,
								yCo = cropHolder.offset().top - cropWrapper.offset().top;
							if(trackingCropper){
								imageTracking(trackingCropper, that.width, that.height, that.widthFrame, that.heightFrame, xCo, yCo);
								recordTracking(plugin, trackingCropper, that.startedCoord.left - left, that.startedCoord.top - top, that.endedCoord.left - left, that.endedCoord.top - top, that.widthFrame, that.heightFrame);
							}	
							return false;
						}
					}
				});
				// attach event for dragging
				cropWrapper.find('.jcrop-tracker').bind({
					'mousedown.crop': function(e){
						initDrag = true;
						that.moveBy = true;
						dragTo = {
							top: e.pageY,
							left: e.pageX
						};
						topFrame = cropWrapper.offset().top - cropHolder.offset().top;
						leftFrame = cropWrapper.offset().left - cropHolder.offset().left;
						return false;
					}
				});
				// some small event to make the plugin more useful
				// event for bar
				rightB.bind({
					'mousedown.crop': function(e){
						rightBarDrag = true;
						return false;
					}
				});
				bottomB.bind({
					'mousedown.crop': function(e){
						bottomBarDrag = true;
						return false;
					}
				});
				leftB.bind({
					'mousedown.crop': function(e){
						leftBarDrag = true;
						if(plugin.options.tracking){
							that.startedCoord = {
								top: topRightBtn.offset().top + 4,
								left: topRightBtn.offset().left + 5
							};
						}
						return false;
					}
				});
				topB.bind({
					'mousedown.crop': function(e){
						topBarDrag = true;
						if(plugin.options.tracking){
							that.startedCoord = {
								top: bottomLeftBtn.offset().top + 5,
								left: bottomLeftBtn.offset().left + 4
							};
						}
						return false;
					}
				});
				// event for btn
				topRightBtn.bind({
					'mousedown.crop': function(e){
						topRightDrag = true;
						if(plugin.options.tracking){
							that.startedCoord = {
								top: bottomLeftBtn.offset().top + 5,
								left: bottomLeftBtn.offset().left + 4
							};
						}
						return false;
					}
				});
				topLeftBtn.bind({
					'mousedown.crop': function(e){
						topLeftDrag = true;
						if(plugin.options.tracking){
							that.startedCoord = {
								top: bottomRightBtn.offset().top + 5,
								left: bottomRightBtn.offset().left + 5
							};
						}
						return false;
					}
				});
				bottomRightBtn.bind({
					'mousedown.crop': function(e){
						botRightDrag = true;
						return false;
					}
				});
				bottomLeftBtn.bind({
					'mousedown.crop': function(e){
						botLeftDrag = true;
						if(plugin.options.tracking){
							that.startedCoord = {
								top: topRightBtn.offset().top + 4,
								left: topRightBtn.offset().left + 5
							};
						}
						return false;
					}
				});
				$(window).bind('resize.crop', function(){
					top = cropHolder.offset().top;
					left = cropHolder.offset().left;
				});
				(plugin.options.cropTrigger) && plugin.options.cropTriggerBtn.bind('click', function(){
					plugin.ajaxCrop();
				});
				(plugin.options.destroyTrigger) && plugin.options.destroyTriggerBtn.bind('click', function(){
					plugin.destroy();
				});
				(plugin.options.defaultCrop) && plugin.cropImage(plugin.options.cropCoord.x1, plugin.options.cropCoord.y1, plugin.options.cropCoord.x2, plugin.options.cropCoord.y2);
				(plugin.options.randomCrop) && plugin.options.triggerRandomBtn.bind('click', function(){
					plugin.cropRandom();
				});
		},
		// this function is created to crop image manually
		cropImage : function(x1, y1, x2, y2){
			var plugin = this,
				that = plugin.element,
				initCrop = that.initCrop,
				cropHolder = that.cropHolder,	
				cropWrapper = that.cropWrapper,
				cropFrame = that.cropFrame,
				imgOverlay = that.imgOverlay,
				imgCropped = that.imgCropped;
				//that.hide();
			if(x1 == x2 || y1 == y2 || x1 > this.element.width || y1 > this.element.height) return;
			var leftx2 = (x2 <= this.element.width) ? (x2) : (this.element.width),
				topy2 = (y2 <= this.element.height) ? (y2) : (this.element.height);
				that.widthFrame = Math.abs(leftx2 - x1);
				that.heightFrame = Math.abs(topy2 - y1);
			cropWrapper.css({
				width: that.widthFrame,
				height: that.heightFrame,
				display: 'block',
				top: (topy2 > y1) ? (y1) : (topy2),
				left: (leftx2 > x1) ? (x1) : (leftx2)
			});
			if(!initCrop){
				cropFrame.css('display', 'block');
			}
			imgOverlay.css('opacity', '0.6');
			imgCropped.css({
				top: cropHolder.offset().top - cropWrapper.offset().top,
				left: cropHolder.offset().left - cropWrapper.offset().left
			});
			that.startedCoord = {
				top: cropHolder.offset().top + y1,
				left: cropHolder.offset().left + x1
			};
			that.endedCoord= {
				top: cropHolder.offset().top + y2,
				left: cropHolder.offset().left + x2
			};
			that.data('parameter',{
				x1: x1,
				y1: y1,
				x2: leftx2,
				y2: topy2
			});
		},
		// ajax 
		ajaxCrop: function(){
			var plugin = this,
				that = plugin.element,
				srcImg = that.srcImg,
				data = that.data('parameter'),
				getUID = (function(){
					var id = 0;
					return function(){
						return 'ajaxCrop-' + id++;
					};
				})(),
				submitInfor = function(){
					if(plugin.options.ajax){
						if(!data || !plugin.options.ajaxUrl || that.widthFrame == 0 || that.heightFrame == 0){
							$.isFunction(plugin.options.failed) && plugin.options.failed.call(that);
							return;
						}
						var newid = getUID();
							that.iframe = $('<iframe src="javascript:false;" id="' + newid + '" name="' + newid + '"/>').css('display', 'none').appendTo(document.body),
							that.form = $('<form method="post" action="' + plugin.options.ajaxUrl + '" target="' + newid + '" enctype="multipart/form-data"></form>').css('display', 'none').appendTo(document.body);
							that.form.append('<input name="'+ plugin.options.name.src +'" value="'+ that.srcImg +'"/>');
							for (var key in data){
								that.form.append('<input name="' + plugin.options.name[key] + '" value="' + data[key] + '"/>');
							}
						if(plugin.options.data){
							for (var key in plugin.options.data){
								var pair = plugin.options.data[key];
								that.form.append('<input name="' + pair.name + '" value="' + pair.value + '"/>');
							}
						}
							that.form.submit();
						setTimeout(function(){
							that.form.remove();
							that.form = null;
						}, 100);
						
						var complete = false;
						that.iframe.bind('load', function(){
							if(this.src == "javascript:'%3Chtml%3E%3C/html%3E';" || this.src == "javascript:'<html></html>';"){
								if(complete){
									setTimeout(function(){
										that.iframe.remove();
									}, 100);
								}							
								return;
							}
							
							var doc = this.contentDocument ? this.contentDocument : window.frames[this.id].document;
							if(doc.readyState && doc.readyState != 'complete'){
							   return;
							}
							
							if(doc.body && doc.body.innerHTML == 'false'){
								return;
							}
							
							var response;
							if(doc.XMLDocument){
								response = doc.XMLDocument;
							}
							else if (doc.body){
								response = doc.body.innerHTML;
							}
							else{
								response = doc;
							}
							
							$.isFunction(plugin.options.afterCrop) && plugin.options.afterCrop.call(that, response);
							complete = true;
							this.src = "javascript:'<html></html>';";
						});
					}
				};
			submitInfor();
		},
		destroy: function(){
			var plugin = this,
				that = plugin.element;
				(that.iframe) && that.iframe.remove();
				(that.form) && that.form.remove();
				that.widthFrame = 0;
				that.heightFrame = 0;
				that.cropFrame.css('display', 'none');
				that.cropWrapper.css({
					width: that.widthFrame,
					height: that.heightFrame,
					display: 'none'
				});
				that.imgOverlay.css('opacity', '1.0');
		},
		cropRandom: function(){
			var plugin = this,
				that = plugin.element,
				x1 =  parseInt(Math.random()*that.width),
				y1 =  parseInt(Math.random()*that.height),
				x2 = parseInt(Math.random()*that.width),
				y2 = parseInt(Math.random()*that.height);
			if(x1 > x2){
				var tempX = x1;
				x1 = x2;
				x2 = tempX;
			}
			if(y1 > y2){
				var tempY = y1;
				y1 = y2;
				y2 = tempY;
			}	
			plugin.cropImage(x1, y1, x2, y2);
		}
	};
	function getHeightTop(e, coordObj, top , height){
		var heightTop;
		if(arguments.length == 4){
			heightTop = (e.pageY >= coordObj.top) ? ((e.pageY <= top + height) ? (Math.abs(coordObj.top - e.pageY)) : (Math.abs(coordObj.top - (top + height)))) : ((e.pageY >= top) ? (Math.abs(coordObj.top - e.pageY)) : (coordObj.top - top));
		}
		else if(arguments.length == 3){
			heightTop = (e.pageY >= coordObj.top) ? (coordObj.top - top) : ((e.pageY >= top) ? (Math.abs(e.pageY - top)) : (0));
		}
		return heightTop;
	};
	function getWidthLeft(e, coordObj, left , width){
		var widthLeft;
		if(arguments.length == '4'){
			widthLeft = (e.pageX >= coordObj.left) ? ((e.pageX <= left + width) ? (Math.abs(coordObj.left - e.pageX)) : (Math.abs(coordObj.left - (left + width)))) : ((e.pageX >= left) ? (Math.abs(coordObj.left - e.pageX)) : (coordObj.left - left));
		}
		else if(arguments.length == '3'){
			widthLeft = (e.pageX >= coordObj.left) ? (coordObj.left - left) : ((e.pageX >= left) ? (Math.abs(e.pageX - left)) : (0));
		}
		return widthLeft;
	};
	function getCoord(startedCoord, endedCoord, e, left, top, width, height){
		var isLeft = null,
			isTop = null;
		// a quarter of right-bottom
		if(e.pageY >= startedCoord.top && e.pageX >= startedCoord.left){
			if(Math.abs(startedCoord.left - endedCoord.left) >= Math.abs(startedCoord.top - endedCoord.top)){
				isLeft = (e.pageX - startedCoord.left <= height - (startedCoord.top - top) && e.pageX <= left + width) ? ((e.pageX <= left + width) ? (endedCoord.left - left) : (width)) : (startedCoord.left - left + (height - (startedCoord.top - top)));
				isTop = (e.pageX - startedCoord.left <= height - (startedCoord.top - top) && e.pageX <= left + width) ? ((e.pageX <= left + width) ? (startedCoord.top - top + (endedCoord.left - startedCoord.left)) : (startedCoord.top - top + (width - (startedCoord.left - left)))) : (startedCoord.top - top + (width - (startedCoord.left - left)));
			}
			else if(Math.abs(startedCoord.left - endedCoord.left) < Math.abs(startedCoord.top - endedCoord.top)){
				isTop = (e.pageY - startedCoord.top <= width - (startedCoord.left - left) && e.pageY <= top + height) ? ((e.pageY <= top + height) ? (endedCoord.top - top) : (height)) : (startedCoord.top - top + (width - (startedCoord.left - left)));
				isLeft = (e.pageY - startedCoord.top <= width - (startedCoord.left - left) && e.pageY <= top + height) ? ((e.pageY <= top + height) ? (startedCoord.left - left + (endedCoord.top - startedCoord.top)) : (startedCoord.left - left + (height - (startedCoord.top - top)))) : (startedCoord.left - left + (height - (startedCoord.top - top)));
			}
		}
		// a quarter of left-bottom
		else if(e.pageY >= startedCoord.top && e.pageX < startedCoord.left){
			if(Math.abs(startedCoord.left - endedCoord.left) >= Math.abs(startedCoord.top - endedCoord.top)){
				if(startedCoord.left - e.pageX <= startedCoord.left - left){
					if(startedCoord.left - e.pageX <= height - (startedCoord.top - top)){
						isLeft = endedCoord.left - left;
						isTop = startedCoord.top - top + (startedCoord.left - endedCoord.left);
					}
					else {
						isLeft = startedCoord.left - left - (height -(startedCoord.top - top));
						isTop = height;
					}
				}
				else if(startedCoord.left - e.pageX > startedCoord.left - left){
					isLeft = 0;
					isTop = startedCoord.top - top + (startedCoord.left - left);
					if((startedCoord.top - top) + (startedCoord.left - left) >= height){
						isLeft = startedCoord.left - left - (height - (startedCoord.top - top));
					}
				}
			}
			else if(Math.abs(startedCoord.left - endedCoord.left) < Math.abs(startedCoord.top - endedCoord.top)){
				if(e.pageY - startedCoord.top <= height - (startedCoord.top - top)){
					if(e.pageY - startedCoord.top <= startedCoord.left - left){
						isLeft = startedCoord.left - left - (endedCoord.top - startedCoord.top);
						isTop = endedCoord.top - top;
					}
					else {
						isLeft = 0;
						isTop = startedCoord.top - top + (startedCoord.left - left);
					}
				}
				else if(e.pageY - startedCoord.top > height - (startedCoord.top - top)){
					isTop = height;
					isLeft = startedCoord.left - left - (height - (startedCoord.top - top));
					if((startedCoord.left - left) - (height - (startedCoord.top - top)) <= 0){
						isTop = startedCoord.top - top + startedCoord.left - left;
						isLeft = 0;
					}
				}
			}
		}
		// a quarter of right-top
		else if(e.pageY < startedCoord.top && e.pageX >= startedCoord.left){
			if(Math.abs(startedCoord.left - endedCoord.left) >= Math.abs(startedCoord.top - endedCoord.top)){
				if(e.pageX - startedCoord.left <= startedCoord.top - top){
					if(e.pageX <= left + width){
						isLeft = endedCoord.left - left;
						isTop = startedCoord.top - top - (endedCoord.left-startedCoord.left);
					}
					else {
						isLeft = width;
						isTop = startedCoord.top - top - (width - (startedCoord.left - left));
					}
				}
				else if(e.pageX - startedCoord.left > startedCoord.top - top){
					isLeft = startedCoord.left - left + (startedCoord.top - top);
					isTop = 0;
					if(e.pageX > left + width && width -(startedCoord.left - left) < startedCoord.top - top){
						isTop = startedCoord.top - top - (width - (startedCoord.left - left));
					}
				}
			}
			else if(Math.abs(startedCoord.left - endedCoord.left) < Math.abs(startedCoord.top - endedCoord.top)){
				if(startedCoord.top - e.pageY <= width -(startedCoord.left - left)){
					if(e.pageY >= top){
						isLeft = startedCoord.left - left + (startedCoord.top - endedCoord.top);
						isTop = endedCoord.top - top;
					}
					else {
						isLeft = startedCoord.left - left + (startedCoord.top - top);
						isTop = 0;
					}
				}
				else if(startedCoord.top - e.pageY > width -(startedCoord.left - left)){
					isLeft = startedCoord.left - left + (width -(startedCoord.left - left));
					isTop = startedCoord.top - top - (width -(startedCoord.left - left));
					if(startedCoord.top - top < width -(startedCoord.left - left)){
						isTop = 0;
						isLeft = startedCoord.left - left + (startedCoord.top - top);
					}
				}
			}
		}
		// a quarter of left-top
		else if(e.pageY < startedCoord.top && e.pageX < startedCoord.left){
			if(Math.abs(startedCoord.left - endedCoord.left) >= Math.abs(startedCoord.top - endedCoord.top)){
				if(startedCoord.left - e.pageX <= startedCoord.left - left){
					if(startedCoord.left - e.pageX <= startedCoord.top - top){
						isLeft = endedCoord.left - left;
						isTop = startedCoord.top - top - (startedCoord.left - endedCoord.left);
					}
					else {
						isLeft = startedCoord.left - left - (startedCoord.top - top);
						isTop = 0;
					}
				}
				else if(startedCoord.left - e.pageX > startedCoord.left - left){
					isLeft = 0;
					isTop = startedCoord.top - top - (startedCoord.left - left);
					if((startedCoord.top - top) < (startedCoord.left - left)){
						isTop = 0;
						isLeft = startedCoord.left - left - ((startedCoord.top - top));
					}
				}
			}
			else if(Math.abs(startedCoord.left - endedCoord.left) < Math.abs(startedCoord.top - endedCoord.top)){
				if(startedCoord.top - e.pageY <= (startedCoord.top - top)){
					if(startedCoord.top - e.pageY <= startedCoord.left - left){
						isLeft = startedCoord.left - left - (startedCoord.top - endedCoord.top);
						isTop = endedCoord.top - top;
					}
					else {
						isLeft = 0;
						isTop = startedCoord.top - top - (startedCoord.left - left);
					}
				}
				else if(startedCoord.top - e.pageY > (startedCoord.top - top)){
					isTop = 0;
					isLeft = startedCoord.left - left - ((startedCoord.top - top));
					if((startedCoord.left - left) < (startedCoord.top - top)){
						isTop = startedCoord.top - top - (startedCoord.left - left);
						isLeft = 0;
					}
				}
			}
		}
		return { left:isLeft, top: isTop };
	};
	function tracking(appendTrackingTo, src){
		var tracking = $('<div class="tracking-crop"><h3 class="instructions"> Selection review</h3>' +
							'<div class="wrap-view" style="width:100px; height:100px; margin-top:0; margin-left:0"><img src="'+ src +'" /></div>' +
							'<div class="wrap-dimension">' +
								'<div class="block">' +
									'<h3>Coordinates</h3>' +
									'<ul>' +
										'<li>' +
											'<label for="x1">x1 :</label>' +
											'<input type="text" id="x1" name="x1" />' +
										'</li>' +
										'<li>' +
											'<label for="y1">y1 :</label>' +
											'<input type="text" id="y1" name="y1" />' +
										'</li>' +
										'<li>' +
											'<label for="x2">x2 :</label>' +
											'<input type="text" id="x2" name="x2" />' +
										'</li>' +
										'<li>' +
											'<label for="y2">y2 :</label>' +
											'<input type="text" id="y2" name="y2" />' +
										'</li>' +
									'</ul>' +
								'</div>' +
								'<div class="block">' +
									'<h3>Dimensions</h3>' +
									'<ul>' +
										'<li>' +
											'<label for="width">width :</label>' +
											'<input type="text" id="width" name="width" />' +
										'</li>' +
										'<li>' +
											'<label for="height">height :</label>' +
											'<input type="text" id="height" name="height" />' +
										'</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +
						'</div>').appendTo($(appendTrackingTo));
		return tracking;				
	};
	function recordTracking(plugin, trackingCropper, x1, y1, x2, y2, width, height){
		trackingCropper.find('#'+plugin.options.name.x1).val(x1);
		trackingCropper.find('#'+plugin.options.name.y1).val(y1);
		trackingCropper.find('#'+plugin.options.name.x2).val(x2);
		trackingCropper.find('#'+plugin.options.name.y2).val(y2);
		trackingCropper.find('#width').val(width);
		trackingCropper.find('#height').val(height);
	}
	function imageTracking(trackingCropper, width, height, widthFrame, heightFrame, x, y){
		var heightImg = (height*100)/heightFrame,
			widthImg = (width*100)/widthFrame;
		trackingCropper.find('img').css({
			width: widthImg,
			height: heightImg,
			'margin-top': (y*heightImg)/height,
			'margin-left': (x*widthImg)/width
		});
	};
	$.fn[pluginName] = function(options, params) {
		return this.each(function() {
			var instance = $.data(this, pluginName);
			if (!instance) {
				$.data(this, pluginName, new Plugin(this, options));
			} else if (instance[options]) {
				if($.isArray(params)){
					instance[options].apply(instance, params);
				}else{
					instance[options](params);
				}
			} else {
				$.error(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};

	$.fn[pluginName].defaults = {
		ajaxUrl: 'null',
		name: {
			x1: 'x1',
			y1: 'y1',
			x2: 'x2',
			y2: 'y2',
			src: 'srcImg'
		},
		
		data: {},
		
		defaultCrop: false,
		cropCoord:{ 
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 0,
		},
		
		randomCrop: false,
		triggerRandomBtn: 'null',
		
		ajax: false,
		cropTrigger: false,
		cropTriggerBtn: 'null',
		
		tracking: false,
		appendTrackingTo: 'null',
		
		destroyTrigger: false,
		destroyTriggerBtn: 'null',
		
		crop: function(){},
		move: function(){},
		beforeCrop: function(){},
		failed: function(){},
		afterCrop: function(){}	
	};
}(jQuery, window));