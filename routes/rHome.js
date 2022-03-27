const express = require("express");
const homeController = require("../controllers/cHome.js");
const homeRouter = express.Router(); 

// home page
homeRouter.get("/", homeController.index);

// main page of menu - all dishes
homeRouter.get("/carte", homeController.showCarte);
 
module.exports = homeRouter;