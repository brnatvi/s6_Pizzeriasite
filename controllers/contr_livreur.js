const Livreur = require("../model/livreur");
const Connect = require("./Connect");
const Commande = require("../model/commande");



//---------------------- Registered livreur ----------------------------------------------
/**
 * Système de connexion
 */
exports.updateProfileLivreur = function (req, rep) { Connect.updateProfile(Livreur, req, rep) }
exports.signInLivreur = (req, rep) => { Connect.signIn(Livreur, req, rep) };
exports.signUpLivreur = (req, rep) => { Connect.signUp(Livreur, req, rep) };

//----------- fonctionnality available to Livreur --------------------

//----------- fonctionnality available to Livreur --------------------

exports.getLivraisonDispo = function (req, rep) {
    if (req.body === 'current') {
        Commande.getCurrentCommande().then(el => {
            rep.render('../views/commande', {
                params: {
                    title: 'commande',
                    isClient: (req.session.user === undefined || req.session.user.mobile !== undefined),
                    isLogued: req.session.user !== undefined,
                    idCommande: el.info.id_commande,
                    totalPrice: el.info.sum_total,
                    nameClient: el.info.nom + ' ' + el.info.prenom,
                    adressClient: el.info.adr_client,
                    mobileClient: el.info.mobile,
                    listContenu: el.contenu
                }
            })
        }).catch(() => { rep.status(500).send({ messageError: "Commande n'est pas disponible" }) });
    }
    else {
        Commande.getOldestCommande().then(el => {
            rep.render('../views/commande', {
                params: {
                    title: 'commande',
                    isClient: (req.session.user === undefined || req.session.user.mobile !== undefined),
                    isLogued: req.session.user !== undefined,
                    idCommande: el.info.id_commande,
                    totalPrice: el.info.sum_total,
                    nameClient: el.info.nom + ' ' + el.info.prenom,
                    adressClient: el.info.adr_client,
                    mobileClient: el.info.mobile,
                    listContenu: el.contenu
                }
            })
        }).catch(() => { rep.status(500).send({ messageError: "Commande n'est pas disponible" }) });
    }
};

exports.connectionLivreur = function (req, rep) {
    rep.render('../views/livraison', {
        params: {
            title: 'livraison',
            isClient: (req.session.user === undefined || req.session.user.mobile !== undefined),
            isLogued: req.session.user !== undefined
        }
    })
};


exports.getCurrentCommande = (req, res) => {
    res.status(404).render('commande', {
        params: {
            title: 'commande',
            isClient: (req.session.user === undefined || req.session.user.mobile !== undefined),
            isLogued: req.session.user !== undefined
        }
    })
};


//---------------------- TODO: WIP: Basic delivery man --------------------------------------------------

exports.updateCommande = function (req, rep) {

};