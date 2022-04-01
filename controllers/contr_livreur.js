const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Livreur --------------------

exports.connectLivreur = function (req, rep) {
    const r = Livreur.registrLivreur();
    rep.send(r);
    //const k = Livreur.connectLivreur();
};

exports.showCommande = function (req, rep) {
    const c = Commande.showCommande();
    rep.send(c);
};

exports.updateCommande = function (req, rep) {
    const r1 = Commande.updateCommande();
    const r2 = Livreur.updateCommandeHistory();
    rep.send("In Commande: " + r1 + " In Livreur: " + r2);
};
