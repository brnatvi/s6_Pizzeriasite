$(document).on('click', '#signup-show-password', function () {
    let passwordSignUp=$(this).parent().find("#userPassword");
    if (passwordSignUp.attr('type')==="password"){
        passwordSignUp.attr('type', "text");
    }else passwordSignUp.attr('type', "password");
});

$(document).on('click', '#signup-show-password-livraison', function () {
    let passwordSignUp=$(this).parent().find("#livraisonPassword");
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

$(document).on('click', '#switch-connection-signin', function () {
    $("#livraisonsignin-form").css({"display":"none"});
    $("#livraisonsignup-form").css({"display":"block"});
});

$(document).on('click', '#switch-connection-signup', function () {
    $("#livraisonsignup-form").css({"display":"none"});
    $("#livraisonsignin-form").css({"display":"block"});
});

$(document).on('click', '#switch-signin-modal-content', function () {
    $("#signin-modal-content").css({"display":"none"});
    $("#signup-modal-content").css({"display":"block"});
});

$(document).on('click', '#switch-signup-modal-content', function () {
    $("#signup-modal-content").css({"display":"none"});
    $("#signin-modal-content").css({"display":"block"});
});

