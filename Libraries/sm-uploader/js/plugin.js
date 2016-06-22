/**
 * @name sm-uploader
 * @description description
 * @version 1.0
 * @options
 *		option
 * @events
 *		event
 * @methods
 *		init 
 *		destroy
 * @depends
 * 		jquery 1.7+
 * 
 */
;(function($, window, undefined) {
	var pluginName = 'smUploader';	
	
	var guid = 1;
	
	function Uploader(element, options) {		
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		
		this.init();
	};

	Uploader.prototype = {
		
		init: function() {	
			var options = this.options;
			
			this.create();
			
			this.listenner();
		},
		
		create: function(){
			var options = this.options;			
			
			var container = $('<div></div>');			
			container.addClass(options.containerClass);
			
			if (!options.containerSize){				
				container.css({
					'width': $(this.element).outerWidth(),
					'height': $(this.element).outerHeight()
				});
			}
			else{
				container.css({
					'width': options.containerSize.width,
					'height': options.containerSize.height
				});
			}
			
			container.css(options.containerStyles);
			
			this.fileInput = $("<input type='file'/>");
			this.fileInput.attr("name", this.options.name)
						  .css(options.inputFileStyles);
			
			if (options.inputFileAttrs && typeof options.inputFileAttrs === 'object'){
				var inpAttrs = options.inputFileAttrs;
				for (var attr in inpAttrs){
					if (inpAttrs[attr] !== null){
						this.fileInput.attr(attr, inpAttrs[attr]);
					}
				}
			}
			
			container.append(this.fileInput);
			
			var wrapper = $('<div></div>');
			wrapper.addClass(options.wrapperClass)
				   .css(options.wrapperStyles);
				   
			$(this.element).wrap(wrapper);
			$(this.element).after(container);
			
			if ($.isFunction(options.onCreate)){
				options.onCreate.call(this, container);				
			}
		},
		
		listenner: function(){			
			this.fileInput.on('change.' + pluginName, $.proxy(this.beforeSend, this));
			this.fileInput.on('mouseenter.' + pluginName, $.proxy(this.mouseenter, this));
			this.fileInput.on('mouseleave.' + pluginName, $.proxy(this.mouseleave, this));			
		},
		
		beforeSend: function(){
			var options = this.options;
			
			// if ($.isFunction(options.onBeforeSend)){
				// if (!options.onBeforeSend.call(this)){
					// return false;
				// }
			// }
			
			this.sendFile.call(this, function(response){
				var body = response.find('body');
				
				var result;
				result = body.html();	
				options.onComplete(result);
			});
		},
		
		mouseenter: function(){			
			if ($.isFunction(this.options.onMouseEnter)){
				this.options.onMouseEnter.call(this);
			}
		},
		
		mouseleave:function(){
			if ($.isFunction(this.options.onMouseLeave)){
				this.options.onMouseLeave.call(this);
			}
		},
		
		error: function(){
			if ($.isFunction(options.onError)){
				options.onError.call(this);
			}
		},
		
		sendFile: function(callback) {
			var that = this;
			var fileInputClones = that.fileInput.clone();
			var form = $('<form style="display:none;"></form>');                    
            var iframe = $('<iframe src="javascript:false;" name="iframe-load-' + (guid+1) + '" ></iframe>').on('load', function(){
				iframe.off('load').on('load', function () {
					var response;						
					try {
						response = iframe.contents();
					} catch (e) {
						response = undefined;
					}
					
					callback(response);					
					
					$('<iframe src="javascript:false;"></iframe>')
						.appendTo(form);
						
					// that.container.append(that.fileInput);
					
					if (fileInputClones && fileInputClones.length){
						that.fileInput.insertAfter(fileInputClones);
						fileInputClones.remove();
					}
					form.remove();
				});	
				
				that.fileInput.after(fileInputClones);
				form.prop('target', iframe.attr('name'))
					.prop('action', that.options.url)
					.prop('method', that.options.type)
					.append(that.fileInput)
					.prop('enctype', 'multipart/form-data')					
					.prop('encoding', 'multipart/form-data');
					
				form.submit();
			});
			form.append(iframe).appendTo(document.body);
		},
		
		destroy : function(){
			this.fileInput.off('change.' + pluginName);
			this.fileInput.off('mouseenter.' + pluginName);
			this.fileInput.off('mouseleave.' + pluginName);
		},
		
		cancel : function(){
		
		},
		
		complete : function(){
		
		}
	};

	$.fn[pluginName] = function(options, params) {
		return this.each(function() {
			var instance = $.data(this, pluginName);
			if (!instance) {
				$.data(this, pluginName, new Uploader(this, options));
			} else if (instance[options]) {
				instance[options](params);
			} else {
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};

	$.fn[pluginName].defaults = {		
		url: 'http://10.0.1.105/smUploader/sm-uploader/upload.php',
		name: 'file-upload', 
		type: 'POST',
		
		/*wrapper options*/
		wrapperClass: 'file-upload-button',
		wrapperStyles: {
			position: 'relative'
		},
		
		/*container options*/
		containerClass: 'custome-upload-file',
		containerStyles: {
			position: "absolute",
			overflow: "hidden",
			opacity: 0,
			top: 0,
			left: 0
		},
		containerSize: null,
		
		/*input file options*/
		inputFileAttrs: {
			size: 1
		},
		inputFileStyles: {
			'font-size': '21px',
			'margin': '0 0 0 -52px',
			'height': '50px',
			'cursor': 'pointer'
		},
		
		/*Events options*/
		onCreate: null,
		onMouseEnter: null,
		onMouseLeave: null,
		onBeforeSend: null,
		onError: null,
		onComplete: null
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
