
const express = require("express");
const livreurController = require("../controllers/livreurController.js");
const livreurRouter = express.Router(); 

// login/registration for livreurs
livreurRouter.use("/livraison", livreurController.connect);

// show available commande 
livreurRouter.use("/commande", livreurController.show);

// mark command as delivered
livreurRouter.post("/commande", livreurController.update);


module.exports = livreurRouter;