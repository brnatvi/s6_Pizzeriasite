/*index*/
$('#v-pills-tab a').on('click', function (e) {
    e.preventDefault()
    $('#v-pills-tab a').removeClass('active');
    $(this).addClass('active');
    $('#v-pills-tabContent div').removeClass('show active');
    switch ($(this)[0].id) {
        case "v-pills-salades-tab":
            $('#v-pills-salades').addClass('show active');
            break;
        case "v-pills-boissons-tab":
            $('#v-pills-boissons').addClass('show active');
            break;
        case "v-pills-desserts-tab":
            $('#v-pills-desserts').addClass('show active');
            break;
        case "v-pills-menus-tab":
            $('#v-pills-menus').addClass('show active');
            break;
        case "v-pills-pizzas-tab":
            $('#v-pills-pizzas').addClass('show active');
            break;
        case "v-pills-recommandations-tab":
            $('#v-pills-recommandations').addClass('show active');
            break;
    }
})