/**
 * @name smAccordion
 * @description description
 * @version 1.0
 * @this.options
 *		option
 * @events
 *		event
 * @methods
 *		init
 *		publicMethod
 *		destroy
 */
 
;(function($, window, undefined) {
	var pluginName = 'smAccordion';
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
			var that = this,
				options = this.options,
				elementid = $(that.element).attr('id'),
				allDivs = $(that.element).children(),
				iCurrent = options.currentcounter,
				currentDiv = allDivs[iCurrent];		
			that.alldivs_array = [];				
			$(that.element).addClass('accordionWrapper');
			$(that.element).css({overflow:"hidden"});
			
			if(options.hashid){
				$(window).bind('hashchange', function() {
					var idHash = that.getLocationHash().split('#');					
					if(idHash.length == 1){
						that.openMe(elementid+'_msTitle_' + options.defaultid, options, that);
					}					
					that.openMe(idHash[1]+'_msTitle_' + idHash[2], options, that);
				});				
			}
			
			if(options.autodelay > 0){						
				$('#'+ elementid +' > li').unbind('mouseover.'+pluginName).bind('mouseover.'+pluginName, function(){							
					that.pause(options);
			    });
				$('#'+ elementid +' > li').unbind('mouseout.'+pluginName).bind('mouseout.'+pluginName, function(){										
					that.startPlay(options, that);
				});
			}
			
			allDivs.each(function(current) {
				var _iCurrent = current,
					sTitleID = elementid+'_msTitle_'+(_iCurrent),
					sContentID = sTitleID+'_msContent_'+(_iCurrent),					
					totalChild = currentDiv.childNodes.length,
					titleDiv = $(that.element).find(allDivs[_iCurrent]).find('a.title'),
					contentDiv = $(that.element).find(allDivs[_iCurrent]).find('a.content');
				titleDiv.attr('id', sTitleID);
				contentDiv.attr('id', sContentID);
				that.alldivs_array.push(sTitleID);				
				 $("#"+sTitleID).unbind(options.event+'.'+pluginName).bind(options.event+'.'+pluginName, function(){				
					if(options.hashid){							
						that.setLocationHash($(this).attr('data-url'));
					}
					if(options.nestedChil){	
						if($(this).hasClass(options.clsActive)){
							return;
						}						
					}						
					if(options.multiopen.length){							
						if($(this).hasClass(options.clsActive)){	
							that.closeMe(sContentID, options);
							return;	
						}
					}					
					that.pause(options);
					that.openMe(sTitleID, options, that);
				});
			});	
			
			if(options.vertical) {
				that.makeVertical(elementid);
			};
			
			if(options.multiopen){
				for(var i = 0 ; i < options.multiopen.length ; i++){
					that.openMe(elementid+'_msTitle_' + options.multiopen[i], options, that);
				}
			}
			
			if(options.defaultid){				
				that.openMe(elementid+'_msTitle_' + options.defaultid, options, that);
			}
			
			if(options.autodelay > 0) {
				that.startPlay(options, that);
			};			
		},	
		getLocationHash: function(){
			return window.location.hash;
		},
		setLocationHash: function(href){
			window.location.hash = href;
		},	
		openMe: function(id, options, that) {			
			var sTitleID = id,
				_iCurrent = sTitleID.split('_')[sTitleID.split('_').length-1];				
			that.iCurrent = _iCurrent;			
			var sContentID = id+'_msContent_'+_iCurrent;						
			if($('#'+sContentID).css('display')=='none') {
				if(options.multiopen.length){					
					$('#'+sContentID).stop(true).slideDown('normal');
					$('#'+sTitleID).removeClass(options.clsDeactive);
					$('#'+sTitleID).addClass(options.clsActive);
				}else{					
					if(options.previousDiv!='') {						
						that.closeMe(options.previousDiv, options);
					}		
					if(options.vertical) {
						$('#'+sTitleID).removeClass(options.clsDeactive);
						$('#'+sTitleID).addClass(options.clsActive);
						if(options.ajax){
							$.ajax({
								'url': $('#'+sTitleID).attr('data-ajax'),
								'type': 'GET',
								beforeSend: function(){
									that.initAjaxLoad($('#'+sTitleID));
								},
								success: function(result){
									if(that.isJson(result))			
									{
										result = $.parseJSON(result);
									}
									if ($.browser.msie && parseInt($.browser.version) < 8){
										result = $.parseJSON(result);									
									}		
									that.removeAjaxLoad($('#'+sTitleID));
									$('#'+sContentID).stop(true).slideDown('normal');	
								}
							});
						}else{
							$('#'+sContentID).stop(true).slideDown('normal');
						}
					} else {						
						$('#'+sTitleID).removeClass(options.clsDeactive);
						$('#'+sTitleID).addClass(options.clsActive);
						if(options.ajax){
							$.ajax({
								'url': $('#'+sTitleID).attr('data-ajax'),
								'type': 'GET',
								beforeSend: function(){
									that.initAjaxLoad($('#'+sTitleID));
								},
								success: function(result){
									if(that.isJson(result))			
									{
										result = $.parseJSON(result);
									}
									if ($.browser.msie && parseInt($.browser.version) < 8){
										result = $.parseJSON(result);									
									}		
									that.removeAjaxLoad($('#'+sTitleID));
									$('#'+sContentID).stop(true).show('normal');
								}
							});
						}else{
							$('#'+sContentID).stop(true).show('normal');
						}							
					}
					options.currentDiv = sContentID;
					options.previousDiv = options.currentDiv;
				}
			};
			
		},
		initAjaxLoad: function(ele) {	
			var jcontainer = $(ele),
				divLoading = $('<span class="loading-content"><img alt="" src="images/loading.gif"></span>').appendTo(jcontainer);		
		},		
		removeAjaxLoad: function (ele) {
			var jcontainer = $(ele);
				jcontainer.find('.loading-content').animate({
					'opacity': 0
				}, 1000, function(){
					$(this).remove();
				})
		},	
		isJson: function(json){
			try {
				JSON.parse(json);
			} catch (e) {
				return false;
			}
			return true;
		},
		closeMe: function(div, options) {
			if(options.vertical) {				
				$('#'+div).stop(true).slideUp('normal');
				$('#'+div).prev().addClass(options.clsDeactive);
				$('#'+div).prev().removeClass(options.clsActive);
			} else {
				$('#'+div).stop(true).hide('normal');
				$('#'+div).prev().addClass(options.clsDeactive);
				$('#'+div).prev().removeClass(options.clsActive);
			};
		},
		makeVertical: function(elementid) {
			$('#'+elementid +' > ul').css({display:'block', float:'none', clear:'both'});
			$('#'+elementid +' > ul > a.title').css({display:'block', float:'none', clear:'both'});
			$('#'+elementid +' > ul > a.content').css({clear:'both'});
		},
		startPlay: function(options, that) {
			options.intervalid = setInterval(function(){
				that.play(options, that);
			}, options.autodelay);
		},
		play: function (options, that) {
			var sTitleId = that.alldivs_array[that.iCurrent];
			that.openMe(sTitleId, options, that);
			that.iCurrent++;
			if(that.iCurrent==that.alldivs_array.length) that.iCurrent = 0;
		},
		pause: function (options) {
			clearInterval(options.intervalid);
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
		currentDiv:'number',
		previousDiv:'',
		vertical: false,
		hashid:false,
		defaultid:0,
		multiopen:[],
		ajax:false,
		currentcounter:0,
		nestedChil:false,
		intervalid:0,
		clsActive:'string',
		clsDeactive: 'string',
		autodelay:0,
		event:'click',
		alldivs_array:new Array(),
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