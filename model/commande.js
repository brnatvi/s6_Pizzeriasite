const db = require('./db');

class Commande {

    // create new commande and contenu_commande in BD
    async createCommande (req, res){

        // 1. find client id
        const client = req.session.user;
        console.log(client);
        const id_client = await db.query("SELECT id_client FROM client WHERE nom = $1 AND prenom = $2 AND adr_client = $3 AND mobile = $4;", [client.nom, client.prenom, client.address, client.mobile]);
        
        // 2. create new commande -> obtain id_commande
        const id_comm = await db.query("INSERT INTO commande (date_commande, id_client) VALUES (CURRENT_TIMESTAMP, $1) RETURNING id_commande;", [id_client]); 
        console.log(id_comm);
        // 3. fill contenu_commande
        if (client.cartItem !== null)
        {
            // fill items
            let k = 0;
            while (client.cartItem.idQuantity !== null)
            {   
                await db.query("INSERT INTO contenu_commande (id_commande, id_plat, size) VALUES ($1, $2, $3);", [id_comm, client.cartItem.idQuantity[k], req.session.user.cartItem.idQuantity[k][SIZE]]);                
                k++;
                
            }

            // fill menus
            const len = client.cartItem.menu.length;
            for (let i = 0; i < len; i++)
            {
                if (client.cartItem.menu[i] !== null) 
                {    
                    await db.query("INSERT INTO contenu_commande (id_commande, id_plat, quantite) VALUES ($1, $2, $3);", [id_comm, client.cartItem.menu[i], client.cartItem.menu[i]["quantity"]]);                    
                }
            }            
        }        
        
        // 4. calculate total sum of commande        
        const total = await db.query(
    "SELECT sum(plats.prix * contenu_commande.quantite) FROM contenu_commande INNER JOIN plats ON (contenu_commande.id_plat = plats.id_plat) WHERE id_commande = $1;", [id_comm]);  
        
        // 5. insert total in table commande
        await db.query("INSERT INTO commande (sum_total) VALUES ($1) WHERE id_commande = $2;", [total, id_comm]);    
    };


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