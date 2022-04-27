const Client = require("../model/client.js");
const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {log} = require("util");


//----------- fonctionnality available to Client/User --------------------

exports.parameters = function (req, rep) {
    Client.getClientByEmail(req).then(user => {
        if (user === null){
            rep.status(401).send({messageError : "Le client n'existe pas."});
        }else{
            let flag=false;
            bcrypt.compare(req.body.userPasswordSetCurrent ,user.rows[0].pw).then(valid =>{
                if (valid){
                    if(req.body.userEmailSet && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.userEmailSet)){
                        let user_info ={id:user.rows[0].id_client, email: req.body.userEmailSet}
                        Client.updateMail(user_info).then(()=>{
                            req.session.user.email=user_info.email
                            req.session.save( function(err) {})
                        }).catch(()=>{
                            rep.status(401).send({messageError : "L'email n'a pas été mis à jour."});
                            flag=true;
                        });
                        alert(flag);
                    }
                    if(req.body.userPasswordSet && req.body.userPasswordSet.length>=8){
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.userPasswordSet, salt, function (err, hash) {
                                let user_info ={id:user.rows[0].id_client, pw: hash}
                                Client.updatePassword(user_info).catch(()=>{
                                    rep.status(401).send({messageError : "Le mot de passe n'a pas été mis à jour."});
                                    flag=true;
                                });
                            });
                        });
                    }
                    if (req.body.userAdressSet){
                        let user_info ={id:user.rows[0].id_client, address: req.body.userAdressSet}
                        Client.updateAddress(user_info).then(()=>{
                            req.session.user.address=user_info.address
                            req.session.save( function(err) {})
                        }).catch(()=>{
                            rep.status(401).send({messageError : "L'adresse n'a pas été mise à jour."});
                            flag=true;
                        });
                    }
                    if (req.body.userPhoneSet){
                        let user_info ={id:user.rows[0].id_client, mobile: req.body.userPhoneSet}
                        Client.updateMobile(user_info).then(()=>{
                            req.session.user.mobile=user_info.mobile
                            req.session.save( function(err) {})
                        }).catch(()=>{
                            rep.status(401).send({messageError : "Le numéro de téléphone n'a pas été mis à jour."});
                            flag=true;
                        });
                    }
                    if (!flag) rep.status(200).send({messageSuccess : 'Les informations ont bien été misent à jour.'});
                }else rep.status(401).send({messageError : "Le mot de passe courant est incorrecte."});
            })
        }
    }).catch(() => {rep.status(500).send({messageError : 'Impossible de mettre à jour les informations.'});});
}

// create new commande
exports.createCommande = function (req, rep) {
    Commande.createCommande(req, rep);
};


exports.GetLogOut = async (req, rep) =>{
    if (req.session.user!==undefined){
        req.session.destroy();
        rep.status(200).send({messageSuccess : 'Success'})
    }
};

//TODO: pizza recommandation?

exports.infoCartItem = function (req, rep) {
    // TODO: request bdd
    console.log("TODO: request bdd"+JSON.stringify(req.body.idPizza));
    let resRequestBdd={
        id: 1,
        name: 'Pizza Raclette',
        ingredients: 'sauce tomate . fromage à raclette ' +
            '. champignons . 8 olives noires . ' +
            '2 tranches de jambon',
        price: 5.96
    };

    rep.json(resRequestBdd);
}


exports.addCartItem = function (req, rep) {
    // TODO: request bdd
    console.log("TODO: request bdd"+JSON.stringify(req.body.idPizza));
    let resRequestBdd={
        id: 1,
        name: 'Pizza Raclette',
        ingredients: 'sauce tomate . fromage à raclette ' +
            '. champignons . 8 olives noires . ' +
            '2 tranches de jambon',
        price: 5.96
    };

    //update session price
    req.session.user.cartItem.price=req.session.user.cartItem.price+resRequestBdd.price

    //update session cart item
    if (req.session.user.cartItem.idQuantity[resRequestBdd.id]!==undefined){
        req.session.user.cartItem.idQuantity[resRequestBdd.id]+=1;
    }else req.session.user.cartItem.idQuantity[resRequestBdd.id]=1;

    rep.json(resRequestBdd);
}

exports.removeCartItem = function (req, rep) {
    // TODO: request bdd
    console.log("TODO: request bdd"+JSON.stringify(req.body.idPizza));
    let resRequestBdd={
        id: 1,
        name: 'Pizza Raclette',
        ingredients: 'sauce tomate . fromage à raclette ' +
            '. champignons . 8 olives noires . ' +
            '2 tranches de jambon',
        price: 5.96
    };

    //update session price
    req.session.user.cartItem.price=req.session.user.cartItem.price-resRequestBdd.price

    //update session cart item
    if (req.session.user.cartItem.idQuantity[resRequestBdd.id]!==undefined){
        if (req.session.user.cartItem.idQuantity[resRequestBdd.id]>1){
            req.session.user.cartItem.idQuantity[resRequestBdd.id]-=1;
        }else{
            delete req.session.user.cartItem.idQuantity[resRequestBdd.id];
        }
    }else req.session.user.cartItem.idQuantity[resRequestBdd.id]=1;

    rep.json(resRequestBdd);
}

exports.index = function (req, rep) {
    rep.render('../views/home',{
        params: {
            title: 'home',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    });
}

exports.shop = function (req, rep) {

    if(req.session.user!==undefined){
        //TODO: request all info articles cart item -> array item: id, description, price unity...
        console.log("TODO: request bdd");
        let resRequestBdd=[{
            id: 1,
            name: 'Pizza Raclette',
            ingredients: 'sauce tomate . fromage à raclette ' +
                '. champignons . 8 olives noires . ' +
                '2 tranches de jambon',
            price: 5.96
        }];
        rep.render('../views/index',{
            params: {
                title: 'index',
                quantity: req.session.user.cartItem.idQuantity,
                price: req.session.user.cartItem.price,
                list: resRequestBdd,
                isLogued: true
            }
        });
    }else{
        rep.render('../views/index',{
            params: {
                title: 'index',
                isLogued: false
            }
        });
    }
};

exports.showCarte = function (req, rep) {
    rep.send('HOME: main menu page');
};

//---------------------- Basic client --------------------------------------------------

/* add new client to database */
exports.addClient = function (req, rep) {
    Client.addClient(req, rep);
};

/* get list of clients */
exports.getClient = function (req, rep) {
    Client.getClientByID(req, rep);
};

/* get list of clients */
exports.getListClients = function (req, rep) {
    Client.getListClients(req, rep);
};

/* remouve client from list */
exports.deleteClient = function (req, rep) {
    Client.deleteClient(req, rep);
};

//---------------------- Registered client ----------------------------------------------
/* connecttion for registered client */
exports.signIn = function (req, rep) {
    Client.getClientByEmail(req, rep).then(user => {
        if (user === null){
            rep.status(401).send({messageError : "L'email ou le mot de passe est incorrecte."})
        }else{
            bcrypt.compare(req.body.pw ,user.pw).then(valid =>{
                if (valid){
                    createSession(req, user);//ici
                    rep.status(200).send({messageSuccess : 'Vous êtes bien connecté.'})
                }else {
                    rep.status(401).send({messageError : "L'email ou le mot de passe est incorrecte."})
                }
            })
        }
    }).catch(() => {
        rep.status(500).send({messageError : "L'email ou le mot de passe est incorrecte."})
    })
}

exports.addRegisteredClient = function (req, rep) {
    if(! /^[a-zA-Z\-]+$/.test(req.body.nom)){
        rep.status(409).send({messageError : 'Votre nom doit contenir uniquement des caractères alphanumérique.'});
    }else if(! /^[a-zA-Z\-]+$/.test(req.body.prenom)){
        rep.status(409).send({messageError : 'Votre prénom doit contenir uniquement des caractères alphanumérique.'});
    }else if(! /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)){
        rep.status(409).send({messageError : 'Votre email est invalide.'});
    }else if(req.body.pw.length<8){
        rep.status(409).send({messageError : 'Votre mot de passe doit contenir au moins 8 caractères.'});
    }else{
        Client.getNbrClientByEmail(req, rep).then(res=>{
            if (parseInt(res.rows[0].count)===0){
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.pw, salt, function (err, hash) {
                        req.body.pw=hash;
                        Client.addRegisteredClient(req, rep).then(() => {
                            createSession(req);
                            rep.status(200).send({messageSuccess : 'Votre compte à bien été créé.'});
                        }).catch(()=>{
                            rep.status(409).send({messageError : 'Impossible de créer votre compte.'});
                        });
                    });
                });
            }else{
                rep.status(409).send({messageError : "Cette adresse électronique est déjà utilisé."});
            }
        }).catch(() => {rep.status(409).send({messageError : "Veillez saisir correctement vos informations."})});
    }
};

function createSession(req, logIn){
    let user=req.body;
    if (logIn!==undefined) user=logIn;
    req.session.user={
        nom: user.nom,
        prenom: user.prenom,
        address: user.address,
        mobile: user.mobile,
        email: user.email,
        cartItem: {
            price: 0,
            idQuantity: {/*id: quantity*/

            }
        },
        tokenAuth: "Bearer "+jwt.sign(
            { email: user.email },
            "VERYSECRETTOKENSESSION",
            { expiresIn: '24h' }
        )
    }
}

exports.updateRegisteredClient = function (req, rep) {
    if (req.body.nom) {
        Client.updateNom(req, rep);
    };
    if (req.body.prenom) {
        Client.updatePrenom(req, rep);
    };
    if (req.body.email) {
        Client.updateMail(req, rep);
    };
    if (req.body.pw) {
        Client.updatePassword(req, rep);
    };
    if (req.body.mobile) {
        Client.updateMobile(req, rep);
    };
    if (req.body.address) {
        Client.updateAddress(req, rep);
    };
};

exports.deleteRegisteredClient = function (req, rep) {
    Client.deleteRegisteredClient(req, rep);
};