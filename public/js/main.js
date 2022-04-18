$(document).on('click', '#signup-show-password', function () {
    let passwordSignUp=$(this).parent().find("#userPassword");
    if (passwordSignUp.attr('type')==="password"){
        passwordSignUp.attr('type', "text");
    }else passwordSignUp.attr('type', "password");
});