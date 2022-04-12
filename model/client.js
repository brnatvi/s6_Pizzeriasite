const db = require('./db');

    //TODO remove RETURNING* (not all !!!!) and res.json at the end of debugging
class Client {

    //--------------- Basic client --------------------------------------------

    async addClient (req, res){
        const {nom, prenom, address, mobile} = req.body;
        const newPerson = await db.query("INSERT INTO client (nom, prenom, adr_client, mobile) VALUES ($1, $2, $3, $4) RETURNING *;", [nom, prenom, address, mobile]);        
        res.json(newPerson.rows[0]);
    };

    async deleteClient (req, res){
        const id = req.params.id;
        await db.query("DELETE FROM client WHERE id_client = $1;", [id]);
    };

    async getClientByID (req, res){
        const id = req.params.id;
        const person = await db.query("SELECT nom, prenom, adr_client, mobile FROM client WHERE id_client = $1;", [id]);
        res.json(person.rows[0]);
    };

    async getListClients (req, res){
        const users = await db.query("SELECT * FROM client;");
        res.json(users.rows[0]);
    };

    //-------------- Registred client -----------------------------------------    
    
    async addRegisteredClient (req, res){
        const {nom, prenom, address, mobile, email, pw, resetToken} = req.body;
        const newId = await db.query("INSERT INTO client (nom, prenom, adr_client, mobile) VALUES ($1, $2, $3, $4) RETURNING id_client;", [nom, prenom, address, mobile]);
        const id = newId.rows[0].id_client;       
        const person = await db.query("INSERT INTO security_client (id_client, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, resetToken]);
        res.json(person.rows[0]);
    };

    async deleteRegisteredClient (req, res){
        const id = req.params.id;
        await db.query("DELETE FROM security_client WHERE id_client = $1;", [id]);
    };    

    async updateMail(req, res){
        const {id, email} = req.body;
        const updated = await db.query("UPDATE security_client SET email = $2 WHERE id_client = $1 RETURNING *;", [id, email]);
        res.json(updated.rows);       
    };

    async updatePassword(req, res){
        const {email, pw, resetToken} = req.body;
        const updated = await db.query("UPDATE security_client SET pw = $3 WHERE (email = $1 AND resetToken = $2) RETURNING *;", [email, resetToken, pw]);
        res.json(updated.rows);       
    };
}

module.exports = new Client();
