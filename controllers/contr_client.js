
const Client = require("../model/client.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Client/User --------------------

exports.index = function (req, rep) {
    rep.render('../views/index'); 
};

exports.showCarte = function (req, rep) {
    rep.send('HOME: main menu page');
};

//------------------------------------------------------------------------

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

/* update info client */
exports.updateClient = function (req, rep) {
    Client.updateClient(req, rep);   
};

/* remouve client from list */
exports.deleteClient = function (req, rep) {
    Client.deleteClient(req, rep);   
};

exports.addRegisteredClient = function (req, rep) {
    Client.addRegisteredClient(req, rep);   
};

exports.updateMail = function (req, rep) {
    Client.updateMail(req, rep);   
};

exports.updatePassword = function (req, rep) {
    Client.updatePassword(req, rep);   
};
