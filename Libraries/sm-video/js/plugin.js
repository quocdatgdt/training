/**
 * @name smVideo
 * @description description
 * @version 1.0
 * @options
 *		option
 * @events
 *		event
 * @methods
 *		init
 *		play
 *		stop
 *		destroy
 */
;(function($, window, undefined) {
	var pluginName = 'smVideo';
	var privateVar = {
		timeout : null,		
		isFullScreen: null,
		timeoutFullscreen:null,
		checkMouse:null
		
	};
	var privateMethod = {
		minsecs: function(param){
			// var h = Math.floor((param/ (1000*60*60)) % 24);
			var m = Math.floor(Math.floor(param % 3600) / 60);
			var s = Math.floor(param % 60);
			return m + ":" + (s < 10 ? "0" : "") + s;
		},
		buffered: function(param){
			var that = param;	
			if(that.videoEl[0].buffered.length != 0){
				var maxduration = that.videoEl[0].duration;
				var currentBuffer = that.videoEl[0].buffered.end(0);
				var percentage = 100 * currentBuffer / maxduration;
				if(that.bufferedBar.length){
					that.bufferedBar.css('width',percentage + '%');
				}
			}
			that.timeout = setTimeout(function(){
				privateMethod.buffered(that);
			},500);
			
		}
	};
	

	function Plugin(element, options) {
		var that = this;
		this.element = $(element);
		if(!this.element.children().length){
			return false;
		}		
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.videoEl = this.element.find(this.options.videoEl);
		this.containerVideo = this.videoEl.parent();
		this.iconPlayBig = this.element.find(this.options.iconPlayBig);		
		this.iconPlaySmall = this.element.find(this.options.iconPlaySmall);		
		this.volumeUnmute = this.element.find(this.options.volumeUnmute);		
		this.volumeMute = this.element.find(this.options.volumeMute);
		this.iconStop = this.element.find(this.options.iconStop);
		this.iconSound = this.element.find(this.options.iconSound);
		this.iconNext = this.element.find(this.options.iconNext);
		this.iconPrev = this.element.find(this.options.iconPrev);
		this.containerListVideo = this.element.find(this.options.containerListVideo).children();		
		this.currentProcess = this.element.find(this.options.currentProcess);		
		this.bufferedBar = this.element.find(this.options.bufferedBar);		
		this.iconLoading = this.element.find(this.options.iconLoading);		
		this.durationContent = this.element.find(this.options.durationContent);		
		this.currentContent = this.element.find(this.options.currentContent);		
		this.titleVideo = this.element.find(this.options.titleVideo);		
		this.playerBar = this.element.find(this.options.playerBar);		
		this.containerSeek = this.element.find(this.options.containerSeek);		
		this.sliderVolume = this.element.find(this.options.sliderVolume);		
		this.iconFullScreen = this.element.find(this.options.iconFullScreen);		
		this.iconUnFullScreen = this.element.find(this.options.iconUnFullScreen);		
		this.containerVolumeLevel = this.element.find(this.options.containerVolumeLevel);		
		this.tooltipTime = this.element.find(this.options.tooltipTime);				
		this.containerPlayBar= null;
		this.PlayStatus = false;
		this.SoundStatus = false;
		this.indexVideo = 0;
		this.videos = [];
		this.videosmp4 = [];
		this.videosogg = [];
		if(this.containerListVideo.length){
			this.containerListVideo.each(function(index, el){
				that.videosmp4.push($(el).attr('data-srcmp4'));
				that.videosogg.push($(el).attr('data-srcogg'));
			});
		}else{
			that.videosmp4 = that.options.listVideomp4;
			that.videosogg = that.options.listVideoogg;
		}
		if($.browser.safari){
			this.videos = this.videosmp4;
		}else{
			this.videos = this.videosogg;
		}
		if(this.options.autoPlay){
			if(that.iconPlayBig.length){
				that.iconPlayBig.css('display','none');
			}
		}
		if(this.playerBar.length){
			this.containerPlayBar = this.playerBar.parent();	
		}
		this.init();
		
	};

	Plugin.prototype = {
		init: function() {
			var that = this;
			
			if(this.iconPlayBig.length){
				this.iconPlayBig.bind('click.' + pluginName, function(){
					that.play();
					return false;
				});
			}
			this.videoEl.bind('click.' + pluginName, function(){
				if(that.PlayStatus){
					that.pause();
				}else{
					that.play();
				}
				return false;
			});
			this.videoEl.bind('dblclick.' + pluginName, function(){
				if(privateVar.isFullScreen){
					that.unfullScreen();
				}else{
					that.fullScreen();
				}
				return false;
			});
			this.iconPlaySmall.bind('click.' + pluginName, function(){
				if(that.PlayStatus){
					that.pause();
				}else{
					that.play();
				}
				return false;
			});
			if(this.iconStop.length){
				this.iconStop.bind('click.' + pluginName, function(){
					that.stop();
					return false;
				});
			}
			if(this.iconSound.length){
				this.iconSound.bind('click.' + pluginName, function(){
					if(that.SoundStatus){
						that.unmute();
					}else{
						that.mute();
					}
					return false;
				});
			}
			if(this.iconNext.length){
				this.iconNext.bind('click.' + pluginName, function(){
					that.indexVideo ++;
					if(that.indexVideo == that.videos.length){
						that.indexVideo = 0;
					}
					if(that.containerListVideo.length){
						that.containerListVideo.eq(that.indexVideo).trigger('click.' + pluginName);
					}else{
						that.changeSong(that.indexVideo);
					}		
					return false;
				});
			}
			if(this.iconPrev.length){
				this.iconPrev.bind('click.' + pluginName, function(){
					that.indexVideo --;
					if(that.indexVideo < 0){
						that.indexVideo = that.videos.length - 1;
					}
					if(that.containerListVideo.length){
						that.containerListVideo.eq(that.indexVideo).trigger('click.' + pluginName);
					}else{
						that.changeSong(that.indexVideo);
					}
					return false;
				});
			}
			if(this.containerListVideo.length){
				this.containerListVideo.bind('click.' + pluginName, function(){
					that.indexVideo = $(this).index();
					that.changeSong(that.indexVideo);
					that.containerListVideo.removeClass('active');
					$(this).addClass('active');
					return false;
				});
			}
			if(this.containerSeek.length){
				this.containerSeek.bind('click.' + pluginName, function(e){					
					that.seek(e);
					return false;
				});
			}
			if(this.sliderVolume.length){
				this.sliderVolume.slider({
					orientation: that.options.orientationVolume,
					range: "min",
					min: 0,
					max: 100,
					value: that.options.defaultVolume,
					slide: function( event, ui ) {
						that.setVolume(ui.value);
					}
				});
				
			}
			if(this.iconSound.length && this.sliderVolume.length && that.options.animateVolume){
				this.iconSound.mouseenter(function(){
					clearTimeout(privateVar.timeout);
					that.sliderVolume.stop().fadeIn();
				}).mouseleave(function(){
					if(privateVar.checkMouse){
						clearTimeout(privateVar.timeout);
						return false;
					}
					privateVar.timeout = setTimeout(function(){
						that.sliderVolume.stop().fadeOut();
					},100);
				});
				that.sliderVolume.mousedown(function(){
					privateVar.checkMouse = true;
				});
				$(document).mouseup(function(){
					privateVar.checkMouse = false;
					privateVar.timeout = setTimeout(function(){
						that.sliderVolume.stop().fadeOut();
					},100);
				});
			}
			this.setVolume(that.options.defaultVolume);
			
			privateMethod.buffered(that);
			that.changeSong(0);
			if(this.options.autoPlay){
				this.play();
			}
			if(this.iconFullScreen.length){
				this.iconFullScreen.bind('click.'+pluginName,function(){
					that.fullScreen();
					return false;
				});
			}
			if(this.iconUnFullScreen.length){
				this.iconUnFullScreen.bind('click.'+pluginName,function(){
					that.unfullScreen();
					return false;
				});
			}
			$(document).keydown(function(e){
				e = e || window.event;
				if (e.keyCode == 27 && privateVar.isFullScreen) {
					that.unfullScreen();
				}
			});		
			document.addEventListener("fullscreenchange", function () {
				if(!document.fullscreen){
					that.unfullScreen();
				}
			}, false);

			document.addEventListener("mozfullscreenchange", function () {
				if(!document.mozFullScreen){
					that.unfullScreen();
				}
			}, false);

			document.addEventListener("webkitfullscreenchange", function () {
				if(!document.webkitIsFullScreen){
					that.unfullScreen();
				}
			}, false);
			
		},		
		play: function(param) {
			var that = this;
			this.videoEl[0].addEventListener('loadedmetadata', function(){
				that.videoEl[0].play();
				if(that.iconLoading.length){
					that.iconLoading.hide();
				}
				that.durationText = privateMethod.minsecs(that.videoEl[0].duration);
				if(that.durationContent.length){
					that.durationContent.html(that.durationText);
				}		
				var _src = that.videoEl[0].src;
				that.titleVideo.html(_src.substring(_src.lastIndexOf('/')+1));
			},false);	
			$.isFunction(this.options.beforePlay) && this.options.beforePlay.call(this);
			that.videoEl[0].play();	
			if(that.iconLoading.length){
				that.iconLoading.hide();
			}
			if(this.iconPlayBig.length){
				this.iconPlayBig.hide();
			}
			if(this.iconPlaySmall.length){
				this.iconPlaySmall.addClass(this.options.iconPauseClass);
			}
			this.PlayStatus = true;
			$.isFunction(this.options.played) && this.options.played.call(this);
			this.videoEl[0].addEventListener('timeupdate', function(){				
				that.currentTimeText = privateMethod.minsecs(this.currentTime);	
				if(that.tooltipTime.length){
					that.tooltipTime.html(that.currentTimeText);
					that.tooltipTime.css('left',(((this.currentTime/that.videoEl[0].duration) - (that.options.marginLeftPointTime/that.containerSeek.width())) * 100) + '%');
				}
				if(that.currentContent.length){
					that.currentContent.html(that.currentTimeText + that.options.characterBetweenTime);
				}
				if(that.currentProcess.length){
					that.currentProcess.css('width', (this.currentTime/that.videoEl[0].duration) * 100 + '%');
					if(that.options.autoNext && this.currentTime==that.videoEl[0].duration){
						if(that.iconNext.length){
							that.iconNext.trigger('click.' + pluginName);
						}else{
							that.indexVideo ++;
							if(that.indexVideo == that.videos.length){
								that.indexVideo = 0;
							}
							that.changeSong(that.indexVideo);
						}
					}
				}
			},false);			
		},
		stop: function(param) {
			var that = this;
			$.isFunction(this.options.beforeStop) && this.options.beforeStop.call(this);
			this.videoEl[0].pause();
			this.videoEl[0].currentTime = 0;
			if(this.iconPlayBig.length){
				this.iconPlayBig.show();
			}
			if(this.iconPlaySmall.length){
				this.iconPlaySmall.removeClass(this.options.iconPauseClass);
			}
			this.PlayStatus = false;
			$.isFunction(this.options.stoped) && this.options.stoped.call(this);
		},
		pause: function(param) {
			var that = this;
			$.isFunction(this.options.beforePause) && this.options.beforePause.call(this);
			this.videoEl[0].pause();
			if(this.iconPlayBig.length){
				this.iconPlayBig.show();
			}
			if(this.iconPlaySmall.length){
				this.iconPlaySmall.removeClass(this.options.iconPauseClass);
			}
			this.PlayStatus = false;
			$.isFunction(this.options.paused) && this.options.paused.call(this);
		},
		mute: function(param){
			var that = this;
			this.videoEl[0].muted = true;
			if(this.volumeUnmute.length && this.volumeMute.length){
				this.volumeUnmute.hide();
				this.volumeMute.show();
			}
			this.SoundStatus = true;
			if(this.sliderVolume.length){
				this.sliderVolume.slider('value', 0);
			}
		},
		unmute: function(param){
			var that = this;
			this.videoEl[0].muted = false;
			this.videoEl[0].volume = this.defaultVolume/100;
			if(this.volumeUnmute.length && this.volumeMute.length){
				this.volumeMute.hide();
				this.volumeUnmute.show();
			}
			this.SoundStatus = false;
			if(this.sliderVolume.length){
				this.sliderVolume.slider('value', this.defaultVolume);
			}
		},
		setVolume: function(param){
			this.defaultVolume = param;
			if(param == 0){
				this.mute();
			}else{
				this.unmute();
			}
			this.videoEl[0].volume = param/100;
			if(this.sliderVolume.length){
				this.sliderVolume.slider('value', param);
			}
			if(this.options.setVolumeLevel && this.containerVolumeLevel.length && param != 0){
				var levels = this.containerVolumeLevel.children().length,
					percentLevel = 100 / levels;
				this.containerVolumeLevel.children().each(function(index, el){
					if(index * percentLevel > param){
						$(el).hide();
					}else{
						$(el).show();
					}
				});
			}
		},
		changeSong: function(param){
			var that = this;
			if(this.iconLoading.length){
				this.iconLoading.show();
			}
			if(this.iconPlayBig.length){
				this.iconPlayBig.hide();
			}
			$.isFunction(this.options.beforeChangeVideo) && this.options.beforeChangeVideo.call(this);
			this.videoEl[0].addEventListener('loadedmetadata', function(){
				if(that.iconLoading.length){
					that.iconLoading.hide();
				}
				if(that.PlayStatus){
					that.play();
				}else{
					if(that.iconPlayBig.length){
						that.iconPlayBig.show();
					}
					that.stop();
				}
				$.isFunction(that.options.changedVideo) && that.options.changedVideo.call(this);
			},false);	
			this.videoEl[0].src = this.videos[param];	
						
		},
		seek: function(param){
			var that = this,
				leftBar = that.containerSeek.offset().left,
				seekX = param.clientX,
				seekTime = seekX - leftBar,
				processBarWidth = that.containerSeek.width(),
				percentTime = (seekTime/processBarWidth) * 100,
				seekCurrentTime = that.videoEl[0].duration * (seekTime/processBarWidth);
			that.videoEl[0].currentTime = seekCurrentTime;
			that.currentProcess.css('width', percentTime + '%');
		},
		fullScreen: function(param){
			var that = this;
			this.playerBar.appendTo('body').css({
				'z-index':2147483647,
				'position':'fixed',
				'bottom':0,
				'left':0
			}).addClass('type-fullscreen');
			this.containerSeek.css('width',that.options.playBarPecentFullscreen);
			if(this.iconFullScreen.length && this.iconUnFullScreen.length){
				this.iconFullScreen.hide();
				this.iconUnFullScreen.show();
			}	
			
			
			if (that.videoEl[0].requestFullscreen) {
				that.containerVideo[0].requestFullscreen();
			}
			else if (that.videoEl[0].mozRequestFullScreen) {
				that.containerVideo[0].mozRequestFullScreen();				
			}
			else if (that.videoEl[0].webkitRequestFullScreen) {
				that.containerVideo[0].webkitRequestFullScreen();
			}else{
				that.videoEl.appendTo('body').css('z-index',2147483641);
				if(that.PlayStatus){
					that.play();
				}
			}
			
			
			that.containerVideo.addClass('fullscreen');
			
			this.overlay = $('<div id="overplayVideo"></div>').appendTo('body').css({
				'position':'fixed',
				'width':'100%',
				'height':'100%',
				'top':0,
				'left':0,
				'background':'black',
				'z-index':1000
			});
			
			if(that.options.autoHidePlaybarFullScreen){
				privateVar.timeoutFullscreen = setTimeout(function(){
					that.playerBar.stop().animate({
						'opacity':0
					},500);
				},2000);
				that.playerBar.bind('mouseenter',function(){
					clearTimeout(privateVar.timeoutFullscreen);
					that.playerBar.stop().animate({
						'opacity':1
					},500);
				}).bind('mouseleave',function(){
					clearTimeout(privateVar.timeoutFullscreen);
					privateVar.timeoutFullscreen = setTimeout(function(){
						that.playerBar.stop().animate({
							'opacity':0
						},500);
					},1000);
				});
			}
			privateVar.isFullScreen = true;
		},
		unfullScreen: function(param){
			var that = this;
			this.playerBar.appendTo(this.containerPlayBar).css('position','').removeClass('type-fullscreen');
			this.containerSeek.css('width','');
			if(this.iconFullScreen.length && this.iconUnFullScreen.length){
				this.iconFullScreen.show();
				this.iconUnFullScreen.hide();
			}
			
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			}else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();				
			}else{
				that.videoEl.appendTo(that.containerVideo);
				if(that.PlayStatus){
					that.play();
				}
			}
			that.videoEl.parent().removeClass('fullscreen');
			if(this.overlay.length){
				this.overlay.remove();
			}
			clearTimeout(privateVar.timeoutFullscreen);
			that.playerBar.css({
				'opacity':1
			});
			that.playerBar.unbind('mouseenter');
			that.playerBar.unbind('mouseleave');
			privateVar.isFullScreen = false;
		},			
		destroy: function(param) {
			var that = this;
			if(this.iconPlayBig.length){
				this.iconPlayBig.unbind('click.' + pluginName);
			}
			this.videoEl.unbind('click.' + pluginName);
			this.iconPlaySmall.unbind('click.' + pluginName);
			if(this.iconStop.length){
				this.iconStop.unbind('click.' + pluginName);
			}
			if(this.iconSound.length){
				this.iconSound.unbind('click.' + pluginName);
			}
			if(this.iconNext.length){
				this.iconNext.unbind('click.' + pluginName);
			}
			if(this.iconPrev.length){
				this.iconPrev.unbind('click.' + pluginName);
			}
			if(this.containerListVideo.length){
				this.containerListVideo.unbind('click.' + pluginName);
			}
			if(this.containerSeek.length){
				this.containerSeek.unbind('click.' + pluginName);
			}
			if(this.sliderVolume.length){
				this.sliderVolume.slider('destroy');
				
			}
			if(this.iconSound.length && this.sliderVolume.length){
				this.iconSound.unbind('mouseenter');
			}
			if(this.options.autoPlay){
				this.stop();
			}
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
		videoEl: '#videoEL',
		iconPlayBig: '.button-play',
		iconPlaySmall: '.btn-play',
		iconPauseClass: 'btn-pause',
		iconStop: '.btn-stop',
		iconSound: '.sound',
		iconNext: '.btn-next',
		iconPrev: '.btn-pre',
		iconLoading: '.loading',
		volumeUnmute: '.volume',
		volumeMute: '.silence',
		durationContent: '.info-time span:last',
		currentContent: '',		
		containerListVideo: '.lst-video',
		currentProcess: '.time-play',
		containerSeek: '.time-count',
		bufferedBar: '.time-load',
		titleVideo: '.title-video',
		sliderVolume: '#slider-volume',
		containerVolumeLevel: '.volume',
		orientationVolume: 'vertical',
		autoNext: true,
		autoPlay: true,
		listVideomp4: [],
		listVideoogg: [],
		setVolumeLevel: true,
		defaultVolume: 50,
		playBarPecentFullscreen: '79%',
		playerBar : '.player-bar',
		iconFullScreen:'.full-screen',
		iconUnFullScreen:'.small-screen ',
		animateVolume:true,
		autoHidePlaybarFullScreen:true,
		characterBetweenTime:'',
		tooltipTime:'.info-time-play',
		marginLeftPointTime:12,
		beforePlay: function() {},
		played: function() {},
		beforeStop: function() {},
		stoped: function() {},
		beforePause: function() {},
		paused: function() {},
		beforeFullscreen: function() {},
		fullScreened: function() {},
		beforeChangeVideo: function() {},
		changedVideo: function(){}
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
