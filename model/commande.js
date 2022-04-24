const db = require('./db');

class Commande {
    
    async addPlatToCommande (id_contenu, id_plat, quantite){  
        const rez = await db.query("INSERT INTO contenu_commande (id_contenu, id_plat, quantite) VALUES ($1, $2, $3) RETURNING *;", [id_contenu, id_plat, quantite]);   
        res.json(rez.rows[0]);
    };

    async deletePlatFromCommande (id_contenu, id_plat){ 
        const plat = await db.query("DELETE FROM contenu_commande WHERE id_contenu = $1 AND id_plat = $2;", [id_contenu, id_plat]);       
        res.json(plat.rows);
    };

    async createCommande (req, res){
        const now = new Date();       
        const {client, contenu} = req.body;        
        const prix = await db.query(
    "SELECT sum(plats.prix * contenu_commande.quantite) FROM contenu_commande INNER JOIN plats ON (contenu_commande.id_plat = plats.id_plat) WHERE id_contenu = $1;", [contenu]);        
        const newCommande = await db.query(
    "INSERT INTO commande (date_commande, id_client, id_contenu, prix_commande) VALUES ($1, $2, $3, $4) RETURNING *;", [now, client, contenu, prix]);        
        res.json(newCommande.rows[0]);
    };

    async getOldestCommande (req, res){        
        const oldest = await db.query(
    "SELECT commande.id_commande, client.nom, client.adr_client, client.mobile, commande.prix_commande, livraison.prix_livraison FROM client INNER JOIN (commande INNER JOIN livraison ON commande.id_commande = livraison.id_commande) ON commande.id_client = client.id_client WHERE (livraison.effectue = FALSE) AND date_commande = (SELECT min(date_commande) FROM commande);");
        res.json(oldest.rows[0]);
    };
}

module.exports = new Commande();