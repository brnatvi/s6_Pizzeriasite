const db = require('./db');

class Livreur {    

    //TODO remove RETURNING* (not all !!!!) and res.json at the end of debugging

    async getLivreurByID (req, res){
        const id = req.params.id;
        const person = await db.query("SELECT nom, prenom FROM livreur WHERE id_livr = $1;", [id]);
        res.json(person.rows[0]);
    };

    async getListLivreurs (req, res){
        const livr = await db.query("SELECT * FROM livreur;");
        res.json(livr.rows);
    };       
    
    async addLivreur (req, res){
        const {nom, prenom, email, pw} = req.body;
        const newId = await db.query("INSERT INTO livreur (nom, prenom) VALUES ($1, $2) RETURNING id_livr;", [nom, prenom]);
        const id = newId.rows[0].id_livr;       
        const person = await db.query("INSERT INTO security_livreur (id_livr, email, pw) VALUES ($1, $2, $3) RETURNING *;", [id, email, pw]);
        res.json(person.rows[0]);
    };

    async deleteLivreur (req, res){
        const id = req.params.id;
        await db.query("DELETE FROM livreur WHERE id_livr = $1;", [id]);
    };    
    
    async updateMail(req, res){
        const {id, email} = req.body;
        const updated = await db.query("UPDATE security_livreur SET email = $2 WHERE id_livr = $1 RETURNING *;", [id, email]);
        res.json(updated.rows);       
    };

    async updatePassword(req, res){
        const {id, email, pw, resetToken} = req.body;
        const updated = await db.query("UPDATE security_livreur SET pw = $4 WHERE (id_livr = $1 AND email = $2 AND resetToken = $3) RETURNING *;", [id, email, resetToken, pw]);
        res.json(updated.rows);       
    };

    async updateNom(req, res){
        const {id, nom} = req.body;
        const updated = await db.query("UPDATE livreur SET nom = $2 WHERE id_livr = $1 RETURNING *;", [id, nom]);
        res.json(updated.rows);       
    };

    async updatePrenom(req, res){
        const {id, prenom} = req.body;
        const updated = await db.query("UPDATE livreur SET prenom = $2 WHERE id_livr = $1 RETURNING *;", [id, prenom]);
        res.json(updated.rows);       
    };
}


module.exports = new Livreur();