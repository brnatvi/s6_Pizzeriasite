const { each } = require("jquery");
const db = require("./db");

class Article {

    async getAllArticle(){
        let res= await db.query("SELECT * FROM plats NATURAL JOIN plat_size;");
        console.log("res--->"+JSON.stringify(res.rows));
        return res;
    }

    async getArticleById(article_id) {
        let res= await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE id_plat = $1;", [article_id]);
        return {id: res.rows[0].id_plat, name: res.rows[0].nom, ingredients: res.rows[0].descript, price: res.rows[0].prix};
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
            total_ingredients += prix * coeff;
            }   
        return {prix_ingredients, total_ingredients};
    }

   
}

module.exports = new Article();