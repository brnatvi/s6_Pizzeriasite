//Dependencies diles required
const express=require('express');
const router=express.Router();

//Local files required
const MFProtection=require('../middlewares/protection');
const stuffControllers=require('../controllers/stuffControllers');

//Pages
console.log(process);

router.get('*', MFProtection, stuffControllers.GetError);


module.exports=router;