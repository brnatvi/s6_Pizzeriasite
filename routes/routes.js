const express = require("express");
const stuffControllers = require('../controllers/stuffControllers');
const controller_Client = require("../controllers/contr_client");
const controller_Livreur = require("../controllers/contr_livreur");
const checkAuth = require("../middlewares/checkAuth");
const justClient = require("../middlewares/justClient");
const justDeliveryMan = require("../middlewares/justDeliveryMan");

const router = express.Router();

//------------- Main ---------------------
router.get("/", controller_Client.index);


//------------- Client ---------------------
//------------- Just client ---------------------
router.get("/shop", justClient, controller_Client.shop);
router.post("/parameters-client", checkAuth, justClient, controller_Client.updateProfileClient);
//------------- Log in - Log out ---------------------
router.post("/signup", controller_Client.signUpClient);
router.post("/signin", controller_Client.signInClient);
router.get('/logout', checkAuth, controller_Client.logOutUser);
//------------- Cart item ---------------------
router.post("/more-ifo-item", justClient, controller_Client.infoCartItem);
router.post("/add-new-cart-item", justClient, controller_Client.addCartItem);
router.post("/remove-cart-item", justClient, controller_Client.removeCartItem);
router.post("/add-cart-item", justClient, controller_Client.addCartItem);
router.post("/remove-menu-cart-item", justClient, controller_Client.removeMenuCartItem);
router.post("/add-menu-cart-item", justClient, controller_Client.addMenuCartItem);
router.post("/add-extra-menu-cart-item", justClient, controller_Client.addExtraMenuCartItem);
router.post("/add-mega-menu-cart-item", justClient, controller_Client.addMegaMenuCartItem);
router.post("/add-giga-menu-cart-item", justClient, controller_Client.addGigaMenuCartItem);


//------------- Livreur ---------------------
//------------- Just livreur ---------------------
router.post("/parameters-delivery-man", checkAuth, justDeliveryMan, controller_Livreur.updateProfileLivreur);
router.get("/commande", checkAuth, justDeliveryMan, controller_Livreur.GetCommande);
//------------- Log in - Log out ---------------------
router.post("/livraisonsignin", controller_Livreur.signInLivreur);
router.post("/livraisonsignup", controller_Livreur.signUpLivreur);
router.get("/livraison", controller_Livreur.livraisonLivreur);


router.get("/test", controller_Client.getPizzaByListIngredients);
router.post("/test", controller_Client.getPizzaByListIngredients);

//------------- Default ---------------------
router.get('*', stuffControllers.GetError);

//------------- TODO: WIP ---------------------
/*// 2 lien vers la carte*///TODO: 1 logo -> home page
/*router.get("/carte", controller_Client.showCarte);*/
/*router.post("/addCommande", controller_Client.createCommande);
router.get("/client/:id", controller_Client.getClient);
router.get("/clients", controller_Client.getListClients);
router.delete("/client/:id", controller_Client.deleteClient);
// 3 changer le status de commande
router.post("/commande/:id/update", controller_Livreur.updateCommande);//TODO: check dispo*/


module.exports = router;