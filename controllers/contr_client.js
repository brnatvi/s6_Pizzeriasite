const Client = require("../model/client.js");
const Commande = require("../model/commande.js");

//----------- fonctionnality available to Client/User --------------------

exports.addCartItem = function (req, rep) {
    // TODO: request bdd
    console.log("TODO: request bdd"+JSON.stringify(req.body.idPizza));
    rep.json({
        id: 1,
        name: 'Pizza Raclette',
        ingredients: 'sauce tomate . fromage à raclette ' +
            '. champignons . 8 olives noires . ' +
            '2 tranches de jambon',
        price: 5.96
    });
}

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

exports.addRegisteredClient = function (req, rep) {
    Client.addRegisteredClient(req, rep);
};

exports.updateRegisteredClient = function (req, rep) {
    if (req.body.nom) {
        Client.updateNom(req, rep);
    }
    else if (req.body.prenom) {
        Client.updatePrenom(req, rep);
    }
    else if (req.body.email) {
        Client.updateMail(req, rep);
    }
    else if (req.body.pw) {
        Client.updatePassword(req, rep);
    }
    else if (req.body.mobile) {
        Client.updateMobile(req, rep);
    }
    else if (req.body.address) {
        Client.updateAddress(req, rep);
    };
};

exports.deleteRegisteredClient = function (req, rep) {
    Client.deleteRegisteredClient(req, rep);
};
