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

}

module.exports = new Article();