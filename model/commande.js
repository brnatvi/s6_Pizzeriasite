const db = require('./db');

class Commande {

    
    // get oldest commande from all undelivered
    async getOldestCommande (req, res){         
        const oldest = await db.query(
    "SELECT id_commande, nom, adr_client, mobile FROM client INNER JOIN commande ON commande.id_client = client.id_client WHERE date_commande = (SELECT min(date_commande) FROM commande WHERE (commande.status_commande = 'undelivered'));");
        res.json(oldest.rows);
    };

    // change status of commande to 'delivered'
    async updateStatusDelivered (req, res){  
        const {id_commande} = req.body;       
        await db.query("UPDATE commande SET status_commande = 'delivered' WHERE id_commande = $1;", [id_commande]);        
    };
      
    // change status of commande to 'inprogress'
    async updateStatusInprogress (req, res){  
        const {id_commande} = req.body;       
        await db.query("UPDATE commande SET status_commande = 'inprogress' WHERE id_commande = $1;", [id_commande]);        
    };
}

module.exports = new Commande();