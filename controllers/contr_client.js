const User = require("../model/client.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Client/User --------------------

exports.index = function (req, rep) {    
    rep.render('../views/index',{
        params: {
            title: 'index'
        }
    });
};

exports.showCarte = function (req, rep) {
    rep.send('HOME: main menu page');
};

exports.registrClient = function (req, rep) {
    const info = User.registrClient();  
    rep.json(info); 
};

exports.loginClient = function (req, rep) {
    const info = User.loginClient();  
    rep.json(info);   
};

exports.showPanier = function (req, rep) {
    const info = User.showPanier();  
    rep.json(info);
};

exports.deleteItem = function (req, rep) {
    rep.send("delete item from panier");
};
