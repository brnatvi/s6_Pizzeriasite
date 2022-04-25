const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Livreur --------------------


exports.registrLivreur = function (req, rep) {
    Livreur.addLivreur(req, rep);
};


exports.connectLivreur = function (req, rep) { 
    
    // make connection (TODO need to add the security stuffs)

    // get the oldest commande   
    Commande.getOldestCommande(req, rep);       // it works, tested
};


exports.updateCommande = function (req, rep) {
    
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

