const express = require("express");
const panierController = require("../controllers/cPanier.js");
const panierRouter = express.Router(); 

// home page
panierRouter.get("/panier", panierController.showPanier);

// delete item
panierRouter.use("/panier/:id/delete", panierController.deleteItem);
 
module.exports = panierRouter;