const Client = require("../model/client.js");
const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {log} = require("util");
const Connect=require("./Connect.js");

//----------- fonctionnality available to Client/User --------------------

// create new commande
/*exports.createCommande = function (req, rep) {
    Commande.createCommande(req, rep);
};*/

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
exports.signInClient = (req, rep) => {Connect.signIn(Client, req, rep)};
exports.signUpClient = (req, rep) => {Connect.signUp(Client, req, rep)};
exports.logOutUser = (req, rep) => {Connect.disconnectUser(req.session, rep)};
exports.updateProfileClient = (req, rep) => {Connect.updateProfile(Client, req, rep)}

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