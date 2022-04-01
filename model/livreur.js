const pg = require('pg');

function Livreur() {

    this.registrLivreur = function () {
        return ("Registr - business logic with BD");
    };

    this.connectLivreur = function () {
        return ("Connect - business logic with BD");
    };

    this.updateCommandeHistory = function () {
        return ("Ajouter nouvelle commande livree - business logic with BD");
    };

}

module.exports = new Livreur();
