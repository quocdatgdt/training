/**
 * @name smPlugin
 * @description description
 * @version 1.0
 * @options	
 *		controlSectionSelector --> controls section selector. Defaults: '.list-control'. DataType: String.
 *		songSectionSelector --> songs section selector. Defaults: '.list-songs'. DataType: String.
 *		currentSong --> display index of song. Defaults: 0. DataType: int.
 *		activeClass --> display class active. Defaults: 'active'. DataType: String.
 *		hasVisible --> show/ hide audio. Defaults: true. DataType: Boolean.
 *		audioAttributes --> add attributes of audio. Ex: controls, size, preload,... Defaults: {controls: 'controls'}. DataType: Object. 
 *		dataControlAttrs --> get attribute controls on audio. Defaults: 'control'. DataType: String.
 *		dataSourceAttrs --> get attribute source on audio. Defaults: 'src'. DataType: String. 
 * @methods
 *		init
 *		updateSource --> update source audio for audio 
 *			@params: sources - String: source audio
 *		create
 *		listener
 *		setCurrentTime --> set current time audio
 *			@params: time - String: time need set 
 *		play
 *		pause
 *		progress
 *		volume
 *		error
 *		timeupdate
 *		ended
 *		abort
 *		destroy 
 *		change --> change song. 
 *			@params: song - String/ int : object element or index song  
 
 * @events
 *		onCreate --> happen when create audio
 *		onPlay --> happen when audio play
 *		onPause --> happen when audio pause
 *		onError --> happen when audio error
 *		onTimeupdate --> happen when time update
 *		onEnded --> happen when audio ended
 *		onAbort --> happen when audio abort
 *		onLoadedmetadata --> happen when audio load meta data
 *		onLoadeddata --> happen when audio load data
 *		onChange --> happen when change source
 *		onWarning --> happen when browser is not supported html5 audio
 * @methods
 *		jQuery version 1.7+
 */
;(function($, window, undefined) {
	var pluginName = 'smAudio';	
	var message = {
		hasSupport : 'Your browser does not support HTML5 audio.'
	};
	
	var hasSupport = (function(){
		var audio  = document.createElement('audio');
		return !!audio.canPlayType;
	}());
	
	function warning(){
		this.element.html(message.hasSupport);
	};
	
	var Slider = function(element, options){
		this.element = element;
		this.parent = $(element).parent();
		this.options = options || {
			onSeeking: null,
			onDone: null
		};
		this.init();
	};
	Slider.prototype = {
		init: function(){
			this.percent = 0;
			$(this.element).on('mousedown', $.proxy(this.onMouseDown, this));
		},
		
		update: function(percent){
			percent = percent || this.percent;
			$(this.element).children().eq(0).css('width', percent + '%');
		},
		
		onMouseDown: function(e){
			e.preventDefault();
			
			$(document).on('mousemove.slider', $.proxy(this.onMouseMove, this));
			$(document).on('mouseup.slider', $.proxy(this.onMouseUp, this));
			this.onMouseMove(e);
		},
		
		onMouseMove: function(e){			
			var box = this.parent,
				boxWidth = $(box).width(),
				boxLeft = $(this.element).offset().left,
				boxMaxLeft = boxLeft + boxWidth;
			
			var x = e.pageX;
			if (x > boxMaxLeft){
				x = boxMaxLeft;
			}
			else if (x < boxLeft){
				x = boxLeft;
			}
			this.percent = Math.max(0, Math.floor(((x - boxLeft)/ boxWidth) * 100));
			this.update.call(this, this.percent);
			
			if ($.isFunction(this.options.onSeeking)){
				this.options.onSeeking.call(this);
			}
		},
		
		onMouseUp: function(e){
			e.preventDefault();
			if ($.isFunction(this.options.onDone)){
				this.options.onDone.call(this);
			}
			$(document).off('mousemove.slider');
			$(document).off('mouseup.slider');
		}
	};
	
	
	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		
		if (!hasSupport){	
			
			if ($.isFunction(this.options.onWarning)){
				this.options.onWarning.call(this);
			}
			
			warning();
			
			return;
		}
		
		this.init();
	};

	Plugin.prototype = {
		init: function() {
			var options = this.options;
			
			/*create audio hidden*/
			this.audio = this.element.find('audio').get(0) || document.createElement('audio');
			
			if (options.hasVisible){
				$(this.audio).css('display', 'none');
			}
			
			$(this.audio).appendTo(this.element);
			
			if (options.audioAttributes && typeof options.audioAttributes === 'object'){
				var attributes = options.audioAttributes;
				for (var attr in attributes){
					if (attributes[attr] !== null){
						this.audio[attr] = options.audioAttributes[attr];
					}
				}
			}
			this.create();
			
			/*get element controls*/
			this.controls = this.element.find(options.controlSectionSelector);			
			
			/*get element songs*/
			this.songs = this.element.find(options.songSectionSelector);
			this.noOfSongs = this.songs.find('[data-' + options.dataSourceAttrs + ']').length;
			
			this.currentSong = options.currentSong;
			if (this.currentSong >= this.noOfSongs){
				this.noOfSongs = 0;
			}
			else if (this.currentSong < 0){
				this.noOfSongs = this.noOfSongs - 1;
			}
			
			var song = this.songs.find('[data-' + options.dataSourceAttrs + ']').eq(this.currentSong);
			var source = song.data(options.dataSourceAttrs);			
			
			this.updateSource(source);
			
			/*grant Events*/
			this.listener();
		},
		
		updateSource : function(sources){
			if (typeof sources === 'string'){
				var arrSrc = sources.split(',');				
				var html = '';
				for (var i = 0, il = arrSrc.length; i < il; i++){
					html += '<source src="' + arrSrc[i] + '" />';
				}
				$(this.audio).html(html);
			}
		},
		
		create : function(){
			if ($.isFunction(this.options.onCreate)){
				this.options.onCreate.call(this);
			}			
		},
		
		listener : function(){
			var that = this,
				options = this.options;
			
			/*delegate Events on control elements*/
			that.controls.find('[data-' + options.dataControlAttrs + ']').each(function(idx){
				var control = $(this).data(options.dataControlAttrs).toLowerCase();
				
				switch(control){
					case 'play': 
						$(this).on('click.' + pluginName, function(){
						
							switch($(this).data(options.dataControlAttrs).toLowerCase()){
								case 'play': 
									that.audio.play();;
									$(this).data(options.dataControlAttrs, 'pause');
									$(this).parent().addClass('pause');
									break;
								
								case 'pause': 
									that.audio.pause();
									$(this).data(options.dataControlAttrs, 'play');
									$(this).parent().removeClass('pause');
									break;
							}
							return false;
						});
						break;
						
					case 'seek': 
						that.seeking = new Slider(this, {
							onSeeking : function(){
								var currentTime = this.percent/100;
								that.setCurrentTime.call(that, currentTime);
							}
						});
						break;
					
					case 'time': 
						that.displayTime = $(this);						
						break;
						
					case 'volume': 
						$(this).on('click.' + pluginName, function(){
							that.volume.call(that, this);
							return false;
						});						
						break;
						
					case 'next': 
						$(this).on('click.' + pluginName, function(){
							that.next.call(that);
							return false;
						});
						break;	
						
					case 'previous': 
						$(this).on('click.' + pluginName, function(){
							that.previous.call(that);
							return false;
						});						
						break;
					
				}
			});			
			
			/*delegate Events on song elements*/
			that.songs.on('click.' + pluginName, '[data-' + options.dataSourceAttrs + ']', function(){				
				that.change.call(that, this);					
			});
			
			$(that.audio).on({
				'play' : $.proxy(that.play, that),
				'pause' : $.proxy(that.pause, that),
				'timeupdate' : $.proxy(that.timeupdate, that),
				'loadedmetadata' : $.proxy(that.loadedmetadata, that),
				'loadeddata' : $.proxy(that.loadeddata, that),
				'progress' : $.proxy(that.progress, that),
				'ended' : $.proxy(that.ended, that),
				'error' : $.proxy(that.error, that),
				'abort' : $.proxy(that.abort, that)
			});
		},

		setCurrentTime : function(time){
			var newTime = time * this.audio.duration;
			
			if (newTime == this.audio.duration){ 
				newTime = newTime - 0.1; 
			}
						
			this.audio.currentTime = newTime;
		},
		
		play : function(){		
			if ($.isFunction(this.options.onPlay)){
				this.options.onPlay.call(this);
			}
			this.updateLoadProgress.call(this);
		},
		
		pause : function(){		
			if ($.isFunction(this.options.onPause)){
				this.options.onPause.call(this);
			}
			this.updateLoadProgress.call(this);
		},
		
		progress : function(){
			if ($.isFunction(this.options.onProgress)){
				this.options.onProgress.call(this);
			}
			this.updateLoadProgress.call(this);
		},
		
		volume : function(control){
			if (this.audio.muted) { 
				this.audio.muted = false;	
				$(control).parent().removeClass('un-volumn');
			}
			else { 
				this.audio.muted = true;
				$(control).parent().addClass('un-volumn');
			}
		},
		
		error : function(){
			if ($.isFunction(this.options.onError)){
				this.options.onError.call(this);
			}
		},
		
		timeupdate : function(){
			if ($.isFunction(this.options.onTimeupdate)){
				this.options.onTimeupdate.call(this);
			}
			this.showTime.call(this, this.audio.currentTime);
			var percent = this.audio.currentTime / this.audio.duration;
			this.seeking.update(percent * 100);
		},
		
		ended : function(){		
			if ($.isFunction(this.options.onEnded)){
				this.options.onEnded.call(this);
			}			
		},
		
		abort : function(){
			if ($.isFunction(this.options.onAbort)){
				this.options.onAbort.call(this);
			}
		},
		
		empty : function(){
			if ($.isFunction(this.options.onEmpty)){
				this.options.onEmpty.call(this);
			}
		},
		
		emptied : function(){
			if ($.isFunction(this.options.onEmptied)){
				this.options.onEmptied.call(this);
			}
		},
		
		waiting : function(){
			if ($.isFunction(this.options.onWaiting)){
				this.options.onWaiting.call(this);
			}
		},
		
		loadedmetadata : function(){
			if ($.isFunction(this.options.onLoadedmetadata)){
				this.options.onLoadedmetadata.call(this);
			}
			this.updateLoadProgress.call(this);
		},
		
		loadeddata : function(){
			if ($.isFunction(this.options.onLoadedmetadata)){
				this.options.onLoadedmetadata.call(this);
			}
			this.updateLoadProgress.call(this);
		},
		
		showTime : function(seconds){
			if (seconds !== undefined) {
				var m = Math.floor(seconds/60);
				var s = Math.floor(seconds % 60);
				
				m = (m < 10) ? '0' + m : m;
				s = (s < 10) ? '0' + s : s;
				
				var time = m + ':' + s;
				if (this.displayTime.length){
					this.displayTime.html(time);
				}
			}
		},
		
		updateLoadProgress : function(){
			if (this.audio.buffered.length > 0){
				var percent = (this.audio.buffered.end(0) / this.audio.duration) * 100;
				$(this.seeking.element).children().eq(1).css('width', percent + '%');
			}
		},
		
		next : function(){			
			var index = this.currentSong + 1;
			this.change.call(this, index);			
		},
		
		previous : function(){	
			var index = this.currentSong - 1;
			this.change.call(this, index);
		},
		
		change : function(song){
			var options = this.options;
			
			this.songs.find('[data-' + options.dataSourceAttrs + ']')
					  .eq(this.currentSong)
					  .parent()
					  .removeClass(this.options.activeClass);
					  
			if (typeof song !== 'object'){	
				var index = parseInt(song, 10);
				if (index >= this.noOfSongs){
					index = 0;
				}
				else if (index < 0){
					index = this.noOfSongs - 1;
				}
				song = this.songs.find('[data-' + options.dataSourceAttrs + ']').eq(index);				
			}
			song = $(song);
			
			song.parent().addClass(options.activeClass);
			
			this.updateSource.call(this, song.data(options.dataSourceAttrs));
			
			if ($.isFunction(options.onChange)){
				options.onChange.call(this, song);
			}
			this.currentSong = this.songs.find('[data-' + options.dataSourceAttrs + ']').index(song);
		},
		
		destroy : function(){
			/*unDelegate Events on control elements*/
			this.controls.off('click.' + pluginName, '[data-' + options.dataControlAttrs + ']');			
			/*unDelegate Events on song elements*/
			this.songs.off('click.' + pluginName, '[data-' + options.dataSourceAttrs + ']');
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
		/*element selector options*/
		controlSectionSelector: '.list-control',
		songSectionSelector: '.list-songs',
		
		/*plugin options*/
		currentSong : 0,
		activeClass : 'current-song',
		hasControls : true,
		mediaType : null,
		dataControlAttrs: 'control',
		dataSourceAttrs : 'src',
		hasVisible : true,
		audioAttributes : {controls: 'controls'},
		
		/*Events options*/
		onCreate : null,
		
		onPlay : null,
		onPause : null,
		onProgress : null,
		onError : null,
		onTimeupdate : null,
		onEnded : null,
		onAbort : null,
		onEmpty : null,
		onEmptied : null,
		onWaiting : null,
		onLoadedmetadata : null,
		
		onChange : null,
		onWarning : null
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
