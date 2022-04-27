const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {reject} = require("bcrypt/promises");
const Connect=require("./Connect.js");

//----------- fonctionnality available to Livreur --------------------

exports.updateProfileLivreur = function (req, rep) {Connect.updateProfile(Livreur, req, rep)}
exports.signInLivreur = (req, rep) => {Connect.signIn(Livreur, req, rep)};
exports.signUpLivreur = (req, rep) => {Connect.signUp(Livreur, req, rep)};


exports.livraisonLivreur = function (req, rep) {

    // make connection (TODO need to add the security stuffs)
    rep.render('../views/livraison',{
        params: {
            title: 'livraison',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    });
    // get the oldest commande   
    //Commande.getOldestCommande(req, rep);       // it works, tested
};


exports.updateCommande = function (req, rep) {
    
};


/*exports.updateLivreur = function (req, rep) {
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
};*/

