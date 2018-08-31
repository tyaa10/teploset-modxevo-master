//Когда документ загрузился в браузер
//$(document).ready(function() {
if($('#websigninfrm').length > 0){

	var signInFormValidate = function(){

		var currentLang =
			($('body').attr('lang') === 'ua') ? 'uk' : $('body').attr('lang');
		console.log(currentLang);
		$('#websigninfrm').validate({
	        rules: {
	        	code: {
	                required: true
	                , minlength: 6
	                , maxlength: 6
	                , digits: true
	            },
	            surname: {
	            	required: true
	            }
	        },
	        lang: currentLang
	        /*messages: {
	        	code: {
	                required: "Required"
	                , minlength: "Enter six (6) digits please"
	                , maxlength: "Enter six (6) digits please"
	                , digits: "Enter only digits please"
	            },
	        	surname: {
	                required: "Required"
	            }
	        }*/
	    });
	};

	signInFormValidate();

	var signInSubmit = function(init){

		if ($('#websigninfrm').valid() || init == "init") {

			//var formData = $('#websigninfrm').serializeArray();
			//formData.push({name: 'action', value: 'fetch-by-id'});
        	//console.log(formData);

        	$.ajax({
	            url: "/accounts",
	            dataType: 'json',
	            type: "POST",
	            data: {
	            	'action': 'fetch-all-by-id'
	            	, 'code': $('#websigninfrm').find('#code').val()
	            	, 'surname': encodeURIComponent($('#websigninfrm').find('#surname').val())
	            	, 'lang': $('body').attr('lang')
	            	//, 'surname': $('#websigninfrm').find('#surname').val()
	            },
	            cache : false
	        }).done(function(resp) {
	        	
	        	if (resp == "not_found") {

	        		alert("account not found");
	        	} else if (resp == "no_session") {

	        	} else {

	        		$.get('/template/templates/account-template.hogan', function(templates){
	        			
			            var extTemplate = $(templates).filter('#account-template').html();
			            var template = Hogan.compile(extTemplate);
			            var rendered = template.render(resp);
			            $('#account-container').html(rendered);

			            $("#logout").click(function(ev){
							ev.preventDefault();
							$.ajax({
						            url: "/accounts",
						            dataType: 'json',
						            type: "POST",
						            data: {
						            	'action': 'logout'
						            },
						            cache : false
						        }).done(function(resp) {

						        	if (resp == "logout") {

						        		window.location = "/";
						        	}
						        });
						});
					}, 'html');
	        	}
	        	//$('#websigninfrm').find('#code').val('');
	        	//$('#websigninfrm').find('#surname').val('');
			});
	    }
	};

	var onSignInSubmit = function(ev){

		ev.preventDefault();

		signInSubmit();
	};

	$('#websigninfrm').submit(onSignInSubmit);

	signInSubmit('init');
}
//});