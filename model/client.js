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


    //-------------- Create / delete client -----------------------------------------
    
    async addUser (req, res){
        const {nom, prenom, address, mobile, email, pw, autre} = req.body;
        const newId = await db.query("INSERT INTO client (nom, prenom, adr_client, mobile, autre) VALUES ($1, $2, $3, $4, $5) RETURNING id_client;", [nom, prenom, address, mobile, autre]);
        const id = newId.rows[0].id_client;       
        await db.query("INSERT INTO security_client (id_client, email, pw, resetToken) VALUES ($1, $2, $3, $4) RETURNING *;", [id, email, pw, ""]);
    };

    async deleteUser (id){
        await db.query("DELETE FROM client WHERE id_client = $1;", [id]);
    };

    //-------------- Update data -----------------------------------------

    async updateAutre(req) {
        const { id, autre } = req;
        return await db.query("UPDATE client SET autre = $2 WHERE id_client = $1 RETURNING *;", [id, autre]);
    };

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

    addCustomCartItem(req, pricePizza, sizePizza, ingredients, ingredientsInfo) {
        let flag=false;
        let nbrCustom=req.session.user.cartItem.custom.length;
        let positionItem;
        for (let i=0; i<nbrCustom; i++){
            if (req.session.user.cartItem.custom[i]!==null){
                let el=req.session.user.cartItem.custom[i];
                if (JSON.stringify(el["ingredients"]) === JSON.stringify(ingredients)){
                    if (JSON.stringify(el["size"]) === JSON.stringify(sizePizza)){
                        flag=true;
                        el["quantity"]+=1;
                        positionItem=i;
                        break;
                    }
                }
            }
        }
        //add new menu
        if (!flag){
            req.session.user.cartItem.custom.splice(nbrCustom, 0, {"ingredients":ingredients, "ingredientsInfo":ingredientsInfo, "size":sizePizza, "quantity":1, "price":pricePizza});
            positionItem=nbrCustom;
        }
        req.session.user.cartItem.price+=pricePizza;
        return positionItem;
    }

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
