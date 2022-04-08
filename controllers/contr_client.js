const Client = require("../model/client.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Client/User --------------------

exports.index = function (req, rep) {
    rep.render('../views/index'); 
};

exports.showCarte = function (req, rep) {
    rep.send('HOME: main menu page');
};

exports.registrClient = function (req, rep) {
    const r = Client.createClient();
    rep.json(r);    
};

exports.loginClient = function (req, rep) {
    const info = Client.loginClient();
    rep.json(info);
};

exports.showPanier = function (req, rep) {
    const info = Client.showPanier();
    rep.json(info);
};

exports.deleteItem = function (req, rep) {
    rep.send("delete item from panier");
};
