$(document).on('click', '#signup-show-password', function () {
    let passwordSignUp=$(this).parent().find("#userPassword");
    if (passwordSignUp.attr('type')==="password"){
        passwordSignUp.attr('type', "text");
    }else passwordSignUp.attr('type', "password");
});

$(document).on('click', '#is-delivery-man', function () {
    console.log('ed')
    if($(this).is(":checked")){
        $('.is-client').css({
            "display":"none"
        })
    }else{
        $('.is-client').css({
            "display":"block"
        })
    }
});