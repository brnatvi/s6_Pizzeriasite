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
     * Ajouter un etxa menu au panier.
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
                console.log("OKKAY");
            }, error : function () {
                console.log("Impossible d'accéder à l'article voulu");
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
                console.log("OKKAY "+data);
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
                console.log("OKKAY "+data);
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
                    if ($(this).attr('id')===data[0].id+"_"+data[1]){
                        let quantity=$(this).find(".quantity-item");
                        quantity.text(parseInt(quantity.text())+1);
                        isPresent=true;
                    }
                });
                if (!isPresent){

                    $('<div>').attr('id', data[0].id+"_"+data[1])
                        .addClass('element')
                        .appendTo('#list-cart-item');

                    $('<p>').text(data[0].name+" - "+data[1])
                        .appendTo('#'+data[0].id+"_"+data[1]);

                    $('<p>').text(data[0].ingredients)
                        .appendTo('#'+data[0].id+"_"+data[1]);

                    let elementMenu=$('<div>').attr('id', data[0].id+"_"+data[1])
                        .addClass('element-menu')
                        .appendTo('#'+data[0].id+"_"+data[1]);

                    let elementQuantity=$('<div>').attr('id', data[0].id+"_"+data[1])
                        .addClass('menu-quantity')
                        .appendTo(elementMenu);




                    let formRemove= $('<form>', {
                        method: 'post',
                        action: 'remove-cart-item',
                    }).appendTo(elementQuantity);

                    $('<input>', {
                        type: 'hidden',
                        name: 'idArticle',
                        value: data[0].id,
                    }).appendTo(formRemove);

                    $('<input>', {
                        type: 'hidden',
                        name: 'choiceSize',
                        value: data[1],
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
                        value: data[0].id,
                    }).appendTo(formAdd);

                    $('<input>', {
                        type: 'hidden',
                        name: 'choiceSize',
                        value: data[1],
                    }).appendTo(formAdd);

                    $('<input>', {
                        type: 'image',
                        class: 'add-img',
                        src: 'img/add_circle_outline.svg',
                        alt: 'Submit',
                    }).appendTo(formAdd);


                    $('<p>').text(data[0].dimension[data[1]]+' €')
                        .addClass('price-item')
                        .appendTo(elementMenu);

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