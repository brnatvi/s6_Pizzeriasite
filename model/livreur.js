const db = require('./db');

class Livreur {

    //--------------- Customer data --------------------------------------------

    async getNbrUserByEmail(req) {
        const email = req;
        return await db.query("SELECT COUNT(*) FROM security_livreur WHERE email = $1;", [email]);
    }

    async getUserByEmail(req) {
        const emailreq = req;
        let respsec= await db.query("SELECT id_livr, pw FROM security_livreur WHERE email = $1;", [emailreq]);
        if (respsec.rows[0]===undefined)return undefined;
        let respnrm= await db.query("SELECT nom, prenom FROM livreur WHERE id_livr = $1;", [respsec.rows[0].id_livr]);
        let res = {id: respsec.rows[0].id_livr, nom: respnrm.rows[0].nom, prenom: respnrm.rows[0].prenom, email: emailreq, pw: respsec.rows[0].pw};
        return res;
    }


    //-------------- Create livreur -----------------------------------------

    async addUser(req) {
        const { nom, prenom, email, pw } = req.body;
        const newId = await db.query("INSERT INTO livreur (nom, prenom) VALUES ($1, $2) RETURNING id_livr;", [nom, prenom]);
        const id = newId.rows[0].id_livr;
        await db.query("INSERT INTO security_livreur (id_livr, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, ""]);
    }


    //-------------- Update data -----------------------------------------

    async updateMail(req) {
        const { id, email } = req;
        return await db.query("UPDATE security_livreur SET email = $2 WHERE id_livr = $1 RETURNING *;", [id, email]);
    };

    async updatePassword(req) {
        const { id, pw} = req;
        return await db.query("UPDATE security_livreur SET pw = $2 WHERE (id_livr = $1) RETURNING *;", [id, pw]);
    };


    //---------------------- TODO : WIP: Basic delivery man --------------------------------------------------

    //TODO remove RETURNING* (not all !!!!) and res.json at the end of debugging

    async getNbrLivreurByEmail (req){
        const email = req.email;
        return await db.query("SELECT COUNT(*) FROM security_livreur WHERE email = $1;", [email]);
    }

    async getLivreurByEmail(req, bool) {
        let emailreq = (!bool)?req.body.email:req.session.user.email;
        let respsec= await db.query("SELECT id_livr, pw FROM security_livreur WHERE email = $1;", [emailreq]);
        let respnrm= await db.query("SELECT nom, prenom FROM livreur WHERE id_livr = $1;", [respsec.rows[0].id_livr]);
        let res = {nom: respnrm.rows[0].nom, prenom: respnrm.rows[0].prenom, email: emailreq, pw: respsec.rows[0].pw};
        return res;
    }

    async getLivreurByEmail(req) {
        const email = req.body.email;
        return await db.query("SELECT email, pw FROM security_livreur WHERE email = $1;", [email]);
    }

    async getLivreurByID(req, res) {
        const id = req.params.id;
        const person = await db.query("SELECT nom, prenom FROM livreur WHERE id_livr = $1;", [id]);
        res.json(person.rows[0]);
    };

    async getListLivreurs(req, res) {
        const livr = await db.query("SELECT * FROM livreur;");
        res.json(livr.rows);
    };

    async deleteLivreur(req, res) {
        const id = req.params.id;
        await db.query("DELETE FROM livreur WHERE id_livr = $1;", [id]);
    };

    async updateNom(req, res) {
        const { id, nom } = req.body;
        const updated = await db.query("UPDATE livreur SET nom = $2 WHERE id_livr = $1 RETURNING *;", [id, nom]);
        res.json(updated.rows);
    };

    async updatePrenom(req, res) {
        const { id, prenom } = req.body;
        const updated = await db.query("UPDATE livreur SET prenom = $2 WHERE id_livr = $1 RETURNING *;", [id, prenom]);
        res.json(updated.rows);
    };

    //--------------- change current_commande -----------------------------

    async updateCurrentCommande(req, res) {
        const { id_livr, id_commande } = req.body;
        const updated = await db.query("UPDATE livreur SET current_commande = $1 WHERE id_livr = $2;", [id_commande, id_livr]);
        res.json(updated.rows);
    };

}


module.exports = new Livreur();