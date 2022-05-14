const isPresentCartItem = (divName) => {
    let isPresent=false;
    $("#list-cart-item").children().each(function(){
        if ($(this).attr('id')===divName){
            let quantity=$(this).find(".quantity-item");
            quantity.text(parseInt(quantity.text())+1);
            isPresent=true;
        }
    });
    return isPresent;
}

const updateGraphCartItem = (divId, divName, divList, actionForm, inputName, isChoice, priceDiv, numDiv, numBisDiv) => {
    $('<div>').attr('id', divId)
        .addClass('element')
        .appendTo('#list-cart-item');

    $('<p>').text(divName)
        .appendTo('#'+ divId);

    $('<p>')
        .text(divList)
        .appendTo('#'+ divId);

    let elementMenu=$('<div>').attr('id', divId)
        .addClass('element-menu')
        .appendTo('#'+ divId);

    let elementQuantity=$('<div>').attr('id', divId)
        .addClass('menu-quantity')
        .appendTo(elementMenu);

    let formRemove= $('<form>', {
        method: 'post',
        action: 'remove'+actionForm,
    }).appendTo(elementQuantity);

    $('<input>', {
        type: 'hidden',
        name: inputName,
        value: numDiv,
    }).appendTo(formRemove);

    if (isChoice) {
        $('<input>', {
            type: 'hidden',
            name: 'choiceSize',
            value: numBisDiv,
        }).appendTo(formRemove);
    }

    $('<input>', {
        type: 'image',
        class: (isChoice)?'remove-img':'remove-menu-img',
        src: 'img/remove_circle_outline.svg',
        alt: 'Submit',
    }).appendTo(formRemove);

    $('<p>').text('1')
        .addClass('quantity-item')
        .appendTo(elementQuantity);

    let formAdd= $('<form>', {
        method: 'post',
        action: 'add'+actionForm,
    }).appendTo(elementQuantity);

    $('<input>', {
        type: 'hidden',
        name: inputName,
        value: numDiv,
    }).appendTo(formAdd);

    if (isChoice){
        $('<input>', {
            type: 'hidden',
            name: 'choiceSize',
            value: numBisDiv,
        }).appendTo(formAdd);
    }

    $('<input>', {
        type: 'image',
        class: (isChoice)?'add-img':'add-menu-img',
        src: 'img/add_circle_outline.svg',
        alt: 'Submit',
    }).appendTo(formAdd);


    $('<p>').text(priceDiv+' €')
        .addClass('price-item')
        .appendTo(elementMenu);
}

const addMenu = (data) => {
    let divList="";
    for (let i=0; i<data.listElementMenu.length; i++){
        divList+=(i<data.listElementMenu.length-1)?data.listElementMenu[i]+" . ":data.listElementMenu[i];
    }
    if (!isPresentCartItem(data.indexMenu+"_"+data.typeMenu)){
        updateGraphCartItem(
            data.indexMenu+"_"+data.typeMenu, "Menu "+data.typeMenu, divList,
            '-menu-cart-item', 'idMenu', false,
            data.priceMenu, data.indexMenu, "null"
        )
    }
    //update total
    let totalpriceitem=$('#total-price-cart-item');
    let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
    let total=(parseFloat(price)+parseFloat(data.priceMenu)).toFixed(2);
    totalpriceitem.text(((total<0)?"0":total)+" €");
}

$(document).ready(function() {

    /**
     * Avoir plus d'informations sur un article
     */
    $(document).on('click', '.container-item-desc', function(e) {
        const form = $(this).find('form');
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                $("#modal-info-item-title").text(data.name);

                $("#modal-body-item").empty();

                let ingredientSpanList= $('<span>').attr('id', 'ingredients-list')
                    .text(data.ingredients)
                    .css({
                        fontWeight: "normal"
                    });

                $('<p>').text("Liste des ingrédients: ")
                    .css({
                        margin: "auto",
                        fontWeight: "bold"
                    })
                    .append($('<br>'))
                    .append(ingredientSpanList)
                    .appendTo('#modal-body-item');

                $('#choiceSize').empty();
                for (let sizeArticle in data.dimension){
                    let priceArticle = data.dimension[sizeArticle];
                    $('<option value="'+sizeArticle+'">'+sizeArticle + ': ' + priceArticle+'  &#8364;</option>').appendTo('#choiceSize');
                }

                $('.input-hide-add-cart').val(data.id);
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Ajouter un extra menu au panier.
     */
    $(document).on('click','#form-extra-menu',function(e){
        const form = $(this).parent('form');
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                addMenu(data)
            }, error : function (data) {
                console.log("Impossible d'accéder à l'article voulu:"+JSON.stringify(data));
            }
        });
    });

    /**
     * Ajouter un mega menu au panier.
     */
    $(document).on('click','#form-mega-menu',function(e){
        const form = $(this).parent('form');
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                addMenu(data)
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Ajouter un giga menu au panier.
     */
    $(document).on('click','#form-giga-menu',function(e){
        const form = $(this).parent('form');
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                addMenu(data)
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Ajouter un article au panier.
     **/
    $(document).on('click', '.add-cart-item', function(e) {
        const form = $(this).parent(".form-add-dart-item");
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                if (!isPresentCartItem(data[0].id+"_"+data[1])){
                    updateGraphCartItem(data[0].id+"_"+data[1],
                        data[0].name+" - "+data[1], data[0].ingredients, '-cart-item',
                        'idArticle', true, data[0].dimension[data[1]], data[0].id, data[1]
                    )
                }
                //update total
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)+parseFloat(data[0].dimension[data[1]])).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");
                //then hide modal
                $('#modal-info-item').modal('hide');
            }, error : function () {
                console.log("Impossible d'ajouter l'article voulu ");
            }
        });
    });

    /**
     * Modification de la quantité d'un article - Supprimer un article au panier
     */
    $(document).on('click', '.remove-img', function(e) {
        const form = $(this).parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                let qnttRemove=form.parent().find('.quantity-item');
                if (parseInt(qnttRemove.text())-1<=0){
                    form.parent().parent().parent().remove();
                }else{
                    qnttRemove.text(parseInt(qnttRemove.text())-1);
                }
                //update total
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)-parseFloat(data[0].dimension[form.find('input:hidden[name=choiceSize]').val()])).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Modification de la quantité d'un article - Ajouter un article au panier
     */
    $(document).on('click', '.add-img', function(e) {
        const form = $(this).parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                let qnttRemove=form.parent().find('.quantity-item');
                qnttRemove.text(parseInt(qnttRemove.text())+1);
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)+parseFloat(data[0].dimension[form.find('input:hidden[name=choiceSize]').val()])).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Modification de la quantité d'un article - Ajouter un article au panier
     */
    $(document).on('click', '.add-menu-img', function(e) {
        const form = $(this).parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {
                let qnttRemove=form.parent().find('.quantity-item');
                qnttRemove.text(parseInt(qnttRemove.text())+1);
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)+parseFloat(data)).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Modification de la quantité d'un article - Ajouter un article au panier
     */
    $(document).on('click', '.remove-menu-img', function(e) {
        const form = $(this).parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function(data) {

                let qnttRemove=form.parent().find('.quantity-item');
                if (parseInt(qnttRemove.text())-1<=0){
                    form.parent().parent().parent().remove();
                }else{
                    qnttRemove.text(parseInt(qnttRemove.text())-1);
                }
                //update total
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)-parseFloat(data)).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");

            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });


    /**
     * Enregistrement d'un nouvel utilisateur
     */
    $(document).on('click', '.signup-user', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = {
                nom : $("#userFirstName").val(),
                prenom : $("#userLastName").val(),
                address : $("#userAdress").val(),
                mobile : $("#userPhone").val(),
                email : $("#userEmail").val(),
                pw : $("#userPassword").val()
            }
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                window.location.reload(true);
            }, error : function (data) {
                console.log(data.responseJSON.messageError);
            }
        });
    });

    /**
     * Enregistrement d'un nouveau livreur
     */
    $(document).on('click', '.signup-livraison', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = {
                nom : $("#livraisonFirstName").val(),
                prenom : $("#livraisonLastName").val(),
                email : $("#livraisonEmail").val(),
                pw : $("#livraisonPassword").val()
            }
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                window.location.reload(true);
            }, error : function (data) {
                console.log(data.responseJSON.messageError);
            }
        });
    });

    /**
     * Modifier les informations d'un utilisateur (client et livreur)
     */
    $(document).on('click', '.parameters-user', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                window.location.reload(true);
            }, error : function (data) {
                console.log(data.responseJSON.messageError);
            }
        });
    });

    /**
     * Connexion d'un utilisateur
     */
    $(document).on('click', '.signin-user', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = {
                email : $("#userEmailSignIn").val(),
                pw : $("#userPasswordSignIn").val()
            }
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                window.location.reload(true);
            }, error : function (data) {
                console.log(data.responseJSON.messageError);
            }
        });
    });

    /**
     * Connexion d'un livreur
     */
    $(document).on('click', '.signin-livraison', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = {
                email : $("#livraisonEmailSignIn").val(),
                pw : $("#livraisonPasswordSignIn").val()
            }
        e.preventDefault();
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                window.location.reload(true);
                window.location.replace(window.location.origin+"/commande");
            }, error : function (data) {
                console.log(data.responseJSON.messageError);
            }
        });
    });

    /**
     * Déconnexion d'un utilisateur
     */
    $(document).on('click', '#logoutSession', function (e) {
        e.preventDefault();
        $.ajax({
            url: "logout",
            type: "GET",
            success: () => {
                window.location.replace(window.location.origin);
            }, error : function () {
                alert('Impossible de vous déconnecter.');
            }
        });
    });

});