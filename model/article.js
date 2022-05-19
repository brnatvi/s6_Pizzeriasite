const db = require("./db");

class Article {

    list_ingredients = [];

    async getAllArticle() {
        return await db.query("SELECT * FROM plats NATURAL JOIN (SELECT id_plat, MIN(prix) AS prix FROM plat_size GROUP BY id_plat) AS min_price;");
    }

    async getArticleById(article_id) {
        let res = await db.query("SELECT * FROM plats NATURAL JOIN plat_size WHERE id_plat = $1;", [article_id]);

        let dim = {};
        for (let i = 0; i < res.rows.length; i++) {
            dim[res.rows[i].size] = res.rows[i].prix;
        }

        return { id: res.rows[0].id_plat, name: res.rows[0].nom, ingredients: res.rows[0].descript, dimension: dim };
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
        let ingredients_prete = await db.query("SELECT * FROM pizza_composition NATURAL JOIN ingredients WHERE id_plat = $1;", [idPizza]);
        let idIngredients = [];
        for (let i = 0; i < ingredients_prete.rows.length; i++) {
            idIngredients.push(ingredients_prete.rows[i]);
        }
        return idIngredients;
    };

    // return list of all possible ingredients for page "Pizza composee"
    async getAllIngredients() {
        let ingredients_composee = await db.query("SELECT * FROM ingredients;");
        let idIngredients = [];
        for (let i = 0; i < ingredients_composee.rows.length; i++) {
            idIngredients.push(ingredients_composee.rows[i]);
        }
        return idIngredients;
    };


    // check if pizza with id consists of ingredients from listIngredients
    async isItPizza(listIngredients, id) {
        let ingredrow = await db.query("SELECT * FROM pizza_composition NATURAL JOIN ingredients WHERE id_plat = $1;", [id]);
        let idIngredients = [];
        for (let i = 0; i < ingredrow.rows.length; i++) {
            idIngredients.push(ingredrow.rows[i].id_ingred);
        }
        const inters = idIngredients.filter(x => !listIngredients.includes(x));
        if (inters.length === 0) return true;
        else return false;
    };

    // match ingredients of incoming listIngredients with list inredients of some "Pizza prete"
    async isTheSame(listIngredients) {
        let first = await db.query("SELECT id_plat FROM pizza_composition WHERE id_ingred = $1;", [listIngredients[0]]);
        let intersection = [];

        for (let k = first.rows.length - 1; k > -1; k--) {
            intersection.push(first.rows[k].id_plat);
        }

        for (let i = 1; i < listIngredients.length; i++) {
            let next = await db.query("SELECT id_plat FROM pizza_composition WHERE id_ingred = $1;", [listIngredients[i]]);
            let secondary = [];
            for (let j = next.rows.length - 1; j > -1; j--) {
                secondary.push(next.rows[j].id_plat);
            }
            intersection = intersection.filter(x => secondary.includes(x));
        }

        if ((intersection.length === 1) || (intersection.length > 1 && intersection[0] === 9)) {
            const isPizza = await this.isItPizza(listIngredients, intersection[0]);
            if (isPizza === true) return (intersection[0]);
            else return undefined;
        }
        else return undefined;
    };


    // return pizza by id_plat
    async returnPizzaMatch(id) {
        return await db.query("SELECT id_plat, prix, size FROM plats NATURAL JOIN plat_size WHERE id_plat = $1;", [id]);
    };


    async getPizzaByListIngredients(list) {
        if (list.length > 1) {
            let isSame = await this.isTheSame(list);
            if (isSame !== undefined) {
                let pizzaMatch = await this.returnPizzaMatch(isSame);
                return pizzaMatch.rows;
            } else return ([]);
        } else return [];
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