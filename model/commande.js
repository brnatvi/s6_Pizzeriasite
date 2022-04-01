const pg = require('pg');

function Commande() {   

    this.showCommande = function (req, rep) {
        return ("Show Commande - business logic with BD");
    };

    this.updateCommande = function (req, rep) {
        return ("Update commande - business logic with BD");
    };
   
}

module.exports = new Commande();