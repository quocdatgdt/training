/***********************************************************/
/***********************************************************/
/***********************************************************/
//BEGIN SMVALIDATOR LIBRARY
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
;(function($, window, undefined){
	var pluginName = 'smValidator';
	var allowCharFn = {
		number: function(keyCode){
			if($.inArray(keyCode, [8, 9, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 110, 188, 190]) === -1){
				return false;
			}
		}
	};
	var validateFn = {
		ckeditor: function(el){
			var that = this,
				ckeId = $(el).attr('id'),
				ckeData = CKEDITOR.instances[ckeId].getData();
			CKEDITOR.instances[ckeId].on('blur', function(){
				 validEl.call(that, el);
			});
			if(!ckeData.length){
				return false;
			}
		},
		uploadExt: function(el, allowExt){
			var ext = el.val().split('.').pop().toLowerCase();
			if(ext.length && $.inArray(ext, allowExt) == -1) {
				return false;
			}
		},
		required: function(el){
			var rule = getRuleOfEl.call(this, el);
			if(!/\w/i.test($.trim(el.val())) || $.trim(el.val()) == rule.init){
				return false;
			}
		},
		checked: function(el){
			if(!el.is(':checked')){
				return false;
			}
		},
		selected: function(el){
			if(!el.prop('selectedIndex')){
				return false;
			}
		},
		minLen: function(el, len){
			if($.trim(el.val()).length < len){
				return false;
			}
		},
		email: function(el, pattern){
			if(pattern === true){
				if(!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test($.trim(el.val()))){
					return false;
				}
			}
			else{
				if(!pattern.test($.trim(el.val()))){
					return false;
				}
			}
		},
		phone: function(el, pattern){
			if(pattern === true){
				if(!/^[0-9]{10,11}$/i.test($.trim(el.val()))){
					return false;
				}
			}
			else{
				if(!pattern.test($.trim(el.val()))){
					return false;
				}
			}

		},
		custom: function(el, customPattern){
			if($.isFunction(customPattern)){
				return customPattern.call(el);
			}
			else{
				return customPattern.test($.trim(el.val()));
			}
		},
		equalTo: function(el, equalTo){
			var that = this,
				equalToEle =  getEl.call(that, equalTo);
			if($.trim(el.val()) != $.trim($(equalToEle).val())){
				return false;
			}
		}
	};

	function resetFrm(frmEl){
		var that = this,
			options = that.options,
			rules = options.rules,
			rule = null,
			frmInput = frmEl.find('input,textarea,select');
		$.each(frmInput, function(){
			var frmInputType = $(this).prop('type');
			rule = getRuleOfEl.call(that, this);
			switch(frmInputType){
				case 'password':
				case 'text':
					if(rule && rule.init){
						$(this).val(rule.init);
					}
					else{
						$(this).val('');
					}
				break;
				case 'textarea':
					if(rule && rule.init){
						$(this).val(rule.init);
					}
					else{
						if($(this).siblings('#cke_' + $(this).attr('id')).length){
							CKEDITOR.instances[$(this).attr('id')].setData('');
						}
						else{
							$(this).val('');
						}
					}
				break;
				case 'file':
					var tempForm = $('#tmpFrmValid').length ? $('#tmpFrmValid') : $('<form id="tmpFrmValid"/>').css('display', 'none').appendTo(document.body),
						tempInput = $(this).clone(true);
					tempForm.append(tempInput).get(0).reset();
					$(this).after(tempInput).remove();
					tempForm.remove();
				break;
				case 'checkbox':
				case 'radio':
					$(this).prop('checked', false);
				break;
				case 'select-one':
				case 'select':
					$(this).prop('selectedIndex', 0);
				break;
			}
		});
	};

	function validEl(el){
		var that = this,
			options = that.options,
			passed = true,
			errorInputClass = options.errorInputClass,
			errorMsg = el.siblings('.' + options.errorMsgClass),
			rule = getRuleOfEl.call(that, el),
			valid = rule.valid,
			message = rule.message,
			eachMessage = null;
		el.data('passed', true);
		$.each(valid, function(key, eachValidParam){
			if(validateFn[key].call(that, el, eachValidParam) === false){
				eachMessage = message[key];
				if(jQuery.isNumeric(eachValidParam) && eachMessage.indexOf('{num}') != -1){
					eachMessage = message[key].replace(/{num}/gi, eachValidParam);
				}
				showErrorMsg.call(that, el, eachMessage);
				el.data('passed', false);
				passed = false;
			}
			if(passed){
				if(valid.ckeditor){
					el.siblings('#cke_' + el.attr('id')).removeClass(errorInputClass);
				}
				el.removeClass(errorInputClass);
				errorMsg.css('display', 'none');
			}
			else{
				return false;
			}
		});
		if(el.data('passed') === true){
			$.isFunction(rule.onElValid) && rule.onElValid.call(that, el);
		}
		else{
			$.isFunction(rule.onElError) && rule.onElError.call(that, el);
		}
		return passed;
	};

	function showErrorMsg(el, message){
		var that = this,
			options = that.options,
			option = options.errorOption,
			errorInputClass = options.errorInputClass,
			errorMsgClass = options.errorMsgClass,
			errorTotalClass = options.errorTotalClass,
			rule = getRuleOfEl.call(that, el),
			duration = rule.duration ? rule.duration : options.duration,
			errorMsg = null;
		if(rule.valid.ckeditor){
			el = el.siblings('#cke_' + el.attr('id'));
		}
		if(option == 1 || option == 3){
			if((el.is(':checkbox') || el.is(':radio')) && el.length > 1){
				el = el.first();
			}
		}
		if(option == 2){
			if((el.is(':checkbox') || el.is(':radio')) && el.length > 1){
				el = el.last();
			}
		}
		that.errorMsg = errorMsg = el.siblings('.' + errorMsgClass).length ?
			el.siblings('.' + errorMsgClass).css('display', 'block').text(message) :
			$('<label class="' + errorMsgClass + '" for="' + el.attr('id') + '">' + message + '</label>').insertAfter(el);
		that.error += '<li><label class="' + errorTotalClass + '">' + message + '</label></li>';
		el.addClass(errorInputClass);
		errorMsg.css({
			'width': 'auto',
			'z-index': 171985
		});
		if(option == 1){
			errorMsg
				.css({
					'top': el.position().top + el.outerHeight(),
					'left': el.position().left
				})
				.data('option', 1);
				setTimeout(function(){
					errorMsg.hide();
				}, duration);
		}
		if(option == 2){
			errorMsg
				.css({
					'top': el.position().top,
					'left': el.position().left + el.outerWidth()
				})
				.data('option', 2);
		}
		if(option == 3){
			errorMsg
				.css({
					'top': el.position().top + el.outerHeight(),
					'left': el.position().left
				})
				.data('option', 3);
		}
	};

	function getEl(elNameOrId){
		var formVL = this.formVL,
			el = null;
		if(/^[a-z 0-9\-]+\[\]$/i.test(elNameOrId)){
			el = formVL.find('[name="' + elNameOrId + '"]');
		}
		else{
			if(formVL.find('#' + elNameOrId).length){
				el = formVL.find('#' + elNameOrId);
			}
			if(formVL.find('[name="' + elNameOrId + '"]').length){
				el = formVL.find('[name="' + elNameOrId + '"]');
			}
		}
		return el;
	};

	function getRuleOfEl(elNameOrId){
		return this.options.rules[$(elNameOrId).attr('id')] || this.options.rules[$(elNameOrId).attr('name')];
	};

	function Plugin(element, options){
		this.formVL = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function(){
			var that = this,
				options = that.options,
				submitSelector = options.submitSelector,
				resetSelector = options.resetSelector,
				errorMsgClass = options.errorMsgClass,
				errorInputClass = options.errorInputClass,
				errorContainer = options.errorContainer,
				rules = options.rules,
				formVL = that.formVL,
				formId = formVL.attr('id');
			if(submitSelector.length){
				submitSelector
					.off('click.validate')
					.on('click.validate', function(evt){
						formVL.submit();
						evt.preventDefault();
					});
			}
			if(resetSelector.length){
				resetSelector
					.off('click.validate')
					.on('click.validate', function(evt){
						formVL.get(0).reset();
						evt.preventDefault();
					});
			}
			$.each(rules, function(name, rule){
				var el = getEl.call(that, name);
				el
					.val(function(index, value){
						if(!$(this).is('input[type="file"]')){
							if(rule.init){
								return rule.init;
							}
							else{
								return value;
							}
						}
					});
			});
			$(window)
				.off('resize.validate' + formId)
				.on('resize.validate' + formId, function(){
					var errorMsg = formVL.find('.' + errorMsgClass),
						eachErrorMsg = null,
						el = null;
					for(var i = 0, len = errorMsg.length; i < len; i++){
						eachErrorMsg = errorMsg.eq(i);
						el = eachErrorMsg.siblings('.' + errorInputClass);
						if(eachErrorMsg.is(':visible')){
							if(eachErrorMsg.data('option') == 1 || eachErrorMsg.data('option') == 3){
								eachErrorMsg.css({
									'top': el.position().top + el.outerHeight(),
									'left': el.position().left
								});
							}
							if(eachErrorMsg.data('option') == 2){
								eachErrorMsg.css({
									'top': el.position().top,
									'left': el.position().left + el.outerWidth()
								});
							}
						}
					}
				});
			formVL
				.off('focus.validate blur.validate keydown.validate keyup.validate change.validate', 'input[type="text"], input[type="password"], textarea')
				.on({
					'focus.validate' : function(){
						var val = $(this).val(),
							rule = getRuleOfEl.call(that, this);
						rule && rule.init && ($.trim(val) == rule.init) && $(this).val('');
					},
					'blur.validate' : function(){
						var val = $(this).val(),
							rule = getRuleOfEl.call(that, this);
						if(rule){
							rule.init && ($.trim(val) == '') && $(this).val(rule.init);
							validEl.call(that, $(this));
						}
					},
					'keyup.validate change.validate' : function(evt){
						var rule = getRuleOfEl.call(that, this);
						rule && validEl.call(that, $(this));
					},
					'keydown.validate': function(evt){
						var rule = getRuleOfEl.call(that, this);
						if(rule && rule.allowChar){
							if(allowCharFn[rule.allowChar].call(this, evt.which) === false){
								evt.preventDefault();
							}
						}
					}
				}, 'input[type="text"], input[type="password"], textarea')
				.off('click.validate', 'input[type="radio"], input[type="checkbox"]')
				.on('click.validate', 'input[type="radio"], input[type="checkbox"]', function(){
					var rule = getRuleOfEl.call(that, this),
						el = getEl.call(that, $(this).attr('name'));
					rule && validEl.call(that, el);
				})
				.off('change.validate change.smSelect', 'select')
				.on('change.validate change.smSelect', 'select', function(){
					var rule = getRuleOfEl.call(that, this);
					rule && validEl.call(that, $(this));
				})
				.off('change', 'input[type="file"]')
				.on('change', 'input[type="file"]', function(){
					var rule = getRuleOfEl.call(that, this);
					rule && validEl.call(that, $(this));
				})
				.off('submit.validate reset.validate')
				.on({
					'submit.validate': function(evt){
						//evt.preventDefault();
						var eachIsValid = true,
							allIsValid = true,
							el = null,
							options = that.options,
							option = options.errorOption,
							errorInputClass = options.errorInputClass,
							errorContainer = options.errorContainer;
						that.error = '';
						$.each(rules, function(name, rule){
							el = getEl.call(that, name);
							if(el.length > 1 && el.is('input[type="text"]')){
								$.each(el, function(index, eachEl){
									eachIsValid = validEl.call(that, $(eachEl));
									allIsValid = allIsValid && eachIsValid;
								});
							}
							else{
								eachIsValid = validEl.call(that, el);
								allIsValid = allIsValid && eachIsValid;
							}
							if(option == 4){
								errorContainer.html(that.error).wrapInner('<ol/>');
							}
							if(option == 1 && !eachIsValid){
								return false;
							}
						});
						formVL.find('.' + errorInputClass).first().focus();
						if(allIsValid){
							return options.onSubmit.call(that);
						}
						else{
							return false;
						}
					},
					'reset.validate': function(evt){
						var el = null;
						$.each(rules, function(name, rule){
							el = getEl.call(that, name);
							el.removeClass(errorInputClass);
							formVL.find('.' + errorMsgClass).css('display', 'none');
							formVL.find('.' + errorInputClass).removeClass(errorInputClass);
							errorContainer.html('');
						});
						resetFrm.call(that, formVL);
						$.isFunction(that.options.onReset) && that.options.onReset.call(that);
						//evt.preventDefault();
					}
				});
		},
		addRule: function(options){
			var that = this,
				el = null,
				addRules = options.rules,
				rules = that.options.rules;
			$.each(addRules, function(name, rule){
				el = getEl.call(that, name);
				if(rules[name]){
					$.extend(true, rules[name], rule);
				}
				else{
					rules[name] = rule;
				}
				el.val(rule.init);
			});
		},
		removeRule: function(options){
			var that = this,
				removeRules = options.rules,
				rules = that.options.rules;
			$.each(removeRules, function(name, rule){
				$.each(rule.valid, function(key, value){
					delete rules[name].valid[key];
					delete rules[name].message[key];
				});
			});
		},
		destroy: function(){
			var that = this,
				options = that.options,
				errorMsgClass = options.errorMsgClass,
				errorInputClass = options.errorInputClass,
				formVL = that.formVL,
				el = null,
				rules = options.rules,
				rule = null;
			formVL.off('.validate', 'input, textarea, select');
			formVL.off('.validate');
			$(window).off('.validate');
			formVL.find('.' + errorMsgClass).remove();
			$.each(rules, function(name, rule){
				el = getEl.call(that, name);
				el.removeClass(errorInputClass);
				el.data('option') && el.removeData('option');
			});
			options.errorContainer.html('');
			formVL.removeData(pluginName);
			formVL.get(0).reset();
		}
	};
	$.fn[pluginName] = function(options, params){
		return this.each(function(){
			var instance = $.data(this, pluginName);
			if(!instance){
				$.data(this, pluginName, new Plugin(this, options));
			}
			else if(instance[options]){
				instance[options](params);
			}
			else{
				console.warn(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
			}
		});
	};
	$.fn[pluginName].defaults = {
		onSubmit: function(){
			return true;
		},
		onReset: function(){
		},
		rules: false,
		submitSelector: false,
		resetSelector: false,
		duration: 2000,
		errorOption: 1,
		errorContainer: $('#errorContainer'),
		errorTotalClass: 'alert-total',
		errorMsgClass: 'alert-layer',
		errorInputClass: 'error'
	};
}(jQuery, window));
//END SMVALIDATOR LIBRARY
/***********************************************************/
/***********************************************************/
/***********************************************************/

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
		init: function() {

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
		option: 'value'
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

/***********************************************************/
/***********************************************************/
/***********************************************************/
//BEGIN SMSELECT LIBRARY
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
;(function($, window, undefined){
	var pluginName = 'smSelect';

	function createlistDL(){
		var that = this,
			originDL = that.originDL,
			ul = '',
			li = '',
			allOption = originDL.find('option'),
			eachOption = null,
			originDLName = originDL.attr('name');
		if(!$('#' + originDLName + '-list').length){
			for(var i = 0, len = allOption.length; i < len; i++){
				eachOption = allOption.eq(i);
				li += that.liTemplate
					.replace(/{value}/gi, eachOption.attr('value'))
					.replace(/{text}/gi, eachOption.text());
			}
			ul = '<ul>' + li + '</ul>';
			return $(ul).appendTo(document.body).attr('id', originDLName + '-list');
		}
		else{
			return $('#' + originDLName + '-list');
		}
	}

	function checkReverseDisplay(){
		var that = this,
			listDL = that.listDL,
			handlerDL = that.handlerDL,
			windowHeight = $(window).height(),
			windowScrollTop = $(window).scrollTop(),
			listDLTop = parseInt(listDL.css('top')),
			listDLHeight = listDL.outerHeight(),
			handlerDLHeight = handlerDL.outerHeight();
		if(listDLTop + listDLHeight > (windowHeight + windowScrollTop)){
			listDL.css({
				'top': '-=' + (listDLHeight + handlerDLHeight)
			});
		}
	}

	function Plugin(element, options){
		this.originDL = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.init();
	};

	Plugin.prototype = {
		init: function(){
			var that = this,
				listDL = null,
				handlerDL = null,
				outputDL = null,
				originDL = that.originDL,
				hoverIndex = null,
				options = that.options,
				timeout = 500,
				initClass = options.initClass,
				hoverClass = options.hoverClass,
				onChange = options.onChange,
				generateHandler = options.generateHandler,
				handlerClass = options.handlerClass,
				nativeMenu = options.nativeMenu,
				originDLName = originDL.attr('name'),
				currentSelectText = null;
			that.liTemplate = options.liTemplate;
			that.lockHover = false;
			that.opened = false;
			that.handlerDL = handlerDL = originDL.closest('.' + handlerClass);
			that.outputDL = outputDL = originDL.closest('.' + handlerClass).children('span');
			that.disable(false);
			if(generateHandler){
				if(!handlerDL.length){
					originDL.wrap('<div class="' + handlerClass + '"/>');
					that.handlerDL = handlerDL = originDL.closest('.' + handlerClass);
					handlerDL
						.prepend('<a href="javascript:void(0);" title=""/>')
						.prepend('<span/>');
					that.outputDL = outputDL = originDL.closest('.' + handlerClass).children('span');
				}
			}
			if(!nativeMenu){
				if(options.labelOption){
					originDL.prepend('<option value="">' + options.labelOption + '</option>');
				}
				that.listDL = listDL = createlistDL.call(that);
				originDL.css('display', 'none');
				listDL
					.addClass(initClass)
					.css({
						'position': 'absolute',
						'z-index': 171985,
						'max-height': options.height,
						'overflow-y': 'auto',
						'display': 'none'
					})
					.off('click.smSelect hover', 'li')
					.on({
						'click.smSelect': function(evt){
							var allLi = listDL.find('li');
							if(!that.disableToggle){
								that.select(allLi.index(this));
								evt.preventDefault();
							}
						},
						'hover': function(evt){
							var currentHover = listDL.find('.' + hoverClass);
							if(that.lockHover == false){
								if(evt.type == 'mouseenter'){
									currentHover.removeClass(hoverClass);
									$(this).addClass(hoverClass);
								}
								if(evt.type == 'mouseleave'){
									$(this).removeClass(hoverClass);
								}
							}
						}
					}, 'li')
					.off('mouseenter.smSelect mouseleave.smSelect')
					.on({
						'mouseenter.smSelect': function(){
							clearTimeout(that.timeout);
						},
						'mouseleave.smSelect': function(){
							clearTimeout(that.timeout);
							that.timeout = setTimeout(function(){
								!that.disableToggle && that.opened && that.close();
							}, timeout);
						}
					});
				handlerDL
					.off('click.smSelect mouseenter.smSelect mouseleave.smSelect')
					.on({
						'click.smSelect': function(){
							listDL.is(":hidden") ? that.open() : that.close();
						},
						'mouseenter.smSelect': function(){
							clearTimeout(that.timeout);
						},
						'mouseleave.smSelect': function(){
							clearTimeout(that.timeout);
							that.timeout = setTimeout(function(){
								!that.disableToggle && that.opened && that.close();
							}, timeout);
						}
					});
				$(document)
					.off('keydown.' + originDLName)
					.on('keydown.' + originDLName, function(evt){
						var hoverClass = options.hoverClass,
							allLi = listDL.find('li'),
							minCount = 0,
							maxCount = allLi.length - 1,
							currentHover = listDL.find('.' + hoverClass),
							hoverIndex = allLi.index(currentHover),
							hoverIndexTop = allLi.eq(hoverIndex).position().top,
							liHeight = allLi.eq(hoverIndex).height(),
							maxScrollTop = allLi.eq(maxCount).position().top,
							listDLScrollTop = listDL.scrollTop(),
							listDLHeight = listDL.height();
						if(that.opened == true){
							that.lockHover = true;
							clearTimeout(that.clearLockHover);
							that.clearLockHover = setTimeout(function(){
								that.lockHover = false;
							}, timeout);
							switch(evt.which){
								case 38:
									(hoverIndex >= minCount) && hoverIndex--;
									(hoverIndex < minCount) && (hoverIndex = maxCount);
									if(hoverIndexTop < liHeight){
										listDL.scrollTop(listDLScrollTop - 5 * liHeight);
									}
									if(hoverIndex == maxCount){
										listDL.scrollTop(maxScrollTop);
									}
									currentHover.removeClass(hoverClass);
									allLi.eq(hoverIndex).addClass(hoverClass);
									evt.preventDefault();
								break;
								case 40:
									(hoverIndex <= maxCount) && hoverIndex++;
									(hoverIndex > maxCount) && (hoverIndex = minCount);
									if(hoverIndexTop > (listDLHeight - liHeight)){
										listDL.scrollTop(listDLScrollTop + 5 * liHeight);
									}
									if(hoverIndex == minCount){
										listDL.scrollTop(0);
									}
									currentHover.removeClass(hoverClass);
									allLi.eq(hoverIndex).addClass(hoverClass);
									evt.preventDefault();
								break;
								case 13:
									that.select(hoverIndex);
									evt.preventDefault();
								break;
								case 32:
									evt.preventDefault();
								break;
							}
						}
					});
				$(window)
					.off('resize.smSelect' + originDLName)
					.on('resize.smSelect' + originDLName, function(){
						that.reposition();
					});
			}
			originDL
				.off('change.smSelect')
				.on('change.smSelect', function(){
					currentSelectText = originDL.find('option:selected').text();
					if(!that.disableToggle){
						outputDL.text(currentSelectText);
						$.isFunction(onChange) && onChange.call(that);
					}
				});
			originDL.prop('selectedIndex', 0);
			currentSelectText = originDL.find('option:selected').text();
			outputDL.text(currentSelectText);
		},
		reposition: function(){
			var that = this,
				options = that.options,
				deltaTop = options.deltaTop,
				deltaLeft = options.deltaLeft,
				deltaWidth = options.deltaWidth,
				originDL = that.originDL,
				listDL = that.listDL,
				handlerClass = options.handlerClass;
			handlerDL = originDL.closest('.' + handlerClass);
			listDL
				.css({
					'top': handlerDL.offset().top + handlerDL.outerHeight(true) + deltaTop,
					'left':  handlerDL.offset().left + deltaLeft,
                    'width': handlerDL.outerWidth(true) + deltaWidth
				});
		},
		update: function(params){
			var that = this,
				originDL = that.originDL,
				li = '',
				listDL = that.listDL,
				allOption = null,
				eachOption = null;
			originDL.html(params.option);
			allOption = originDL.find('option');
			for(var i = 0, len = allOption.length; i < len; i++){
				eachOption = allOption.eq(i);
				li += params.liTemplate
					.replace(/{value}/gi, eachOption.attr('value'))
					.replace(/{text}/gi, eachOption.text());
			}
			listDL.html(li);
		},
		disable: function(option){
			var that = this,
				handlerDL = that.handlerDL,
				disableClass = that.options.disableClass;
			that.disableToggle = option;
			if(that.disableToggle){
				handlerDL.addClass(disableClass);
			}
			else{
				handlerDL.removeClass(disableClass);
			}
		},
		open: function(){
			var that = this,
				listDL = that.listDL,
				options = that.options,
				animation = options.animation,
				duration = options.duration;
			if(!that.disableToggle && !that.opened){
				that.reposition();
				checkReverseDisplay.call(that);
				$.isFunction(options.onBeforeOpen) && options.onBeforeOpen.call(that);
				if(animation){
					listDL.slideDown(duration, function(){
						that.opened = true;
						$.isFunction(options.onAfterOpen) && options.onAfterOpen.call(that);
					});
				}
				else{
					listDL.css('display', 'block');
					that.opened = true;
					$.isFunction(options.onAfterOpen) && options.onAfterOpen.call(that);
				}

			}
		},
		close: function(){
			var that = this,
				listDL = that.listDL,
				options = that.options,
				hoverClass = options.hoverClass,
				duration = options.duration,
				animation = options.animation;
			if(!that.disableToggle && that.opened){
				listDL.find('.' + hoverClass).removeClass(hoverClass);
				$.isFunction(options.onBeforeClose) && options.onBeforeClose.call(that);
				if(animation){
					listDL.slideUp(duration, function(){
						that.opened = false;
						$.isFunction(options.onAfterClose) && options.onAfterClose.call(that);
					});
				}
				else{
					listDL.css('display', 'none');
					that.opened = false;
					$.isFunction(options.onAfterClose) && options.onAfterClose.call(that);
				}
			}
		},
		select: function(index){
			var that = this,
				options = that.options,
				listDL = that.listDL,
				originDL = that.originDL,
				currentIndex = originDL.prop('selectedIndex'),
				activeClass = options.activeClass
				onSelect = options.onSelect;
			if(!that.disableToggle){
				listDL.find('.' + activeClass).removeClass(activeClass);
				listDL.find('li').eq(index).addClass(activeClass);
				$.isFunction(onSelect) && onSelect.call(that, index);
				if(index != currentIndex){
					originDL
						.prop('selectedIndex', index)
						.trigger('change.smSelect');
				}
				that.close();
			}
		},
		reset: function(resetCallback){
			var that = this,
				originDL = that.originDL,
				options = that.options,
				hoverClass = options.hoverClass,
				activeClass	= options.activeClass;
			if(!that.disableToggle){
				that.select(0);
				originDL.find('.' + hoverClass).removeClass(hoverClass);
				originDL.find('.' + activeClass).removeClass(activeClass);
				$.isFunction(resetCallback) && resetCallback.call(that);
			}
		},
		destroy: function(){
			var that = this;
			if(!that.disableToggle){
				$(document).off('keydown.' + that.originDL.attr('name'));
				that.handlerDL.off('.smSelect');
				that.listDL.off('.smSelect').remove();
				that.originDL.removeData(pluginName);
			}
		}
	};

	$.fn[pluginName] = function(options, params){
		return this.each(function(){
			var instance = $.data(this, pluginName);
			if(!instance){
				$.data(this, pluginName, new Plugin(this, options));
			}
			else if(instance[options]){
				instance[options](params);
			}
			else{
				console && console.warn('This method does not exists in ' + pluginName);
			}
		});
	};
	$.fn[pluginName].defaults = {
		liTemplate: '<li value="{value}"><a href="#">{text}</a></li>',
		labelOption: null,
		generateHandler: true,
		handlerClass: 'type-combobox',
		deltaTop: 0,
		deltaLeft: 0,
		deltaWidth: 0,
		height: 300,
		animation: true,
		nativeMenu: false,
		initClass: 'dropdown-list',
		hoverClass: 'hover',
		activeClass: 'active',
		disableClass: 'disable',
		duration: 300,
		onBeforeOpen: null,
		onAfterOpen: null,
		onBeforeClose: null,
		onAfterClose: null,
		onChange: null,
		onSelect: null
	};
}(jQuery, window));
//INSTANCE
	//this.originDL: origin dropdownlist,
	//this.listDL: custom dropdownlist,
	//this.outputDL: ouput text or value,
	//this.handlerDL: click to show dropdowlist
//END SMSELECT LIBRARY
/***********************************************************/
/***********************************************************/
/***********************************************************/
