const Livreur = require("../model/livreur");
const Connect = require("./Connect");
const Commande = require("../model/commande");
//const User = require("../model/client");
const { Client } = require("pg");



//---------------------- Registered livreur ----------------------------------------------
/**
 * Système de connexion
 */
exports.updateProfileLivreur = function (req, rep) { Connect.updateProfile(Livreur, req, rep) }
exports.signInLivreur = (req, rep) => { Connect.signIn(Livreur, req, rep) };
exports.signUpLivreur = (req, rep) => { Connect.signUp(Livreur, req, rep) };

//----------- fonctionnality available to Livreur --------------------

exports.getLivraisonDispo = function (req, rep) {
    Commande.getCurrentCommande(req.session.user).then(current=>{
        console.log("current"+current)
        Commande.getOldestCommande().then(old => {
            rep.render('../views/commande', {
                params: {
                    title: 'commande',
                    isClient: (req.session.user === undefined || req.session.user.mobile !== undefined),
                    isLogued: req.session.user !== undefined,
                    oldCommande:{
                        idCommande: old.info.id_commande,
                        totalPrice: old.info.sum_total,
                        nameClient: old.info.nom + ' ' + old.info.prenom,
                        adressClient: old.info.adr_client,
                        mobileClient: old.info.mobile,
                        dateLivr: old.info.date_livraison,
                        listContenu: old.contenu
                    },
                    currentCommande:{
                        idCommande: current.info.id_commande,
                        totalPrice: current.info.sum_total,
                        nameClient: current.info.nom + ' ' + current.info.prenom,
                        adressClient: current.info.adr_client,
                        mobileClient: current.info.mobile,
                        dateLivr: current.info.date_livraison,
                        listContenu: current.contenu
                    }
                }
            })
        }).catch((err) => { console.log(err); rep.status(500).send({ messageError: "ACommande n'est pas disponible" }) });
    }).catch((err) => { console.log(err);  rep.status(500).send({ messageError: "BCommande n'est pas disponible" }) });
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

exports.acceptCommande = (req, res) => {
    Livreur.getLivreurByEmail(req.session.user.email).then(user =>{
        Livreur.getCurrentCommandeByLivrer(user.rows[0].id_livr).then(existCommande=>{
            console.log("existCommande.rows[0]"+JSON.stringify(existCommande.rows[0]))
            if (existCommande.rows[0].current_commande===null){
                Commande.updateStatusInprogress(req.body.idacceptCommande).then(()=>{
                    Livreur.updateCurrentCommande(user.rows[0].id_livr, req.body.idacceptCommande).then(()=>{
                        res.status(200).send();
                    });
                });
            }else res.status(500).send({ messageError: "Il faut effectuer la première livraison." })
        });
    }).catch(()=>{res.status(500).send({ messageError: "Commande n'est pas disponible" })})
};

exports.finishCommande = (req, res) => {
    Livreur.getLivreurByEmail(req.session.user.email).then(user =>{
        console.log("-------->"+user.rows[0].id_livr)
        Commande.updateStatusDelivered(req.body.idCommandeFinish).then(()=>{
            Livreur.finishCommande(user.rows[0].id_livr).then(()=>{
                res.status(200).send();
            }).catch(()=>{res.status(500).send({ messageError: "Impossible d'archiver la commande." })});
        }).catch(()=>{res.status(500).send({ messageError: "Impossible de mettre à jour le status de la commande." })});
    }).catch(()=>{res.status(500).send({ messageError: "Commande n'est pas disponible" })})
};