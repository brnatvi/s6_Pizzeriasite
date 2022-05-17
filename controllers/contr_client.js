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


// looking for match the list if ingredients (for exemple [28, 21, 18, 30, 25]) with some prepared pizza and return this pizza's ID with its prices
exports.getPizzaByListIngredients = function (req, rep) {
    Article.isTheSame(req.body.listIng).then(function(result){
        const match = result;
        if ( match !== undefined ){        
            Article.returnPizzaMatch(match).then(function(result){
            rep.send(result.rows);
          })
        }else rep.send([]);
    })
};


exports.addExtraMenuCartItem = function (req, rep) {

    Article.getArticleById(req.body.entreeExtraMenu).then(el=>{
        return el.name;
    }).then(entree=>{
        Article.getArticleById(req.body.pizzaExtraMenu).then(el=>{
            return el.name;
        }).then(pizza=>{
            Article.getArticleById(req.body.boissonExtraMenu).then(el=>{
                return el.name;
            }).then(boisson=>{
                Article.getArticleById(req.body.boissonExtraMenuB).then(el=>{
                    return el.name;
                }).then(boissonB=>{
                    let positionItem = Client.addMenuCartItem(req, 10, "extra", [entree, pizza, boisson, boissonB]);

                    rep.json({
                        typeMenu:"extra",
                        listElementMenu:[entree, pizza, boisson, boissonB],
                        priceMenu: 10,
                        indexMenu:positionItem
                    })
                }).catch(err=>{console.log("AaddCartItem"+JSON.stringify(err))});
            }).catch(err=>{console.log("BaddCartItem"+JSON.stringify(err))});
        }).catch(err=>{console.log("CaddCartItem"+JSON.stringify(err))});
    }).catch(err=>{console.log("DaddCartItem"+JSON.stringify(err))});
}

exports.addMegaMenuCartItem = function (req, rep) {

    Article.getArticleById(req.body.entreeMegaMenu).then(el=>{
        return el.name;
    }).then(entree=>{
        Article.getArticleById(req.body.entreeMegaMenuB).then(el=>{
            return el.name;
        }).then(entreeB=>{
            Article.getArticleById(req.body.pizzaMegaMenu).then(el=>{
                return el.name;
            }).then(pizza=>{
                Article.getArticleById(req.body.boissonMegaMenu).then(el=>{
                    return el.name;
                }).then(boisson=>{
                    let positionItem = Client.addMenuCartItem(req, 15, "mega", [entree, entreeB, pizza, boisson]);
                    rep.json({
                        typeMenu:"mega",
                        listElementMenu:[entree, entreeB, pizza, boisson],
                        priceMenu: 15,
                        indexMenu:positionItem
                    })
                }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
            }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
        }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
    }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
}

exports.addGigaMenuCartItem = function (req, rep) {

    Article.getArticleById(req.body.entreeGigaMenu).then(el=>{
        return el.name;
    }).then(entree=>{
        Article.getArticleById(req.body.entreeGigaMenuB).then(el=>{
            return el.name;
        }).then(entreeB=>{
            Article.getArticleById(req.body.pizzaGigaMenu).then(el=>{
                return el.name;
            }).then(pizza=>{
                Article.getArticleById(req.body.pizzaGigaMenuB).then(el=>{
                    return el.name;
                }).then(pizzaB=>{
                    Article.getArticleById(req.body.boissonGigaMenu).then(el=>{
                        return el.name;
                    }).then(boisson=>{
                        Article.getArticleById(req.body.boissonGigaMenuB).then(el=>{
                            return el.name;
                        }).then(boissonB=>{
                            let positionItem = Client.addMenuCartItem(req, 20, "giga", [entree, entreeB, pizza, pizzaB, boisson, boissonB]);
                            rep.json({
                                typeMenu:"giga",
                                listElementMenu:[entree, entreeB, pizza, pizzaB, boisson, boissonB],
                                priceMenu: 20,
                                indexMenu:positionItem
                            })
                        }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
                    }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
                }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
            }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
        }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
    }).catch(err=>{console.log("addCartItem"+JSON.stringify(err))});
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

exports.removeMenuCartItem = function (req, rep) {

    //update session price
    let menuSelected=req.session.user.cartItem.menu[req.body.idMenu];
    let rmvprice=0;
    if (menuSelected!==undefined){
        rmvprice=menuSelected.price;
        let total=parseFloat(req.session.user.cartItem.price)-parseFloat(menuSelected.price);
        req.session.user.cartItem.price=(total<0)?0:total;
        if (menuSelected.quantity<=1) delete req.session.user.cartItem.menu[req.body.idMenu];
        else menuSelected.quantity-=1;
    }

    console.log("menuSelected "+JSON.stringify(req.session.user.cartItem.menu))

    rep.json(rmvprice);

}

exports.addMenuCartItem = function (req, rep) {

    //update session price
    let menuSelected=req.session.user.cartItem.menu[req.body.idMenu];
    if (menuSelected!==undefined){
        let total=parseFloat(req.session.user.cartItem.price)+parseFloat(menuSelected.price);
        req.session.user.cartItem.price=(total<0)?0:total;
        req.session.user.cartItem.menu[req.body.idMenu].quantity+=1;
    }

    rep.json(menuSelected.price);

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
                    Article.getAllEntree().then(el=>{
                        return el;
                    }).then(entrees=>{
                        Article.getAllIngredients().then(ingredients=>{
                            console.log("ingredients: "+JSON.stringify(ingredients))
                            if(req.session.user!==undefined){
                                rep.render('../views/index',{
                                    params: {
                                        title: 'index',
                                        menu: req.session.user.cartItem.menu,
                                        quantity: req.session.user.cartItem.idQuantity,
                                        price: req.session.user.cartItem.price,
                                        list: articlesrq,
                                        entreeMenu: entrees.rows,
                                        pizzasMenu: pizzaMedium,
                                        boissonMinMenu: boissonMin,
                                        boissonMaxMenu: boissonMax,
                                        listIngredients: ingredients,
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
                                        listIngredients: ingredients,
                                        isLogued: false
                                    }
                                });
                            }
                        })
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

