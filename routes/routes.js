
const express = require("express");
const MFProtection = require('../middlewares/protection');
const stuffControllers = require('../controllers/stuffControllers');
const controller_Client = require("../controllers/contr_client.js");
const controller_Livreur = require("../controllers/contr_livreur.js");
const debugSession = require("../middlewares/debugSession.js");
const checkAuth = require("../middlewares/checkAuth.js");
const justClient = require("../middlewares/justClient.js");
const justDeliveryMan = require("../middlewares/justDeliveryMan.js");

const router = express.Router(); 

//------------- Main ---------------------
// 1 logo -> home page
router.get("/", controller_Client.index);
router.get("/shop", justClient, controller_Client.shop);
/*// 2 lien vers la carte
router.get("/carte", controller_Client.showCarte);


//------------- Client ---------------------
router.post("/addClient", controller_Client.addClient);
router.post("/addCommande", controller_Client.createCommande);

router.get("/client/:id", controller_Client.getClient);
router.get("/clients", controller_Client.getListClients);
router.put("/update", controller_Client.updateRegisteredClient);
router.delete("/client/:id", controller_Client.deleteClient);*/

//system connexion user
router.post("/signup", controller_Client.signUpClient);
router.post("/signin", controller_Client.signInClient);//TODO: regex
router.get('/logout', checkAuth, controller_Client.logOutUser);//TODO: add root
router.post("/parameters-client", checkAuth, justClient, controller_Client.updateProfileClient);
router.post("/parameters-delivery-man", checkAuth, justDeliveryMan, controller_Livreur.updateProfileLivreur);


//ajax request - cart item
router.post("/more-ifo-item", justClient, controller_Client.infoCartItem);
router.post("/add-new-cart-item", checkAuth, justClient, controller_Client.addCartItem);
router.post("/remove-cart-item", checkAuth, justClient, controller_Client.removeCartItem);
router.post("/add-cart-item", justClient, controller_Client.addCartItem);


//------------- Livreur ---------------------
// 1 login/register pour livreur
router.post("/livraisonsignin", controller_Livreur.signInLivreur);
router.post("/livraisonsignup", controller_Livreur.signUpLivreur);//TODO: move function client -> delivery man
router.get("/livraison", controller_Livreur.livraisonLivreur);//TODO: "" ""

// 2 afficher commande disponible
router.get("/commande", checkAuth, justDeliveryMan, stuffControllers.GetCommande);

// 3 changer le status de commande
router.post("/commande/:id/update", controller_Livreur.updateCommande);//TODO: check dispo

router.get('*', MFProtection, stuffControllers.GetError);
//console.log(process);

module.exports = router;