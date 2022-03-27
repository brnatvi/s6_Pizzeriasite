const express = require("express");
const headerController = require("../controllers/headerController.js");
const homeController = require("../controllers/homeController.js");
const livreurController = require("../controllers/livreurController.js");

const headerRouter = express.Router(); 

// logo -> index
headerRouter.get("/index", homeController.index);

// lien vers la carte
headerRouter.get("/carte", homeController.carte);

// afficher le panier
headerRouter.get("/panier", headerController.panier);

// se connecter / s'inregistrer pour client
headerRouter.use("/login", headerController.login);

// login/register pour livreur
headerRouter.use("/livraison", livreurController.connect);



module.exports = headerRouter;