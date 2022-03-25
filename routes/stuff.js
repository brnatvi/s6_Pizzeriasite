//Dependencies diles required
const express=require('express');
const router=express.Router();

//Local files required
const MFProtection=require('../middlewares/protection');
const stuffControllers=require('../controllers/stuffControllers');

//Pages
router.get('*', MFProtection, stuffControllers.GetError);

//TODO: index page
/*serv.get('/', function (req, res) {

});

serv.get("/menu/:id/", (req, res) => {

});

serv.get("/livraison/:id/", (req, res) => {

});*/

module.exports=router;