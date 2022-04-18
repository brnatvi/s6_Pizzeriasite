
const express = require("express");
const MFProtection = require('../middlewares/protection');
const stuffControllers = require('../controllers/stuffControllers');
const controller_Client = require("../controllers/contr_client.js");
const controller_Livreur = require("../controllers/contr_livreur.js");
const debugSession = require("../middlewares/debugSession.js");
const checkAuth = require("../middlewares/checkAuth.js");

const router = express.Router(); 

//------------- Main ---------------------
// 1 logo -> home page
router.get("/", debugSession, controller_Client.index);
// 2 lien vers la carte
router.get("/carte", controller_Client.showCarte);


//------------- Client ---------------------
router.post("/addClient", controller_Client.addClient);
router.post("/signup", controller_Client.addRegisteredClient);
router.post("/signin", controller_Client.signIn);//TODO
router.get("/client/:id", controller_Client.getClient);
router.get("/clients", controller_Client.getListClients);
router.put("/update", controller_Client.updateRegisteredClient);
router.delete("/client/:id", controller_Client.deleteClient);

//log out
router.get('/logout', checkAuth, controller_Client.GetLogOut);

//ajax request - cart item
router.post("/more-ifo-item", debugSession, controller_Client.infoCartItem);
router.post("/add-new-cart-item", debugSession, checkAuth, controller_Client.addCartItem);
router.post("/remove-cart-item", debugSession, checkAuth, controller_Client.removeCartItem);
router.post("/add-cart-item", debugSession, controller_Client.addCartItem);


//------------- Livreur ---------------------
// 1 login/register pour livreur
router.post("/livraison", controller_Livreur.registrLivreur);

router.get("/livraison", controller_Livreur.connectLivreur);

// 2 afficher commande disponible
router.get("/commande", stuffControllers.GetCommande);

// 3 changer le status de commande
router.post("/commande/:id/update", controller_Livreur.updateCommande);

router.get('*', MFProtection, stuffControllers.GetError);
//console.log(process);

module.exports = router;