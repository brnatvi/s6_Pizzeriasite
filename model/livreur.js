const db = require('./db');

/*function Livreur() {
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
}*/

class Livreur {
    async addRegisteredDeliveryMan(req, rep) {
        const {nom, prenom, email, pw} = req.body;
        const newId = await db.query("INSERT INTO livreur (nom, prenom) VALUES ($1, $2) RETURNING id_livr;", [nom, prenom]);
        const id = newId.rows[0].id_livr;
        await db.query("INSERT INTO security_livreur (id_livr, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, ""]);
    }

    async getNbrDeliveryManByMail(req, rep) {
        const email = req.body.email;
        return await db.query("SELECT COUNT(*) FROM security_livreur WHERE email = $1;", [email]);
    }

    async getDeliveryManByEmail (req, res){
        const email = req.body.email;
        return await db.query("SELECT email, pw FROM security_livreur WHERE email = $1;", [email]);
    }

}

module.exports = new Livreur();
