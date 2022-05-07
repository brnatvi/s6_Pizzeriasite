const db = require('./db');

    //TODO remove RETURNING* (not all !!!!) and res.json at the end of debugging
class Client {

    //--------------- Customer data --------------------------------------------

    async getNbrUserByEmail (req){
        const email = req;
        return await db.query("SELECT COUNT(*) FROM security_client WHERE email = $1;", [email]);
    }

    async getUserByEmail (req, res){
        const emailreq = req;
        let respsec= await db.query("SELECT id_client, pw FROM security_client WHERE email = $1;", [emailreq]);
        if (respsec.rows[0]===undefined) return undefined;
        let respnrm= await db.query("SELECT nom, prenom, adr_client, mobile FROM client WHERE id_client = $1;", [respsec.rows[0].id_client]);
        return {id: respsec.rows[0].id_client, nom: respnrm.rows[0].nom, prenom: respnrm.rows[0].prenom, address: respnrm.rows[0].adr_client, mobile: respnrm.rows[0].mobile, email: emailreq, pw: respsec.rows[0].pw};
    }


    //-------------- Create client -----------------------------------------
    
    async addUser (req, res){
        const {nom, prenom, address, mobile, email, pw} = req.body;
        const newId = await db.query("INSERT INTO client (nom, prenom, adr_client, mobile) VALUES ($1, $2, $3, $4) RETURNING id_client;", [nom, prenom, address, mobile]);
        const id = newId.rows[0].id_client;       
        await db.query("INSERT INTO security_client (id_client, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, ""]);
    };


    //-------------- Update data -----------------------------------------

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

    addMenuCartItem(req, updatePrice, menuName, listAllItemName){
        let flag=false;
        let nbrMenu=req.session.user.cartItem.menu.length;
        let positionItem;
        for (let i=0; i<nbrMenu; i++){
            if (req.session.user.cartItem.menu[i]!==null){
                let el=req.session.user.cartItem.menu[i];
                if (JSON.stringify(el["menu"]) === JSON.stringify(req.body)){
                    flag=true;
                    el["quantity"]+=1;
                    positionItem=i;
                    break;
                }
            }
        }
        //add new menu
        if (!flag){
            req.session.user.cartItem.menu.splice(nbrMenu, 0, {"menu":req.body, "quantity":1, "price":updatePrice, "type":menuName, "name":listAllItemName});
            positionItem=nbrMenu;
        }
        req.session.user.cartItem.price+=updatePrice;
        return positionItem;
    }

    // create new commande and contenu_commande in BD
    async createCommande (req, res){

        // 1. find client id
        const client = req.session.user;
        const id_client = await db.query("SELECT id_client FROM client WHERE nom = $1 AND prenom = $2 AND adr_client = $3 AND mobile = $4;", [client.nom, client.prenom, client.address, client.mobile]);
        
        // 2. create new commande -> obtain id_commande
        const id_comm = await db.query("INSERT INTO commande (date_commande, id_client) VALUES (CURRENT_TIMESTAMP, $1) RETURNING id_commande;", [id_client]); 
        
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


    

    //--------------- TODO: WIP : Basic client --------------------------------------------

    async getClientByID (req, res){
        const id = req.params.id;
        const person = await db.query("SELECT nom, prenom, adr_client, mobile FROM client WHERE id_client = $1;", [id]);
        res.json(person.rows[0]);
    };

    async getListClients (req, res){
        const users = await db.query("SELECT * FROM client;");
        res.json(users.rows);
    };

}

module.exports = new Client();
