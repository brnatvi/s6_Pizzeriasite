const Client = require("../model/client.js");
const Livreur = require("../model/livreur.js");
const Commande = require("../model/commande.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {log} = require("util");
const Connect=require("./Connect.js");
const Article=require("../model/article");

//----------- fonctionnality available to Client/User --------------------

// create new commande
/*exports.createCommande = function (req, rep) {
    Commande.createCommande(req, rep);
};*/

//TODO: pizza recommandation?

exports.infoCartItem = function (req, rep) {
    Article.getArticleById(req.body.idArticle).then(articles=>{
        rep.json(articles);
    }).catch(err=>{console.log("infoCartItem"+JSON.stringify(err))});
}


exports.addCartItem = function (req, rep) {
    console.log("req.body.idArticle"+JSON.stringify(req.body))
    Article.getArticleById(req.body.idArticle).then(articles=>{
        //update session price
        let total=parseFloat(req.session.user.cartItem.price)+parseFloat(articles.price);
        req.session.user.cartItem.price=(total<0)?0:total;
        //update session cart item
        if (req.session.user.cartItem.idQuantity[articles.id]!==undefined){
            req.session.user.cartItem.idQuantity[articles.id]+=1;
        }else req.session.user.cartItem.idQuantity[articles.id]=1;

        console.log("JSON.stringify(req.session.user)>"+JSON.stringify(req.session.user))

        rep.json(articles);
    }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
}

exports.removeCartItem = function (req, rep) {
    Article.getArticleById(req.body.idArticle).then(articles=>{
        //update session price
        let total=parseFloat(req.session.user.cartItem.price)-parseFloat(articles.price);
        req.session.user.cartItem.price=(total<0)?0:total;

        //update session cart item
        if (req.session.user.cartItem.idQuantity[articles.id]!==undefined){
            if (req.session.user.cartItem.idQuantity[articles.id]>1){
                req.session.user.cartItem.idQuantity[articles.id]-=1;
            }else{
                delete req.session.user.cartItem.idQuantity[articles.id];
            }
        }else req.session.user.cartItem.idQuantity[articles.id]=1;

        rep.json(articles);
    }).catch(err=>{console.log("removeCartItem"+JSON.stringify(err))});

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
    Article.getAllArticle().then(articles=>{
        let resRequestBdd=articles.rows;
        if(req.session.user!==undefined){
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
                    list: resRequestBdd,
                    isLogued: false
                }
            });
        }
    }).catch(err=>{console.log("err"+JSON.stringify(err))})
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

exports.signInClient = (req, rep) => {Connect.signIn(Client, req, rep)};
exports.signUpClient = (req, rep) => {Connect.signUp(Client, req, rep)};
exports.logOutUser = (req, rep) => {Connect.disconnectUser(req.session, rep)};
exports.updateProfileClient = (req, rep) => {Connect.updateProfile(Client, req, rep)}

/*
exports.deleteRegisteredClient = function (req, rep) {
    Client.deleteRegisteredClient(req, rep);
};*/
