const db = require('./db');

class Client {   
    
    async createClient (req, res){
        const {nom, prenom, address} = req.body;
        const newPerson = await db.query("INSERT INTO client (nom, prenom, adr_client) VALUES ($1, $2, $3);", [nom, prenom, address]);
        res.json(newPerson.rows);
    }

    async getUsers (req, res){

    }

    async getOneUser (req, res){

    }

    async updateUser (req, res){

    }

    async deleteUser (req, res){

    }    
}

module.exports = new Client();
