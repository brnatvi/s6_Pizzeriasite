const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Livreur --------------------

exports.registrLivreur = function (req, rep) {
    Livreur.addLivreur(req, rep);
};

exports.updateLivreur = function (req, rep) {
    if (req.body.nom) {
        Livreur.updateNom(req, rep);
    };
    if (req.body.prenom) {
        Livreur.updatePrenom(req, rep);
    };
    if (req.body.email) {
        Livreur.updateMail(req, rep);
    };
    if (req.body.pw) {
        Livreur.updatePassword(req, rep);
    };
};

exports.connectLivreur = function (req, rep) {    
    Commande.getOldestCommande(req, rep);
};


exports.updateCommande = function (req, rep) {
    
};
