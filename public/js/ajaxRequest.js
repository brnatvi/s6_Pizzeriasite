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
                //TODO: add session
                //TODO: update graphic
                console.log(data);
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

                //bdd pizza return info:
                //if not pizza ingredient = null
                /*{
                    name
                    ingredient
                    price
                }*/
                //updateCardUser()
                //check if pizza is present add quantity - else:
                //create cart item -> div = element with id=x and class
                //  add title, content pizza
                //  price for each unity, not update if article add
                //  quantity
            }, error : function (data) {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

    /**
     * Ajouter un article au panier.
     **/
    $(document).on('click', '.add-cart-item', function(e) {
        /*
        console.log($(this).parent(".form-add-dart-item").find('.input-hide-add-cart').val());*/
        /**/
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
                //TODO: add session
                console.log(data);
                let isPresent=false;
                $("#list-cart-item").children().each(function(){
                    console.log(parseInt($(this).attr('id'))+' + '+data.id);
                    if (parseInt($(this).attr('id'))===data.id){
                        let quantity=$(this).find(".quantity-item");
                        quantity.text(parseInt(quantity.text())+1);
                        console.log(quantity.text());
                        isPresent=true;
                        //TODO: update session
                    }
                });
                console.log("OKAYY");
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
                $('#modal-info-item').modal('hide');
            }, error : function (data) {
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
                console.log(data);

                let qnttRemove=form.parent().find('.quantity-item');
                if (parseInt(qnttRemove.text())-1<=0){
                    form.parent().parent().parent().remove();
                }else{
                    qnttRemove.text(parseInt(qnttRemove.text())-1);
                }
                //TODO: update session

            }, error : function (data) {
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
                console.log(data);

                let qnttRemove=form.parent().find('.quantity-item');
                qnttRemove.text(parseInt(qnttRemove.text())+1);
                //TODO: update session

            }, error : function (data) {
                console.log("Impossible d'accéder à l'article voulu");
            }
        });
    });

});