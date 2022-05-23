const Client = require("../model/client");
const Connect = require("./Connect");
const Article = require("../model/article");
const Commande = require("../model/commande");


//----------- fonctionnality available to Client/User --------------------
/**
 * Système de connexion
 */
exports.signInClient = (req, rep) => { Connect.signIn(Client, req, rep) };
exports.signUpClient = (req, rep) => { Connect.signUp(Client, req, rep) };
exports.logOutUser = (req, rep) => { Connect.disconnectUser(req.session, rep) };
exports.updateProfileClient = (req, rep) => { Connect.updateProfile(Client, req, rep) } 

//----------------- manipulation with items --------------------------------
/**
 * Recherche l'existence d'une pizza en se basant sur une liste d'ingrédients
 */
exports.getPizzaByListIngredients = function (req, rep) {
    Article.getPizzaByListIngredients((req.body.listIng !== undefined) ? req.body.listIng.map(Number) : []).then(rez => {
        return rez
    }).then(rez => { rep.send(rez); }).catch(() => { rep.status(500).send({ messageError: "Impossible de chercher parmi la liste de pizzas" }) });
};

/**
 * Changer la quantité d'un extra menu dans le panier (ajout)
 */
exports.addCustomCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    let pricePizza = req.body.pricePizza;
    let sizePizza = req.body.sizePizzaCustom;
    let ingredients = [];
    for (let i = 1; i <= 6; i++) {
        console.log(req.body["ingredientPizzaCustom" + i])
        if (req.body["ingredientPizzaCustom" + i] !== 'none') {
            ingredients.push(parseInt(req.body["ingredientPizzaCustom" + i]))
        } else break;
    }
    Article.getIngredientsListInfo(ingredients).then(ingredientsInfo => {
        //save data
        let positionItem = Client.addCustomCartItem(req, parseFloat(pricePizza), sizePizza, ingredients, ingredientsInfo);
        //send response
        rep.json({
            sizepizza: sizePizza,
            ingredientsId: ingredients,
            priceCustom: pricePizza,
            indexCustom: positionItem,
            ingredientsInfo: ingredientsInfo
        })
    }).catch(() => { rep.status(500).send({ messageError: "Impossible d'ajouter la pizza personalisée au panier" }) })
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un extra menu dans le panier (ajout)
 */
exports.addExtraMenuCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    Article.getArticleById(req.body.entreeExtraMenu).then(el => {
        return el.name;
    }).then(entree => {
        Article.getArticleById(req.body.pizzaExtraMenu).then(el => {
            return el.name;
        }).then(pizza => {
            Article.getArticleById(req.body.boissonExtraMenu).then(el => {
                return el.name;
            }).then(boisson => {
                Article.getArticleById(req.body.boissonExtraMenuB).then(el => {
                    return el.name;
                }).then(boissonB => {
                    //save data in session
                    let positionItem = Client.addMenuCartItem(req, 10, "extra", [entree, pizza, boisson, boissonB]);
                    //send response
                    rep.json({
                        typeMenu: "extra",
                        listElementMenu: [entree, pizza, boisson, boissonB],
                        priceMenu: 10,
                        indexMenu: positionItem
                    })
                }).catch(() => { rep.status(500).send({ messageError: "Impossible de sauvegarder votre choix" }) });
            }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la boisson" }) });
        }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la pizza" }) });
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'entrée sélectionnée" }) });
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un giga menu dans le panier (ajout)
 */
exports.addMegaMenuCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    Article.getArticleById(req.body.entreeMegaMenu).then(el => {
        return el.name;
    }).then(entree => {
        Article.getArticleById(req.body.entreeMegaMenuB).then(el => {
            return el.name;
        }).then(entreeB => {
            Article.getArticleById(req.body.pizzaMegaMenu).then(el => {
                return el.name;
            }).then(pizza => {
                Article.getArticleById(req.body.boissonMegaMenu).then(el => {
                    return el.name;
                }).then(boisson => {
                    //save data in session
                    let positionItem = Client.addMenuCartItem(req, 15, "mega", [entree, entreeB, pizza, boisson]);
                    //send response
                    rep.json({
                        typeMenu: "mega",
                        listElementMenu: [entree, entreeB, pizza, boisson],
                        priceMenu: 15,
                        indexMenu: positionItem
                    })
                }).catch(() => { rep.status(500).send({ messageError: "Impossible de sauvegarder votre choix" }) });
            }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la pizza" }) });
        }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'entrée sélectionnée" }) });
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'entrée sélectionnée" }) });
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un giga menu dans le panier (ajout)
 */
exports.addGigaMenuCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    Article.getArticleById(req.body.entreeGigaMenu).then(el => {
        return el.name;
    }).then(entree => {
        Article.getArticleById(req.body.entreeGigaMenuB).then(el => {
            return el.name;
        }).then(entreeB => {
            Article.getArticleById(req.body.pizzaGigaMenu).then(el => {
                return el.name;
            }).then(pizza => {
                Article.getArticleById(req.body.pizzaGigaMenuB).then(el => {
                    return el.name;
                }).then(pizzaB => {
                    Article.getArticleById(req.body.boissonGigaMenu).then(el => {
                        return el.name;
                    }).then(boisson => {
                        Article.getArticleById(req.body.boissonGigaMenuB).then(el => {
                            return el.name;
                        }).then(boissonB => {
                            //save data
                            let positionItem = Client.addMenuCartItem(req, 20, "giga", [entree, entreeB, pizza, pizzaB, boisson, boissonB]);
                            //send response
                            rep.json({
                                typeMenu: "giga",
                                listElementMenu: [entree, entreeB, pizza, pizzaB, boisson, boissonB],
                                priceMenu: 20,
                                indexMenu: positionItem
                            })
                        }).catch(() => { rep.status(500).send({ messageError: "Impossible de sauvegarder votre choix" }) });
                    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la boisson" }) });
                }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la pizza" }) });
            }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la pizza" }) });
        }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'entrée sélectionnée" }) });
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'entrée sélectionnée" }) });
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Obtenir plus d'informations sur un article
 */
exports.infoCartItem = function (req, rep) {
    console.log("--->" + JSON.stringify(req.body) + "\n\n")
    Article.getArticleById(req.body.idArticle).then(articles => {
        return articles;
    }).then(articles => {
        Article.getIngedientsPizza(req.body.idArticle).then(ingredients => {
            rep.json({ articles, ingredients });
        }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la composition de la pizza" }) });
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver l'article" }) });
}

/**
 * Changer la quantité d'un article dans le panier (ajout)
 */
exports.addCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    Article.getArticleById(req.body.idArticle).then(articles => {
        //update session price
        let total = parseFloat(req.session.user.cartItem.price) + parseFloat(articles.dimension[req.body.choiceSize]);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        if (req.session.user.cartItem.idQuantity[articles.id] === undefined) {
            req.session.user.cartItem.idQuantity[articles.id] = JSON.parse('{"' + req.body.choiceSize + '":1}')
        } else if (req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] === undefined) {
            req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] = 1
        } else req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] += 1;
        //send response
        rep.json([articles, req.body.choiceSize]);
    }).catch(() => { rep.status(500).send({ messageError: "Impossible d'ajouter larticle au panier" }) });
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un article dans le panier (suppression)
 */
exports.removeCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    Article.getArticleById(req.body.idArticle).then(articles => {
        //update session price
        let total = parseFloat(req.session.user.cartItem.price) - parseFloat(articles.dimension[req.body.choiceSize]);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        //update session cart item
        if (req.session.user.cartItem.idQuantity[articles.id] !== undefined) {
            if (req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] !== undefined) {
                if (req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] === 1) {
                    delete req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize];
                    if (Object.keys(req.session.user.cartItem.idQuantity[articles.id]).length === 0) {
                        delete req.session.user.cartItem.idQuantity[articles.id];
                    }
                } else req.session.user.cartItem.idQuantity[articles.id][req.body.choiceSize] -= 1
            }
        }
        //send response
        rep.json([articles, req.body.choiceSize]);
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de trouver la composition de la pizza" }) });
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'une pizza personnalisée dans le panier (suppression)
 */
exports.removeCustomCartItemQuantity = function (req, rep) {
    //if (req.session.user!==undefined){
    //update session price
    let customSelected = req.session.user.cartItem.custom[req.body.idCustom];
    let rmvprice = 0;
    if (customSelected !== undefined) {
        rmvprice = customSelected.price;
        let total = parseFloat(req.session.user.cartItem.price) - parseFloat(customSelected.price);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        if (customSelected.quantity <= 1) delete req.session.user.cartItem.custom[req.body.idCustom];
        else customSelected.quantity -= 1;
    }
    //send response
    rep.json(rmvprice);
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un menu dans le panier (suppression)
 */
exports.removeMenuCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    //update session price
    let menuSelected = req.session.user.cartItem.menu[req.body.idMenu];
    let rmvprice = 0;
    if (menuSelected !== undefined) {
        rmvprice = menuSelected.price;
        let total = parseFloat(req.session.user.cartItem.price) - parseFloat(menuSelected.price);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        if (menuSelected.quantity <= 1) delete req.session.user.cartItem.menu[req.body.idMenu];
        else menuSelected.quantity -= 1;
    }
    //send response
    rep.json(rmvprice);
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}


/**
 * Changer la quantité d'une pizza personnalisée dans le panier (ajout)
 */
exports.addCustomCartItemQuantity = function (req, rep) {
    //if (req.session.user!==undefined){
    //update session price
    let customSelected = req.session.user.cartItem.custom[req.body.idCustom];
    if (customSelected !== undefined) {
        let total = parseFloat(req.session.user.cartItem.price) + parseFloat(customSelected.price);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        req.session.user.cartItem.custom[req.body.idCustom].quantity += 1;
    }
    //send response
    rep.json(customSelected.price);
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})
}

/**
 * Changer la quantité d'un article dans le panier (ajout)
 */
exports.addMenuCartItem = function (req, rep) {
    //if (req.session.user!==undefined){
    //update session price
    let menuSelected = req.session.user.cartItem.menu[req.body.idMenu];
    if (menuSelected !== undefined) {
        let total = parseFloat(req.session.user.cartItem.price) + parseFloat(menuSelected.price);
        req.session.user.cartItem.price = (total < 0) ? 0 : total;
        req.session.user.cartItem.menu[req.body.idMenu].quantity += 1;
    }
    //send response
    rep.json(menuSelected.price);
    //}else rep.status(500).send({messageError : "Vous devez vous connecter pour réaliser cette action"})

}

/**
 * Chargement de la page d'acceuil
 */
exports.index = function (req, rep) {
    rep.render('../views/home', {
        params: {
            title: 'home',
            isClient: (req.session.user === undefined || req.session.user.cartItem !== undefined),
            isLogued: req.session.user !== undefined && req.session.user.nom !== undefined
        }
    });
}

/**
 * Chargement de la page d'achat
 */
exports.shop = function (req, rep) {
    Article.getAllArticle().then(el => {
        return el.rows;
    }).then(articlesrq => {
        Article.getAllPizzaMedium().then(el => {
            return el.rows;
        }).then(pizzaMedium => {
            Article.getAllBoissonBySize("33").then(el => {
                return el.rows;
            }).then(boissonMin => {
                Article.getAllBoissonBySize("100").then(el => {
                    return el.rows;
                }).then(boissonMax => {
                    Article.getAllEntree().then(el => {
                        return el;
                    }).then(entrees => {
                        Article.getAllIngredients().then(ingredients => {
                            if (req.session.user !== undefined && req.session.user.mobile !== undefined) {
                                rep.render('../views/index', {
                                    params: {
                                        title: 'index',
                                        custom: req.session.user.cartItem.custom,
                                        menu: req.session.user.cartItem.menu,
                                        quantity: req.session.user.cartItem.idQuantity,
                                        price: req.session.user.cartItem.price,
                                        list: articlesrq,
                                        entreeMenu: entrees.rows,
                                        pizzasMenu: pizzaMedium,
                                        boissonMinMenu: boissonMin,
                                        boissonMaxMenu: boissonMax,
                                        listIngredients: ingredients,
                                        isClient: true,
                                        isLogued: true
                                    }
                                });
                            } else {
                                req.session.user = {/*TODO:iciC*/
                                    cartItem: {
                                        price: 0,
                                        idQuantity: {/*id: {size : quantity}*/ },
                                        menu: [/*{{menu} : quantity}*/],
                                        custom: [/*{{menu} : quantity}*/]
                                    }
                                }
                                rep.render('../views/index', {
                                    params: {
                                        title: 'index',
                                        list: articlesrq,
                                        entreeMenu: entrees.rows,
                                        pizzasMenu: pizzaMedium,
                                        boissonMinMenu: boissonMin,
                                        boissonMaxMenu: boissonMax,
                                        listIngredients: ingredients,
                                        isClient: true,
                                        isLogued: false
                                    }
                                });
                            }
                        })
                    }).catch(() => { rep.status(500).send({ messageError: "Impossible de charger les ingrédients" }) });
                }).catch(() => { rep.status(500).send({ messageError: "Impossible de charger les boissons de 100cl" }) });
            }).catch(() => { rep.status(500).send({ messageError: "Impossible de charger les boissons de 33cl" }) });
        }).catch(() => { rep.status(500).send({ messageError: "Impossible de charger les pizzas" }) });
    }).catch(() => { rep.status(500).send({ messageError: "Impossible de charger les articles" }) });
};

//---------------------- TODO: WIP: Basic client --------------------------------------------------

//TODO: pizza recommandation?

/**
 * TODO: Enregistrer la commande dans la base de donnée
 */
exports.saveCommande = function (req, rep) {    
    
    if (req.session.user !== undefined && req.session.user.mobile !== undefined) {

        const newObj = 
        {
            emailClient: req.session.user.email,
            deliveryDate: req.body.dateTimeCommande,
            menus: req.session.user.cartItem.menu,
            articles: req.session.user.cartItem.idQuantity,
            customs: req.session.user.cartItem.custom
        };
        
        //TODO: Save in DB        
        Commande.createCommande(newObj);
        console.log("saveCommande for reg");

        //TODO: remove all elements in session then reload page

    } else {
        const newObj = {
            nom: req.body.nomCommande,
            prenom: req.body.prenomCommande,
            adresse: req.body.adresseCommande,
            otherInfo: req.body.otherInfoCommande,
            portable: req.body.portableCommande,
            email: req.body.emailCommande,
            deliveryDate: req.body.dateTimeCommande,

            menus: req.session.user.cartItem.menu,
            articles: req.session.user.cartItem.idQuantity,
            customs: req.session.user.cartItem.custom
        };
        Commande.createCommandeUnreg(newObj);
        console.log("saveCommande non reg");
    }
}


