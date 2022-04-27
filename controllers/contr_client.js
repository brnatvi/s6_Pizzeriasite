const Client = require("../model/client.js");
const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {log} = require("util");


//----------- fonctionnality available to Client/User --------------------

exports.parameters = function (req, rep) {

    let user_req=Client.getClientByEmail(req.session.user.email).then(response => {
        if (response === undefined) throw "L'email ou le mot de passe est incorrecte.";
        else return response;
    })

    user_req.then(async user => {
        const isValidPass = await comparePassword(req.body.userPasswordSetCurrent ,user.pw);
        if (isValidPass) return user;
        else throw "Le mot de passe courant est incorrecte.";
    }).then(user=>{
        console.log("aaaaaaaaaaaaaaaaa")
        try{
            console.log("aaaaaaaaaaaaaaaaa")
            if(req.body.userEmailSet && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.userEmailSet)){
                let user_info ={id:user.id, email: req.body.userEmailSet}
                console.log("aaaaaaaaaaaaaaaaa"+JSON.stringify(user_info))
                Client.getNbrClientByEmail(user_info.email).then(user_nbr => {
                    if (user_nbr !== undefined && user_nbr.rows[0].count==="0"){
                        try{
                            console.log("aaaaaaaaaaaaaaaaa")
                            Client.updateMail(user_info).then(()=>{
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

        if (req.body.userPasswordSet && req.body.userPasswordSet.length >= 8) {
            user_req.then(async user => {
                const hash = await hashPassword(req.body.userPasswordSet);
                console.log("ps_res-----ps_res------->"+JSON.stringify(hash));
                if (hash) return {hashU: hash, userU: user};
                else throw "Impossible de créer votre compte.";
            }).then(response=>{
                console.log("ps_res-----ps_res------->"+JSON.stringify(response));
                let ps_res={id:response.userU.id ,pw:response.hashU};
                console.log("ps_res-----ps_res------->"+JSON.stringify(ps_res));
                Client.updatePassword(ps_res).catch(()=>{
                    rep.status(500).send({messageError : "Impossible de mettre à jour le mot de passe."});
                })
            })
        }

        if (req.body.userAdressSet) {
            user_req.then(user=>{
                let ps_res = {id: user.id, address: req.body.userAdressSet};
                Client.updateAddress(ps_res).then(() => {
                    req.session.user.address = ps_res.address
                    req.session.save(function (err) {
                    })
                }).catch(() => {
                    rep.status(500).send({messageError: "Impossible de mettre à jour l'adresse."});
                })
            })
        }

        if (req.body.userPhoneSet){
            user_req.then(user=>{
                let ps_res={id:user.id ,mobile:req.body.userPhoneSet};
                Client.updateMobile(ps_res).then(()=>{
                    req.session.user.mobile=ps_res.mobile
                    req.session.save( function(err) {})
                }).catch(()=>{
                    rep.status(500).send({messageError : "Impossible de mettre à jour le numéro de téléphone."});
                })
            })
        }

        rep.status(200).send({messageSuccess: 'Vos informations ont bien été misent à jour.'});

    }).catch(err => {
        if (!(typeof err === 'string' || err instanceof String)) err="Veillez saisir correctement vos informations.";
        rep.status(500).send({messageError : err});
    });

}

// create new commande
/*exports.createCommande = function (req, rep) {
    Commande.createCommande(req, rep);
};*/


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

/*exports.showCarte = function (req, rep) {
    rep.send('HOME: main menu page');
};*/

//---------------------- Basic client --------------------------------------------------

/*/!* add new client to database *!/
exports.addClient = function (req, rep) {
    Client.addClient(req, rep);
};

/!* get list of clients *!/
exports.getClient = function (req, rep) {
    Client.getClientByID(req, rep);
};

/!* get list of clients *!/
exports.getListClients = function (req, rep) {
    Client.getListClients(req, rep);
};

/!* remouve client from list *!/
exports.deleteClient = function (req, rep) {
    Client.deleteClient(req, rep);
};*/

//---------------------- Registered client ----------------------------------------------
/* connecttion for registered client */
exports.signIn = function (req, rep) {
    Client.getClientByEmail(req.body.email).then(response => {
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
        Client.getNbrClientByEmail(req.body.email).then(res => {
            if (parseInt(res.rows[0].count) === 0) return res;
            else throw "Cette adresse électronique est déjà utilisé.";
        }).then(async () => {
            const hash = await hashPassword(req.body.pw);
            if (hash) return hash;
            else throw "Impossible de créer votre compte.";
        }).then(hash=>{
            req.body.pw = hash;
            try{
                Client.addRegisteredClient(req, rep).then(() => {
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

/*exports.updateRegisteredClient = function (req, rep) {
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
};*/

exports.deleteRegisteredClient = function (req, rep) {
    Client.deleteRegisteredClient(req, rep);
};