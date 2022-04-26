const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//----------- fonctionnality available to Livreur --------------------


exports.registrLivreur = function (req, rep) {
    Livreur.getLivreurByEmail(req, rep).then(user => {
        if (user === null){
            rep.status(401).send({messageError : "L'email ou le mot de passe est incorrecte."});
        }else{
            bcrypt.compare(req.body.pw ,user.rows[0].pw).then(valid =>{
                if (valid){
                    createSession(req, user.rows[0]);
                    rep.status(200).send({messageSuccess : 'Vous êtes bien connecté.'});
                }else {
                    rep.status(401).send({messageError : "L'email ou le mot de passe est incorrecte."});
                }
            })
        }
    }).catch(() => {
        rep.status(500).send({messageError : 'Email or password is incorrect.'});
    });
};

exports.cntRegistrLivreur = function (req, rep) {
    if(! /^[a-zA-Z\-]+$/.test(req.body.nom)){
        rep.status(409).send({messageError : 'Votre nom doit contenir uniquement des caractères alphanumérique.'});
    }else if(! /^[a-zA-Z\-]+$/.test(req.body.prenom)){
        rep.status(409).send({messageError : 'Votre prénom doit contenir uniquement des caractères alphanumérique.'});
    }else if(! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
        rep.status(409).send({messageError : 'Votre email est invalide.'});
    }else if(req.body.pw.length<8){
        rep.status(409).send({messageError : 'Votre mot de passe doit contenir au moins 8 caractères.'});
    }else {
        Livreur.getNbrLivreurByMail(req, rep).then(res => {
            if (parseInt(res.rows[0].count) === 0) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.pw, salt, function (err, hash) {
                        req.body.pw = hash;
                        Livreur.addLivreur(req, rep).then(() => {
                            createSession(req);
                            rep.status(200).send({messageSuccess: 'Votre compte à bien été créé.'});
                        }).catch(() => {
                            rep.status(409).send({messageError: 'Impossible de créer votre compte.'});
                        });
                    });
                });
            } else {
                rep.status(409).send({messageError: "Cette adresse électronique est déjà utilisé."});
            }
        }).catch(() => {
            rep.status(409).send({messageError: "Veillez saisir correctement vos informations."})
        });
    }
};

function createSession(req, logIn){
    let user=req.body;
    if (logIn!==undefined) user=logIn;
    req.session.user={
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        tokenAuth: "Bearer "+jwt.sign(
            { email: user.email },
            "VERYSECRETTOKENSESSION",
            { expiresIn: '24h' }
        )
    }
}


exports.connectLivreur = function (req, rep) {

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

