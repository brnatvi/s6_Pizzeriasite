const db = require('./db');
const livreur = require('./livreur');

class Commande {

    isEmpty = function (obj) {
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    };

    ////////////// create new commande and contenu_commande in BD
    async createCommande(newObj) {

        /////////////////////// find client  ///////////////////////
        const idClient = await db.query("SELECT id_client FROM security_client WHERE email = $1;", [newObj.emailClient]);

        ///////////////////////  create new commande -> id_commande  ///////////////////////
        const newCommande = await db.query(
            "INSERT INTO commande (date_commande, id_client, date_livraison) VALUES (CURRENT_TIMESTAMP, $1, $2) RETURNING id_commande;", [idClient.rows[0].id_client, newObj.deliveryDate]);
        const id_command = newCommande.rows[0].id_commande;

        let total = 0;
        ///////////////////////  fill items  ///////////////////////
        const isEmpty = this.isEmpty(newObj.articles);
        if (!isEmpty) {

            const keys = Object.keys(newObj.articles);
            const values = Object.values(newObj.articles);
            const lenItems = keys.length;

            /////////////////////// fill next items ///////////////////////////////
            for (let i = 0; i < lenItems; i++) {

                let plat = parseInt(keys[i]);
                let size = Object.keys(values[i])[0];
                let quant = parseInt(Object.values(values[i])[0]);

                // find price
                const newPrix = await db.query("SELECT prix FROM plat_size WHERE size = $1 AND id_plat = $2;", [size, plat]);

                total += (newPrix.rows[0].prix * quant);

                await db.query("INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, plat, quant, size]);
            }
        }

        ////////////////////////// fill menus ///////////////////////////////
        const lenMenus = newObj.menus.length;

        for (let k = 0; k < lenMenus; k++) {
            let plat = 0;
            let type = newObj.menus[k].type;
            if (type === 'mega') { plat = 26 }
            else if (type === 'extra') { plat = 27 }
            else { plat = 28 }

            const quant = newObj.menus[k].quantity;

            await db.query(
                "INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, plat, quant, 'unique']);

            total += newObj.menus[k].price * quant;
        }

        /////////////////  fill customs ///////////////////////////////
        const lenCustoms = newObj.customs.length;

        for (let j = 0; j < lenCustoms; j++) {

            const price = newObj.customs[j].price;
            const quant = newObj.customs[j].quantity;
            const size = newObj.customs[j].size;

            await db.query(
                "INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, 25, quant, size]);

            total += (quant * price);
        }

        ////////////////////////// add total to bd  ///////////////////////////////
        await db.query("UPDATE commande SET sum_total = ($1 + 0.0) WHERE id_commande = $2;", [total, id_command]);
    };


    /////////// create new commande and contenu_commande in BD
    async createCommandeUnreg(newObj) {

        /////////////////////// create new client  ///////////////////////
        const newClient = await db.query(
            "INSERT INTO client(nom, prenom, adr_client, mobile, autre) VALUES ($1, $2, $3, $4, $5) RETURNING id_client;", [newObj.nom, newObj.prenom, newObj.adresse, newObj.portable, newObj.otherInfo]);

        ///////////////////////  create new commande -> id_commande  ///////////////////////
        const newCommande = await db.query(
            "INSERT INTO commande (date_commande, id_client, date_livraison) VALUES (CURRENT_TIMESTAMP, $1, $2) RETURNING id_commande;", [newClient.rows[0].id_client, newObj.deliveryDate]);
        const id_command = newCommande.rows[0].id_commande;

        let total = 0;
        ///////////////////////  fill items  ///////////////////////
        const isEmpty = this.isEmpty(newObj.articles);
        if (!isEmpty) {

            const keys = Object.keys(newObj.articles);
            const values = Object.values(newObj.articles);
            const lenItems = keys.length;

            /////////////////////// fill next items ///////////////////////////////
            for (let i = 0; i < lenItems; i++) {

                let plat = parseInt(keys[i]);
                let size = Object.keys(values[i])[0];
                let quant = parseInt(Object.values(values[i])[0]);

                // find price
                const newPrix = await db.query("SELECT prix FROM plat_size WHERE size = $1 AND id_plat = $2;", [size, plat]);

                total += (newPrix.rows[0].prix * quant);

                await db.query("INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, plat, quant, size]);
            }
        }

        ////////////////////////// fill menus ///////////////////////////////
        const lenMenus = newObj.menus.length;

        for (let k = 0; k < lenMenus; k++) {
            let plat = 0;
            let type = newObj.menus[k].type;
            if (type === 'mega') { plat = 26 }
            else if (type === 'extra') { plat = 27 }
            else { plat = 28 }

            const quant = newObj.menus[k].quantity;

            await db.query(
                "INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, plat, quant, 'unique']);

            total += newObj.menus[k].price * quant;
        }

        /////////////////  fill customs ///////////////////////////////
        const lenCustoms = newObj.customs.length;

        for (let j = 0; j < lenCustoms; j++) {

            const price = newObj.customs[j].price;
            const quant = newObj.customs[j].quantity;
            const size = newObj.customs[j].size;

            await db.query(
                "INSERT INTO contenu_commande VALUES ($1, $2, $3, $4);", [id_command, 25, quant, size]);

            total += (quant * price);
        }

        ////////////////////////// add total to bd  ///////////////////////////////
        await db.query("UPDATE commande SET sum_total = ($1 + 0.0) WHERE id_commande = $2;", [total, id_command]);
    };
    

    // get oldest commande from all undelivered
    async getOldestCommande(req, res) {
        const oldest = await db.query("SELECT id_commande, sum_total, nom, prenom, adr_client, mobile, (SELECT to_char(date_livraison::timestamp, 'DD Mon YYYY HH:MI:SSPM')) AS date_livraison FROM client INNER JOIN commande ON commande.id_client = client.id_client WHERE date_commande = (SELECT min(date_commande) FROM commande WHERE (commande.status_commande = 'undelivered'));");
        let contenu = [];
        if (oldest.rows[0]===undefined)return ({info:{},contenu});
        const ret = await db.query(
            "SELECT id_plat, size FROM contenu_commande WHERE id_commande = $1;", [oldest.rows[0].id_commande]);           

        for (let i = 0; i < ret.rows.length; i++) {
            const price = await db.query("SELECT prix FROM plat_size WHERE id_plat = $1 AND size = $2;", [ret.rows[i].id_plat, ret.rows[i].size]);
            const descr = await db.query("SELECT nom, descript FROM plats WHERE id_plat = $1;", [ret.rows[i].id_plat]);
            contenu.push({ plat: descr.rows[0].nom, prix: price.rows[0].prix, description: descr.rows[0].descript });
        }
        return ({ info: oldest.rows[0], contenu });
    };

    // get current commande of livreur
    async getCurrentCommande(livreur) {        

        const idCommande = await db.query(
            "SELECT current_commande FROM livreur INNER JOIN security_livreur ON livreur.id_livr = security_livreur.id_livr WHERE nom = $1 AND prenom = $2 AND email = $3;", [livreur.nom, livreur.prenom, livreur.email]);
        console.log("current_commande : "+JSON.stringify(idCommande.rows[0].current_commande))
        const infoClient = await db.query("SELECT id_commande, sum_total, nom, prenom, adr_client, mobile, (SELECT to_char(date_livraison::timestamp, 'DD Mon YYYY HH:MI:SSPM')) AS date_livraison FROM client INNER JOIN commande ON commande.id_client = client.id_client WHERE id_commande = $1;", [idCommande.rows[0].current_commande]);
        let contenu = [];
        if (infoClient.rows[0]===undefined)return ({info:{},contenu});
        const ret = await db.query(
            "SELECT id_plat, size FROM contenu_commande WHERE id_commande = $1;", [infoClient.rows[0].id_commande]);


        for (let i = 0; i < ret.rows.length; i++) {
            
            console.log(">-1-<" + JSON.stringify(ret.rows))
            const price = await db.query("SELECT prix FROM plat_size WHERE id_plat = $1 AND size = $2;", [ret.rows[i].id_plat, ret.rows[i].size]);
            const descr = await db.query("SELECT nom, descript FROM plats WHERE id_plat = $1;", [ret.rows[i].id_plat]);
            contenu.push({ plat: descr.rows[0].nom, prix: price.rows[0].prix, description: descr.rows[0].descript });           
        }
        return ({ info: infoClient.rows[0], contenu });
    };


    // change status of commande to 'delivered'
    async updateStatusDelivered(id_commande) {
        await db.query("UPDATE commande SET status_commande = 'delivered' WHERE id_commande = $1;", [id_commande]);
    };
    

    // change status of commande to 'inprogress'
    async updateStatusInprogress(id_commande) {
        await db.query("UPDATE commande SET status_commande = 'inprogress' WHERE id_commande = $1;", [id_commande]);
    };
}

module.exports = new Commande();