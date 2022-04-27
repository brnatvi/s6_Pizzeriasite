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

                $('.input-hide-add-cart').val(data.id);
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
                let isPresent=false;
                $("#list-cart-item").children().each(function(){
                    if (parseInt($(this).attr('id'))===data.id){
                        let quantity=$(this).find(".quantity-item");
                        quantity.text(parseInt(quantity.text())+1);
                        isPresent=true;
                    }
                });
                if (!isPresent){

                    $('<div>').attr('id', data.id)
                        .addClass('element')
                        .appendTo('#list-cart-item');

                    $('<p>').text(data.name)
                        .appendTo('#'+data.id);

                    $('<p>').text(data.ingredients)
                        .appendTo('#'+data.id);

                    let elementMenu=$('<div>').attr('id', data.id)
                        .addClass('element-menu')
                        .appendTo('#'+data.id);

                    let elementQuantity=$('<div>').attr('id', data.id)
                        .addClass('menu-quantity')
                        .appendTo(elementMenu);




                    let formRemove= $('<form>', {
                        method: 'post',
                        action: 'remove-cart-item',
                    }).appendTo(elementQuantity);

                    $('<input>', {
                        type: 'hidden',
                        name: 'idArticle',
                        value: data.id,
                    }).appendTo(formRemove);

                    $('<input>', {
                        type: 'image',
                        class: 'remove-img',
                        src: 'img/remove_circle_outline.svg',
                        alt: 'Submit',
                    }).appendTo(formRemove);



                    $('<p>').text('1')
                        .addClass('quantity-item')
                        .appendTo(elementQuantity);



                    let formAdd= $('<form>', {
                        method: 'post',
                        action: 'add-cart-item',
                    }).appendTo(elementQuantity);

                    $('<input>', {
                        type: 'hidden',
                        name: 'idArticle',
                        value: data.id,
                    }).appendTo(formAdd);

                    $('<input>', {
                        type: 'image',
                        class: 'add-img',
                        src: 'img/add_circle_outline.svg',
                        alt: 'Submit',
                    }).appendTo(formAdd);


                    $('<p>').text(data.price+' €')
                        .addClass('price-item')
                        .appendTo(elementMenu);

                }
                //update total
                let totalpriceitem=$('#total-price-cart-item');
                let price=parseFloat(totalpriceitem.text().substring(0, totalpriceitem.text().length-2));
                let total=(parseFloat(price)+parseFloat(data.price)).toFixed(2);
                totalpriceitem.text(((total<0)?"0":total)+" €");
                //then hide modal
                $('#modal-info-item').modal('hide');
            }, error : function () {
                console.log("Impossible d'ajouter l'article voulu");
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
                let total=(parseFloat(price)-parseFloat(data.price)).toFixed(2);
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
                let total=(parseFloat(price)+parseFloat(data.price)).toFixed(2);
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
                isDeliveryMan : $("#is-delivery-man").is(":checked"),
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

    //TODO: remove is checked

    /**
     * Modifier les informations d'un utilisateur (client et livreur)
     */
    $(document).on('click', '.parameters-user', function(e) {
        const form = $(this).parent().parent();
        let action = form.attr('action'),
            method = form.attr('method'),
            data = form.serialize();
                    /*{
            address : $("#userAdressSet").val(),
            mobile : $("#userPhoneSet").val(),
            email : $("#userEmailSet").val(),
            pw : $("#userPasswordSetCurrent").val(),
            pwSet : $("#userPasswordSet").val()
            };*/
        e.preventDefault();
        console.log(data)
        $.ajax({
            url: action,
            type: method,
            data: data,
            success: function() {
                //window.location.reload(true);
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
                pw : $("#userPasswordSignIn").val(),
                isDeliveryMan : $("#is-delivery-man-login").is(":checked")
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