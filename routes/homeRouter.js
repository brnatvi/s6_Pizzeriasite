const express = require("express");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router(); 

// home page
homeRouter.get("/", homeController.index);

// main page of menu - all dishes
homeRouter.get("/carte", homeController.carte);
 
module.exports = homeRouter;