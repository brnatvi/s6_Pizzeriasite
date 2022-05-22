const db = require('./db');

class Commande {

    // create new commande and contenu_commande in BD
    async createCommande (req, res){

        const {client, panier} = req.body;
        // 1. create new commande -> 
        const id_comm = await db.query("INSERT INTO commande (date_commande, id_client) VALUES (CURRENT_TIMESTAMP, $1) RETURNING id_commande;", [client]); 
        res.json(id_comm.rows[0]);

        // 2. fill contenu_commande with id_comm     TODO need to add panier fields (id_plat, quantite) for each item of panier
       /* const id_contenu = await db.query("INSERT INTO contenu_commande (id_commande, id_plat, quantite) VALUES ($1, $2, $3) RETURNING id_contenu;", [id_comm]);

        // 3. calculate total sum of commande        
        const total = await db.query(
    "SELECT sum(plats.prix * contenu_commande.quantite) FROM contenu_commande INNER JOIN plats ON (contenu_commande.id_plat = plats.id_plat) WHERE id_contenu = $1;", [id_contenu]);  
        
        // 4. insert total in table commande
        await db.query("INSERT INTO commande (sum_total) VALUES ($1) WHERE id_commande = $2;", [total, id_comm]); */        
    };


    /*    {
        price: 35.900000000000006,
        idQuantity: { '5': { small: 1 }, '13': { unique: 1 } },
        menu: [],
        custom: [
          {
            ingredients: [Array],
            ingredientsInfo: [Array],
            size: 'small',
            quantity: 1,
            price: 17.1
          }
        ]
      }
       */

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

    // get oldest commande from all undelivered
    async getOldestCommande(req, res) {
        const oldest = await db.query("SELECT id_commande, sum_total, nom, prenom, adr_client, mobile FROM client INNER JOIN commande ON commande.id_client = client.id_client WHERE date_commande = (SELECT min(date_commande) FROM commande WHERE (commande.status_commande = 'undelivered'));");
        const ret = await db.query(
            "SELECT id_plat, size FROM contenu_commande WHERE id_commande = $1;", [oldest.rows[0].id_commande]);
        let contenu = [];
        for (let i = 0; i < ret.rows.length; i++) {
            const price = await db.query("SELECT prix FROM plat_size WHERE id_plat = $1 AND size = $2;", [ret.rows[i].id_plat, ret.rows[i].size]);
            const descr = await db.query("SELECT nom, descript FROM plats WHERE id_plat = $1;", [ret.rows[i].id_plat]);
            contenu.push({ plat: descr.rows[0].nom, prix: price.rows[0].prix, description: descr.rows[0].descript });
        }       
        return ({ info: oldest.rows[0], contenu });
    };

    // get current commande of livreur
    async getCurrentCommande(idLivreur) {
        const idCommande = await db.query("SELECT current_commande FROM livreur WHERE id_livr = &1;", [idLivreur]);
        const current = await db.query("SELECT id_commande, sum_total, nom, prenom, adr_client, mobile FROM client INNER JOIN commande ON commande.id_client = client.id_client WHERE id_commande = $1;", [idCommande]);
        const ret = await db.query(
            "SELECT id_plat, size FROM contenu_commande WHERE id_commande = $1;", [current.rows[0].id_commande]);
        let contenu = [];
        for (let i = 0; i < ret.rows.length; i++) {
            const price = await db.query("SELECT prix FROM plat_size WHERE id_plat = $1 AND size = $2;", [ret.rows[i].id_plat, ret.rows[i].size]);
            const descr = await db.query("SELECT nom, descript FROM plats WHERE id_plat = $1;", [ret.rows[i].id_plat]);
            contenu.push({ plat: descr.rows[0].nom, prix: price.rows[0].prix, description: descr.rows[0].descript });
        }       
        return ({ info: oldest.rows[0], contenu });
    };

    // accept commande for delivering
    async makeCommandeCurrent (req, res){                
        await db.query("UPDATE livreur SET current_commande = $1 WHERE id_livr = $2;", [req.body.id_commande, req.body.id_livr]);        
    };
}

module.exports = new Commande();