const pg = require('pg');

function Livreur() {    
    this.nom = "alis";
    this.prenom = "boba";
    this.adres = "";

    this.registrLivreur = function (req, rep) {
       this.nom = req.body.nom;
       console.log(this.nom);
       this.prenom = req.body.prenom;
       console.log(this.prenom);
       return [this.nom, this.prenom];                  
    };

    this.connectLivreur = function () {
        return ("Connect - business logic with BD");
    };

    this.updateCommandeHistory = function () {
        return ("Ajouter nouvelle commande livree - business logic with BD");
    };
}

module.exports = new Livreur();
