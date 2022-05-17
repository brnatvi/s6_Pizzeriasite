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

/*update price pizza custom*/

const check = (icheck) => {
    for (let i=1; i<icheck; i++){
        if ($('#ingredientPizzaCustom'+i+' :selected').attr('value')==="none"){
            $('#ingredientPizzaCustom'+icheck).val("none");
            alert("Vous devez choisir un ingrédient n°"+i+" avant de choisir celui-ci");
            break;
        }
    }
}

const update  = (idupdate) => {
    if ($('#ingredientPizzaCustom'+idupdate+' :selected').attr('value')==="none"){
        for (let i=idupdate; i<=6; i++){
            $('#ingredientPizzaCustom'+i).val("none");
        }
    }
}

const total = () => {
    let total=0;
    total+=parseFloat($('#sizePizzaCustom :selected').attr('priceing'));
    total+=parseFloat($('#ingredientPizzaCustom4 :selected').attr('priceing'));
    total+=parseFloat($('#ingredientPizzaCustom5 :selected').attr('priceing'));
    total+=parseFloat($('#ingredientPizzaCustom6 :selected').attr('priceing'));
    return total.toFixed(2);
}

const pizzaExist = async (e) => {
    let listIng=[];
    for (let i=0; i<=6; i++){
        let ingrPCustomId=$('#ingredientPizzaCustom'+i+' :selected').attr('iding')
        if (ingrPCustomId!==undefined){
            listIng.push(parseInt(ingrPCustomId));
        }
    }
    //SEND REQUEST CHECK IF EXIST PIZZA
    e.preventDefault();
    return await $.ajax({
        url: 'test',
        type: 'post',
        data: {listIng},
        success: function (data) {
            return data;
        }, error: function (err) {
            console.log("Impossible " + err);
        }
    });
}

const isPizzaStandard = (e) => {
    pizzaExist(e).then(tmp=>{
        console.log(JSON.stringify(tmp))
        if (tmp.length>0){
            let currSize=$('#sizePizzaCustom :selected').attr("value")
            for (let i=0; i<tmp.length; i++){
                if (tmp[i]["size"]===currSize){
                    $('#total-pizza-custom span').text(tmp[i]["prix"])
                    $('#total-custom-hidden').attr("value", tmp[i]["prix"])
                    break;
                }
            }
        }else {
            $('#total-pizza-custom span').text(total())
            $('#total-custom-hidden').attr("value", total())
        }
    }).catch(()=>{console.log("Impossible d'actualiser correctement le prix")})
}

$(document).on('change', '#sizePizzaCustom', function(e) {
    $('#total-pizza-custom span').text(total())
    isPizzaStandard(e)
});

$(document).on('change', '#ingredientPizzaCustom1', function(e) {
    update(1)
    isPizzaStandard(e)
});

$(document).on('change', '#ingredientPizzaCustom2', function(e) {
    check(2)
    update(2)
    isPizzaStandard(e)
});

$(document).on('change', '#ingredientPizzaCustom3', function(e) {
    check(3)
    update(3)
    $('#total-pizza-custom span').text(total())
});

$(document).on('change', '#ingredientPizzaCustom4', function(e) {
    check(4)
    update(4)
    isPizzaStandard(e)
});

$(document).on('change', '#ingredientPizzaCustom5', function(e) {
    check(5)
    update(5)
    isPizzaStandard(e)
});

$(document).on('change', '#ingredientPizzaCustom6', function(e) {
    check(6)
    update(6)
    isPizzaStandard(e)
});