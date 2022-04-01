
const express = require("express");
const MFProtection = require('../middlewares/protection');
const stuffControllers = require('../controllers/stuffControllers');
const controller_Client = require("../controllers/contr_client.js");
const controller_Livreur = require("../controllers/contr_livreur.js");

const router = express.Router(); 
                                                                        // ??? to check all GET POST USE
//------------- Client ---------------------
// 1 logo -> home page
router.get("/", controller_Client.index);

// 2 lien vers la carte
router.get("/carte", controller_Client.showCarte);

// 3 client s'enregistre'
router.get("/signin", controller_Client.registrClient);

// 4 client se connecte
router.get("/login", controller_Client.loginClient);           // ??? need it?

// 5 afficher le panier
router.get("/panier", controller_Client.showPanier);           // ??? need it?

// 6 delete item
router.post("/panier/:id/delete", function(req, res){           // ??? check path
    controller_Client.deleteItem;
});


//------------- Livreur ---------------------
// 1 login/register pour livreur
router.get("/livraison", controller_Livreur.connectLivreur);

// 2 afficher commande disponible
router.get("/commande", controller_Livreur.showCommande);

// 3 changer le status de commande
router.post("/commande/:id/update", function(req, res){
    controller_Livreur.updateCommande
});                        

router.get('*', MFProtection, stuffControllers.GetError);
//console.log(process);

module.exports = router;