const Client = require("../model/client");
const Commande = require("../model/commande");
const Connect=require("./Connect");
const Article=require("../model/article");


//----------- fonctionnality available to Client/User --------------------

exports.signInClient = (req, rep) => {Connect.signIn(Client, req, rep)};
exports.signUpClient = (req, rep) => {Connect.signUp(Client, req, rep)};
exports.logOutUser = (req, rep) => {Connect.disconnectUser(req.session, rep)};
exports.updateProfileClient = (req, rep) => {Connect.updateProfile(Client, req, rep)}

//----------------- manipulation with items --------------------------------

exports.addExtraMenuCartItem = function (req, rep) {
    console.log("JSON.stringify(req.body)")
    console.log(JSON.stringify(req.body))
    console.log(/*TODO:*/"TODO: create bdd request")
    rep.json(req.body)
}

exports.addMegaMenuCartItem = function (req, rep) {
    console.log("JSON.stringify(req.body)")
    console.log(JSON.stringify(req.body))
    console.log(/*TODO:*/"TODO: create bdd request")
    rep.json(req.body)
}

exports.addGigaMenuCartItem = function (req, rep) {
    console.log("JSON.stringify(req.body)")
    console.log(JSON.stringify(req.body))
    console.log(/*TODO:*/"TODO: create bdd request")
    rep.json(req.body)
}

exports.infoCartItem = function (req, rep) {
    Article.getArticleById(req.body.idArticle).then(articles=>{
        rep.json(articles);
    }).catch(err=>{console.log("infoCartItem"+JSON.stringify(err))});
}

exports.addCartItem = function (req, rep) {
    Article.getArticleById(req.body.idArticle).then(articles=>{

        //update session price
        let total=parseFloat(req.session.user.cartItem.price)+parseFloat(articles.dimension[req.body.choiceSize]);
        req.session.user.cartItem.price=(total<0)?0:total;
        if (req.session.user.cartItem.idQuantity[articles.id]===undefined){
            req.session.user.cartItem.idQuantity[articles.id]=JSON.parse('{"'+req.body.choiceSize+'":1}')
        }else if(req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]===undefined){
            req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]=1
        }else req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]+=1;

        rep.json([articles,req.body.choiceSize]);
    }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
}

exports.removeCartItem = function (req, rep) {

    Article.getArticleById(req.body.idArticle).then(articles=>{

        //update session price
        let total=parseFloat(req.session.user.cartItem.price)-parseFloat(articles.dimension[req.body.choiceSize]);
        req.session.user.cartItem.price=(total<0)?0:total;

        //update session cart item
        if (req.session.user.cartItem.idQuantity[articles.id]!==undefined){
            if(req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]!==undefined){
                if (req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]===1){
                    delete req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize];
                    if (Object.keys(req.session.user.cartItem.idQuantity[articles.id]).length===0){
                        delete req.session.user.cartItem.idQuantity[articles.id];
                    }
                }else req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize]-=1
            }
        }

        rep.json([articles,req.body.choiceSize]);
    }).catch(err=>{console.log("removeCartItem"+JSON.stringify(err))});

}

exports.index = function (req, rep) {
    rep.render('../views/home',{
        params: {
            title: 'home',
            isClient: (req.session.user===undefined || req.session.user.mobile!==undefined),
            isLogued: req.session.user!==undefined
        }
    });
}

exports.shop = function (req, rep) {
    Article.getAllArticle().then(el=>{
        return el.rows;
    }).then(articlesrq =>{
        Article.getAllPizzaMedium().then(el=>{
            return el.rows;
        }).then(pizzaMedium=>{
            Article.getAllBoissonBySize("33").then(el=>{
                return el.rows;
            }).then(boissonMin=>{
                Article.getAllBoissonBySize("100").then(el=>{
                    return el.rows;
                }).then(boissonMax=>{
                    Article.getAllEntree().then(entrees=>{
                        if(req.session.user!==undefined){
                            rep.render('../views/index',{
                                params: {
                                    title: 'index',
                                    quantity: req.session.user.cartItem.idQuantity,
                                    price: req.session.user.cartItem.price,
                                    list: articlesrq,
                                    entreeMenu: entrees.rows,
                                    pizzasMenu: pizzaMedium,
                                    boissonMinMenu: boissonMin,
                                    boissonMaxMenu: boissonMax,
                                    isLogued: true
                                }
                            });
                        }else{
                            rep.render('../views/index',{
                                params: {
                                    title: 'index',
                                    list: articlesrq,
                                    entreeMenu: entrees.rows,
                                    pizzasMenu: pizzaMedium,
                                    boissonMinMenu: boissonMin,
                                    boissonMaxMenu: boissonMax,
                                    isLogued: false
                                }
                            });
                        }
                    }).catch(err=>{console.log("err"+JSON.stringify(err))})
                }).catch(err=>{console.log("err"+JSON.stringify(err))})
            }).catch(err=>{console.log("err"+JSON.stringify(err))})
        }).catch(err=>{console.log("err"+JSON.stringify(err))})
    }).catch(err=>{console.log("err"+JSON.stringify(err))})
};




//---------------------- TODO: WIP: Basic client --------------------------------------------------

//TODO: pizza recommandation?

// create new commande
exports.createCommande = function (req, rep) {
    Commande.createCommande(req, rep);
};

