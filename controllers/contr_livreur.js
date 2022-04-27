const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {reject} = require("bcrypt/promises");

//----------- fonctionnality available to Livreur --------------------

exports.parameters = function (req, rep) {

    let user_req=Livreur.getLivreurByEmail(req.session.user.email).then(response => {
        if (response === undefined) throw "L'email ou le mot de passe est incorrecte.";
        else return response;
    })

    user_req.then(async user => {
        const isValidPass = await comparePassword(req.body.userPasswordSetCurrent ,user.pw);
        if (isValidPass) return user;
        else throw "Le mot de passe courant est incorrecte.";
    }).then(user=>{
        try{
            if(req.body.userEmailSet && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.userEmailSet)){
                let user_info ={id:user.id, email: req.body.userEmailSet}
                Livreur.getNbrLivreurByMail(user_info.email).then(user_nbr => {
                    if (user_nbr !== undefined && user_nbr.rows[0].count==="0"){
                        try{
                            Livreur.updateMail(user_info).then(()=>{
                                req.session.user.email=user_info.email
                                req.session.save( function(err) {})
                            })
                        }catch(error){
                            console.log(error)
                        }
                    }else throw "L'email est déjà utilisé.";
                }).catch(()=>{
                    rep.status(401).send({messageError : "Impossible de mettre à jour l'email."});
                })
            }
        }catch (error) {
            console.log(error)
        }
    })

    user_req.then(async user => {
        if (req.body.userPasswordSet && req.body.userPasswordSet.length >= 8) {
            const hash = await hashPassword(req.body.userPasswordSet);
            if (hash) return {hashU: hash, userU: user};
            else throw "Impossible de créer votre compte.";
        }else throw "Le mot de passe est trop court.";
    }).then(response=>{
        let ps_res={id:response.userU.id ,pw:response.hashU};
        Livreur.updatePassword(ps_res).then(() => {
            rep.status(200).send({messageSuccess: 'Votre mot de passe à bien été mis à jour.'});
        }).catch(()=>{
            rep.status(500).send({messageError : "Impossible de mettre à jour le mot de passe."});
        })
    }).catch(err => {
        if (!(typeof err === 'string' || err instanceof String)) err="Veillez saisir correctement vos informations.";
        rep.status(500).send({messageError : err});
    });
}

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }
    return false;
};

const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    return null;
};

exports.registrLivreur = function (req, rep) {
    Livreur.getLivreurByEmail(req.body.email).then(response => {
        if (response === undefined) throw "L'email ou le mot de passe est incorrecte.";
        else return response;
    }).then(async user => {
        const isValidPass = await comparePassword(req.body.pw ,user.pw);
        if (isValidPass) return user;
        else throw "L'email ou le mot de passe est incorrecte.";
    }).then(user =>{
        createSession(req, user);
        rep.status(200).send({messageSuccess : 'Vous êtes bien connecté.'});
    }).catch(err => {
        if (!(typeof err === 'string' || err instanceof String)) err='Email or password is incorrect.';
        rep.status(500).send({messageError : err});
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
        Livreur.getNbrLivreurByMail(req.body.email, rep).then(res => {
            if (parseInt(res.rows[0].count) === 0) return res;
            else throw "Cette adresse électronique est déjà utilisé.";
        }).then(async () => {
            const hash = await hashPassword(req.body.pw);
            if (hash) return hash;
            else throw "Impossible de créer votre compte.";
        }).then(hash=>{
            req.body.pw = hash;
            try{
                Livreur.addLivreur(req, rep).then(() => {
                    createSession(req);
                    console.log(JSON.stringify(req.session.user));
                    rep.status(200).send({messageSuccess: 'Votre compte à bien été créé.'});
                })
            }catch (error) {
                console.log(error)
            }
        }).catch(err => {
            if (!(typeof err === 'string' || err instanceof String)) err="Veillez saisir correctement vos informations.";
            rep.status(500).send({messageError : err});
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

