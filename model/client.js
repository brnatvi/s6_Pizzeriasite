const pg = require('pg');


function User() {   
    this.id = '19';
    this.address = 'his address'

    this.showCarte = function () {
        return ("Show carte - business logic with BD");
    };

    this.registrClient = function () {
        return ("Registrement - business logic with BD");
    };

    this.loginClient = function () {
        return [this.id, this.address];
    };
        
    this.showPanier = function () {
        return ("Show panier - business logic with BD");
    };
    
}

module.exports = new User();
