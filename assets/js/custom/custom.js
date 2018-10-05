//Когда документ загрузился в браузер
//$(document).ready(function() {

var accountTemplate;
var billTemplate;

var billData;

//var nowDate = new Date();
var prevDate = new Date();
var beforePrevDate = new Date();
prevDate.setMonth(prevDate.getMonth() - 1);
beforePrevDate.setMonth(beforePrevDate.getMonth() - 2);
var dateFormatOptions = {
  year: 'numeric',
  month: 'long',
  timezone: 'UTC'
};
var prevMonth = prevDate.toLocaleString("ru", dateFormatOptions);
var beforePrevMonth = beforePrevDate.toLocaleString("ru", dateFormatOptions);

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

	        		billData = {
	        			'prevMonth' : prevMonth,
	        			'accountCode' : resp.accountDetails.code,
	        			'fio' : resp.accountDetails.fio,
	        			'address' : resp.accountDetails.address,
	        			'titleLong' : resp.accountBills[0].titleLong,
	        			'titleShort' : resp.accountBills[0].titleShort,
	        			'volume' : resp.accountBills[0].volume,
	        			'tariff' : resp.accountBills[0].tariff,
	        			'amountToBePaid' : resp.accountBills[0].amountToBePaid
	        		};

	        		$.get('/template/templates/account-template.hogan', function(templates){
	        			
			            accountTemplate = $(templates).find('#account-template').html();
			            billTemplate = $(templates).find('#bill-template').html();
			            //console.log(billTemplate);
			            var template = Hogan.compile(accountTemplate);

			            
						/*resp[currentData] = {
							'prevDate' : prevDate.toLocaleString("ru", dateFormatOptions),
							'beforePrevDate' : beforePrevDate.toLocaleString("ru", dateFormatOptions)
						};*/
						//console.log(prevDate.toLocaleString("ru", dateFormatOptions));
						//console.log(beforePrevDate.toLocaleString("ru", dateFormatOptions));

			            var rendered = template.render(resp);
			            $('#account-container').html(rendered);

			            //console.log($('#bill-section').find('#prevMonth'));
			            //console.log($('#bill-section').find('#beforePrevMonth'));
			            $('#prevMonth').text(prevDate.toLocaleString("ru", dateFormatOptions));
			            $('#beforePrevMonth').text(beforePrevDate.toLocaleString("ru", dateFormatOptions));

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

						$("input[name=print-bill]").click(function(ev){
							ev.preventDefault();
							var template = Hogan.compile(billTemplate);
							//alert("Test");
							/*var billData = {
								'test':'test1'
							};*/
							var rendered = template.render(billData);
			            	//$('#account-container').html(rendered);
							//console.log(rendered);
							var WinPrint = null;
							WinPrint = window.open('','','left=0,top=0,width=400,height=200,toolbar=0,scrollbars=1,status=0');
							if(WinPrint != null)
							  {
						  		WinPrint.document.write(rendered);
							  }
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