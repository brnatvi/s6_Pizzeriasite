const Livreur = require("../model/livreur");
const Connect=require("./Connect");

//----------- fonctionnality available to Livreur --------------------

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

exports.GetCommande = (req, res) => {
    res.status(404).render('commande',{
        params: {
            title: 'commande',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    })
};


//---------------------- Registered livreur ----------------------------------------------

exports.updateProfileLivreur = function (req, rep) {Connect.updateProfile(Livreur, req, rep)}
exports.signInLivreur = (req, rep) => {Connect.signIn(Livreur, req, rep)};
exports.signUpLivreur = (req, rep) => {Connect.signUp(Livreur, req, rep)};


//---------------------- TODO: WIP: Basic delivery man --------------------------------------------------

exports.updateCommande = function (req, rep) {
    
};