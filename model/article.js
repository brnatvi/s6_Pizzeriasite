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



    // return list of ingredients of some defined pizza (to compare composition and prices)
    async getIngedientsPizza(idPizza) {       
        ingredients_prete = await db.query("SELECT * FROM pizza_composition NATURAL JOIN ingredients WHERE id_plat = $1;", [idPizza]);
        let idIngredients = [];
        for (let i = 0; i < ingredients_prete.rows.length; i++){
            idIngredients.push(ingredients_prete.rows[i]);            
        }
        console.log(ingredients_prete);
    };

    // return list of all possible ingredients for page "Pizza composee"
    async getAllIngredients() {       
        ingredients_composee = await db.query("SELECT * FROM ingredients;");
        let idIngredients = [];
        for (let i = 0; i < listIngred.rows.length; i++){
            idIngredients.push(listIngred.rows[i]);            
        }
        console.log(ingredients_composee);
    };

    // match ingredients of incoming listIngredients with list inredients of some "Pizza prete"
    async isTheSame(listIngredients) {         
        let first = await db.query("SELECT id_plat FROM pizza_composition WHERE id_ingred = $1;", [listIngredients[0]]);        
        let intersection = [];

        for (let k = 0; k < first.rows.length; k++){
            intersection.push(first.rows[k].id_plat);                
        }

        for (let i = 1; i < listIngredients.length; i++){
            let next = await db.query("SELECT id_plat FROM pizza_composition WHERE id_ingred = $1;", [listIngredients[i]]); 
            let secondary = [];
            for (let j = 0; j < next.rows.length; j++){
                secondary.push(next.rows[j].id_plat);
            }
            const inters = intersection.filter(x => secondary.includes(x));
            intersection = inters; 
        } 
        return intersection[0];      
    };

    // return pizza by id_plat
    async returnPizzaMatch(id) {
        return await db.query("SELECT * FROM plats WHERE id_plat = $1;", [id]);                
    };


      /*  // return array of prices of ingredients for pizza composee + total, according the size of pizza
    async getPizzaComposee(list_ingredients, size) {
        const count = list_ingredients.length;
        if (count > 6) {return undefined};
        // find coefficient according the size of pizza
        const coeff = await db.query("SELECT prix FROM plat_size NATURAL JOIN plats WHERE id_plat = 25 AND size = $1;", [size]);
        let total_ingredients = 0;
        let prix_ingredients = [];
        for (let i = 0; i < count; i++){
            let prix = await db.query("SELECT prix FROM ingredients WHERE id_ingred = $1;", list_ingredients[i]);
            prix_ingredients.push(price);
            if (i > 3) { total_ingredients += prix; }            
        }   
        console.log([prix_ingredients, (total_ingredients * coeff)]);
    };
*/

}

module.exports = new Article();