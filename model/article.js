const db = require("./db");

class Article {

    async getAllArticle(){
        return await db.query("SELECT * FROM plats NATURAL JOIN (SELECT id_plat, MIN(prix) AS prix FROM plat_size GROUP BY id_plat) AS min_price;");
    }

    async getArticleById(article_id) {
        let res= await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE id_plat = $1;", [article_id]);

        let dim={};
        for (let i=0; i<res.rows.length; i++){
            dim[res.rows[i].size]=res.rows[i].prix;
        }

        return {id: res.rows[0].id_plat, name: res.rows[0].nom, ingredients: res.rows[0].descript, dimension: dim};
    }

    async getAllEntree() {
        return await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE type_plat = 'salade';");
    }

    async getAllPizzaMedium() {
        return await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE type_plat = 'pizza' AND size = 'medium';");
    }

    async getAllBoissonBySize(size_boisson) {
        return await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE type_plat = 'boisson' AND size = $1;", [size_boisson]);
    }

    // return array of prices of ingredients for pizza composee + total, according the size of pizza
    async getPizzaComposee(list_ingredients, size) {
        const count = list_ingredients.length;
        if (count > 6) {return undefined};
        // find coefficient according the size of pizza
        const coeff = await db.query("SELECT prix FROM plat_size NATURAL JOIN plats WHERE id_plat = 25 AND size = $2;", [size]);
        let total_ingredients = 0;
        let prix_ingredients = [];
        for (let i = 0; i < count; i++){
            let prix = await db.query("SELECT prix FROM ingredients WHERE id_ingred = $1;", list_ingredients[i]);
            prix_ingredients.push(price);
            if (i > 3) { total_ingredients += prix * coeff; }            
        }   
        return {prix_ingredients, total_ingredients};
    }

   
}

module.exports = new Article();