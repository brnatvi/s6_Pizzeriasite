const Livreur = require("../model/livreur");
const Connect=require("./Connect");



//---------------------- Registered livreur ----------------------------------------------
/**
 * Système de connexion
 */
exports.updateProfileLivreur = function (req, rep) {Connect.updateProfile(Livreur, req, rep)}
exports.signInLivreur = (req, rep) => {Connect.signIn(Livreur, req, rep)};
exports.signUpLivreur = (req, rep) => {Connect.signUp(Livreur, req, rep)};

//----------- fonctionnality available to Livreur --------------------

/**
 * TODO:
 */
exports.livraisonLivreur = function (req, rep) {
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

/**
 * TODO:
 */
exports.GetCommande = (req, res) => {
    res.status(404).render('commande',{
        params: {
            title: 'commande',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    })
};


//---------------------- TODO: WIP: Basic delivery man --------------------------------------------------

exports.updateCommande = function (req, rep) {
    
};