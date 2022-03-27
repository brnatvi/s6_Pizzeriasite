const express = require("express");
const livreurController = require("../controllers/cLivreur.js");
const livreurRouter = express.Router(); 

// login/registration pour livreurs
livreurRouter.use("/livraison", livreurController.connectLivreur);

// afficher commande disponible
livreurRouter.use("/commande", livreurController.showCommande);

// changer le status de commande
livreurRouter.post("/commande/:id/update", livreurController.updateCommande);


module.exports = livreurRouter;