const express=require('express');
const router=express.Router();
const passport=require('passport');

const homeController=require('../controllers/home_controller');


router.use('/user',require('./user'));
router.get('/',passport.checkAuthentication,homeController.home);
router.use('/resetpwd',require('./resetpwd'));



module.exports=router;