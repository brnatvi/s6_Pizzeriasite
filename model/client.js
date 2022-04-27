const db = require('./db');

    //TODO remove RETURNING* (not all !!!!) and res.json at the end of debugging
class Client {


    //--------------- Basic client --------------------------------------------

    /*async addClient (req, res){
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
    };*/

    async getNbrClientByEmail (req, res){
        const email = req.body.email;
        return await db.query("SELECT COUNT(*) FROM security_client WHERE email = $1;", [email]);
    }

    async getClientByEmail (req, res){
        const emailreq = req.body.email;
        let respsec= await db.query("SELECT id_client, pw FROM security_client WHERE email = $1;", [emailreq]);
        let respnrm= await db.query("SELECT nom, prenom, adr_client, mobile FROM client WHERE id_client = $1;", [respsec.rows[0].id_client]);
        return {nom: respnrm.rows[0].nom, prenom: respnrm.rows[0].prenom, address: respnrm.rows[0].adr_client, mobile: respnrm.rows[0].mobile, email: emailreq, pw: respsec.rows[0].pw};
    }

    /*async getListClients (req, res){
        const users = await db.query("SELECT * FROM client;");
        res.json(users.rows);
    };*/

    //-------------- Registred client -----------------------------------------    
    
    async addRegisteredClient (req, res){
        const {nom, prenom, address, mobile, email, pw} = req.body;
        const newId = await db.query("INSERT INTO client (nom, prenom, adr_client, mobile) VALUES ($1, $2, $3, $4) RETURNING id_client;", [nom, prenom, address, mobile]);
        const id = newId.rows[0].id_client;       
        await db.query("INSERT INTO security_client (id_client, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, ""]);
    };

    /*async deleteRegisteredClient (req, res){
        const id = req.params.id;
        await db.query("DELETE FROM security_client WHERE id_client = $1;", [id]);
    };*/

    async updateMail(req) {
        const { id, email } = req;
        return await db.query("UPDATE security_client SET email = $2 WHERE id_client = $1 RETURNING *;", [id, email]);
    };

    async updatePassword(req) {
        const { id, pw} = req;
        return await db.query("UPDATE security_client SET pw = $2 WHERE (id_client = $1) RETURNING *;", [id, pw]);
    };

    async updateAddress(req){
        const {id, address} = req;
        return await db.query("UPDATE client SET adr_client = $2 WHERE id_client = $1 RETURNING *;", [id, address]);
    };

    async updateMobile(req){
        const {id, mobile} = req;
        return await db.query("UPDATE client SET mobile = $2 WHERE id_client = $1 RETURNING *;", [id, mobile]);
    };

    /*async updateNom(req, res){
        const {id, nom} = req.body;
        const updated = await db.query("UPDATE client SET nom = $2 WHERE id_client = $1 RETURNING *;", [id, nom]);
        res.json(updated.rows);       
    };

    async updatePrenom(req, res){
        const {id, prenom} = req.body;
        const updated = await db.query("UPDATE client SET prenom = $2 WHERE id_client = $1 RETURNING *;", [id, prenom]);
        res.json(updated.rows);       
    };*/
}

module.exports = new Client();
