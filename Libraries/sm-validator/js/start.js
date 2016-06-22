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
 * Website start here
 */
jQuery(document).ready(function($) {
	$('.tabs').smTabDemo();
	$('#addEmail4').click(function(){
		$('<p><label for="txt-email">Email <strong>*</strong>:</label><input type="text" maxlength="50"name="txt-email[]"></p>').insertBefore($('#txt-email', '#block-validate-4').closest('p'));
		$(window).trigger('resize');
	});
	$('#addEmail3').click(function(){
		$('<p><label for="txt-email">Email <strong>*</strong>:</label><input type="text" maxlength="50"name="txt-email[]"></p>').insertAfter($('#txt-email', '#block-validate-3').closest('p'));
		$(window).trigger('resize');
	});
	$('#addEmail2').click(function(){
		$('<p><label for="txt-email">Email <strong>*</strong>:</label><input type="text" maxlength="50"name="txt-email[]"></p>').insertAfter($('#txt-email', '#block-validate-2').closest('p'));
		$(window).trigger('resize');
	});
	$('#addEmail1').click(function(){
		$('<p><label for="txt-email">Email <strong>*</strong>:</label><input type="text" maxlength="50"name="txt-email[]"></p>').insertAfter($('#txt-email', '#block-validate-1').closest('p'));
		$(window).trigger('resize');
	});
	//CKEDITOR.replace('txt-note');
	CKEDITOR.replace('txt-note1');
	CKEDITOR.replace('txt-note2');
	CKEDITOR.replace('txt-note3');
	$('#txt-country').smSelect();
	$('#block-validate-4').smValidator({
		rules: {
			'txt-firstname': {
				init: 'firstname here',
				valid: {
					required: true,
					minLen: 8
				},								
				duration: 3000,
				message: {
					required: L10N.required.firstname,
					minLen: L10N.valid.minlength
				}				
			},
			'txt-lastname': {
				init: 'lastname here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.lastname
				}
			},
			'txt-email[]': {
				init: 'email here',
				valid: {
					required: true,
					email: /^[a-z]+\@[a-z]+\.[a-z]{1,4}$/i
				},
				message: {
					required: L10N.required.email, 
					email: L10N.valid.email
				}
			},
			'txt-password': {
				valid: {
					required: true
				},
				message: {
					required: L10N.required.password
				}
			},
			'txt-confirm-pass': {
				valid: {
					required: true,
					equalTo: 'txt-password'
				},
				message: {
					required: L10N.required.repassword,
					equalTo: L10N.valid.matchpassword
				}
			},
			'txt-phone': {
				init: 'phone here',
				allowChar: 'number',
				valid: {
					required: true,
					phone: true
				},
				message: {
					required: L10N.required.phone,
					phone: L10N.valid.phone
				}
			},
			'txt-country': {
				onElError: function(){
					$('#type-combobox').addClass('error');
				},
				onElValid: function(){
					$('#type-combobox').removeClass('error');
				},				
				valid: {
                    selected: true
				},
				message: {
					selected: L10N.required.country
				}
			},
			'txt-city': {
				init: 'city here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.city
				}
			},
			'rd-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.gender
				}
			},
			'cb-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.game
				}
			},
			'cb-2[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.place
				}
			},
			'txt-note': {
				valid: {
					required: true
				},
				message: {
					required: L10N.required.note
				}
			}			
		},
		onSubmit: function(){
			alert('validate successful');
			return true;
		},
		submitSelector: $('#test1'),
		errorOption: 4
	});	

	$('#block-validate-3').smValidator({
		rules: {			
			'txt-upload': {
				onElError: function(){
					alert('file type not allow!!!');
				},
				onElValid: function(){
					
				},					
				valid: {
					required: true,
					uploadExt: ['gif', 'jpeg', 'jpg']
				},
				message: {
					required: 'choose file to upload',
					uploadExt: 'upload extension not allowed!'
				}				
			},
			'txt-firstname': {
				init: 'firstname here',
				valid: {
					required: true,
					minLen: 8
				},								
				duration: 3000,
				message: {
					required: L10N.required.firstname,
					minLen: L10N.valid.minlength
				}				
			},
			'txt-lastname': {
				init: 'lastname here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.lastname
				}
			},
			'txt-email[]': {
				init: 'email here',
				valid: {
					required: true,
					email: /^[a-z]+\@[a-z]+\.[a-z]{1,4}$/i
				},
				message: {
					required: L10N.required.email, 
					email: L10N.valid.email
				}
			},
			'txt-password': {
				valid: {
					required: true
				},
				message: {
					required: L10N.required.password
				}
			},
			'txt-confirm-pass': {
				valid: {
					required: true,
					equalTo: 'txt-password'
				},
				message: {
					required: L10N.required.repassword,
					equalTo: L10N.valid.matchpassword
				}
			},
			'txt-phone': {
				init: 'phone here',
				allowChar: 'number',
				valid: {
					required: true,
					phone: true
				},
				message: {
					required: L10N.required.phone,
					phone: L10N.valid.phone
				}
			},
			'txt-country': {
				valid: {
					selected: true
				},
				message: {
					selected: L10N.required.country
				}
			},
			'txt-city': {
				init: 'city here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.city
				}
			},
			'rd-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.gender
				}
			},
			'cb-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.game
				}
			},
			'cb-2[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.place
				}
			},
			'txt-note': {
				valid: {
					ckeditor: true
				},
				message: {
					ckeditor: L10N.required.note
				}
			}			
		},
		onReset: function(){
			alert('on reset');
		},		
		onSubmit: function(){
			alert('validate successful');
			return true;
		},
		submitSelector: $('#test2'),
		resetSelector: $('#test3'),
		errorOption: 3
	});

	$('#block-validate-2').smValidator({
		rules: {
			'txt-upload': {
				valid: {
					required: true,
					uploadExt: ['gif', 'jpeg', 'jpg']
				},
				message: {
					required: 'choose file to upload',
					uploadExt: 'upload extension not allowed!'
				}				
			},			
			'txt-firstname': {
				init: 'firstname here',
				valid: {
					required: true,
					minLen: 8
				},								
				duration: 3000,
				message: {
					required: L10N.required.firstname,
					minLen: L10N.valid.minlength
				}				
			},
			'txt-lastname': {
				init: 'lastname here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.lastname
				}
			},
			'txt-email[]': {
				init: 'email here',
				valid: {
					required: true,
					email: /^[a-z]+\@[a-z]+\.[a-z]{1,4}$/i
				},
				message: {
					required: L10N.required.email, 
					email: L10N.valid.email
				}
			},
			'txt-password': {
				valid: {
					required: true
				},
				message: {
					required: L10N.required.password
				}
			},
			'txt-confirm-pass': {
				valid: {
					required: true,
					equalTo: 'txt-password'
				},
				message: {
					required: L10N.required.repassword,
					equalTo: L10N.valid.matchpassword
				}
			},
			'txt-phone': {
				init: 'phone here',
				allowChar: 'number',
				valid: {
					required: true,
					phone: true
				},
				message: {
					required: L10N.required.phone,
					phone: L10N.valid.phone
				}
			},
			'txt-country': {
				valid: {
					selected: true
				},
				message: {
					selected: L10N.required.country
				}
			},
			'txt-city': {
				init: 'city here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.city
				}
			},
			'rd-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.gender
				}
			},
			'cb-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.game
				}
			},
			'cb-2[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.place
				}
			},
			'txt-note': {
				valid: {
					ckeditor: true
				},
				message: {
					ckeditor: L10N.required.note
				}
			}			
		},
		onSubmit: function(){
			alert('validate successful');
			return true;
		},
		errorOption: 2
	});

	$('#block-validate-1').smValidator({
		rules: {
			'txt-firstname': {
				init: 'firstname here',
				valid: {
					required: true,
					minLen: 8
				},								
				duration: 3000,
				message: {
					required: L10N.required.firstname,
					minLen: L10N.valid.minlength
				}				
			},
			'txt-lastname': {
				init: 'lastname here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.lastname
				}
			},
			'txt-email[]': {
				init: 'email here',
				valid: {
					required: true,
					email: /^[a-z]+\@[a-z]+\.[a-z]{1,4}$/i
				},
				message: {
					required: L10N.required.email, 
					email: L10N.valid.email
				}
			},
			'txt-password': {
				valid: {
					required: true
				},
				message: {
					required: L10N.required.password
				}
			},
			'txt-confirm-pass': {
				valid: {
					required: true,
					equalTo: 'txt-password'
				},
				message: {
					required: L10N.required.repassword,
					equalTo: L10N.valid.matchpassword
				}
			},
			'txt-phone': {
				init: 'phone here',
				allowChar: 'number',
				valid: {
					required: true,
					phone: true
				},
				message: {
					required: L10N.required.phone,
					phone: L10N.valid.phone
				}
			},
			'txt-country': {
				valid: {
					selected: true
				},
				message: {
					selected: L10N.required.country
				}
			},
			'txt-city': {
				init: 'city here',
				valid: {
					required: true
				},
				message: {
					required: L10N.required.city
				}
			},
			'rd-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.gender
				}
			},
			'cb-1[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.game
				}
			},
			'cb-2[]': {
				valid: {
					checked: true
				},
				message: {
					checked: L10N.required.place
				}
			},
			'txt-note': {
				valid: {
					ckeditor: true
				},
				message: {
					ckeditor: L10N.required.note
				}
			}			
		},
		onSubmit: function(){
			alert('validate successful');
			return true;
		},
		errorOption: 1
	});

	$('#block-validate-4')
		.smValidator('addRule',{
			rules: {
				'txt-firstname': {
					init: 'test addrule',
					valid: {
						custom: /^[a-z]{6,}$/i
					},
					message: {
						custom: L10N.valid.firstname
					}
				},
				'txt-lastname': {
					init: 'test addrule2',
					valid: {
						custom: /^[a-z]{3,}$/i
					},
					message: {
						custom: 'lastname is character and min len > 3'
					}
				}				
			}
		})
		.smValidator('removeRule',{
			rules: {
				'txt-firstname': {
					valid: {
						minLen: true
					}
				}               			
			}
		});
});