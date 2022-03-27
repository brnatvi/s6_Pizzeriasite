exports.connectLivreur = function (req, rep){
    rep.send("LIVREUR: login/registr de livreur sur le site");
};

exports.showCommande = function(req, rep){
    
    rep.send("LIVREUR: affichage d'une commande disponible");
};

exports.updateCommande = function(req, rep){
    rep.send("LIVREUR: update info de commande par livreur");
};