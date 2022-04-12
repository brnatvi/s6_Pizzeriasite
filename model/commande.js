const db = require('./db');

class Commande {

    async createCommande (req, res){
        const {nom, prenom, address} = req.body;
        const newPerson = await db.query("INSERT INTO client (nom, prenom, adr_client) VALUES ($1, $2, $3) RETURNING *;", [nom, prenom, address]);        
        res.json(newPerson.rows);
    };

    async getCommande (req, res){        
        const person = await db.query("SELECT nom, prenom, adr_client FROM client WHERE id_client = $1;", [id]);
        res.json(person.rows);
    };

    async update (req, res){
        const {id, nom, prenom, address} = req.body;
        const updated = await db.query("UPDATE client SET nom = $2, prenom = $3, adr_client = $4 WHERE id_client = $1 RETURNING *;", [id, nom, prenom, address]);
        res.json(updated.rows);
    };

    async deleteUser (req, res){
        const id = req.params.id;
        await db.query("DELETE FROM client WHERE id_client = $1;", [id]);
    };
   
}

module.exports = new Commande();