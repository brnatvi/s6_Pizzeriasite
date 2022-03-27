const express = require("express");
const headerController = require("../controllers/cHeader.js");
const homeController = require("../controllers/cHome.js");
const livreurController = require("../controllers/cLivreur.js");
const panierController = require("../controllers/cPanier.js");

const headerRouter = express.Router(); 

// logo -> index
headerRouter.get("/index", homeController.index);

// lien vers la carte
headerRouter.get("/carte", homeController.showCarte);

// afficher le panier
headerRouter.get("/panier", panierController.showPanier);

// se connecter / s'inregistrer pour client
headerRouter.use("/login", headerController.loginClient);

// login/register pour livreur
headerRouter.use("/livraison", livreurController.connectLivreur);



module.exports = headerRouter;