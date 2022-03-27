exports.connect = function (req, rep){
    rep.send("login/regestr de livreur sur le site");           // TODO appel a model
};

exports.show = function(req, rep){
    rep.send("affichage d'une commande disponible");            // TODO appel a model
};

exports.update = function(req, rep){
    rep.send("update info de commande par livreur");            // TODO appel a model
};