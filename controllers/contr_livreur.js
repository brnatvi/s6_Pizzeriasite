const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Livreur --------------------

exports.registrLivreur = function (req, rep) {
    const r = Livreur.registrLivreur();
    //console.log(r);
    //return(r);
    rep.json(r);
};

exports.connectLivreur = function (req, rep) {    
    const r2 = Livreur.connectLivreur();
    rep.json(r2 + " " + req.body.nom + " " + req.body.prenom);
};

exports.showCommande = function (req, rep) {
    const c = Commande.showCommande();
    rep.send(c);
};

exports.updateCommande = function (req, rep) {
    const r2 = Livreur.updateCommandeHistory();
    rep.send("In Livreur: " + r2);
};
