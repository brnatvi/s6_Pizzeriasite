
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
    Client.createClient(req, rep);   
};

