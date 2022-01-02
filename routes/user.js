const express=require('express');
const router=express.Router();
const passport=require('passport');
const userController=require('../controllers/user_controller');

router.get('/signup',userController.signup);
router.get('/signin',userController.signin);

// router.get('/reset',userController.reset);

// router.post('/reset/:id',userController.updatePwd);

router.post('/createuser',userController.createUser);
router.post('/createSession',passport.authenticate('local',{failureRedirect:'/user/signin'}), userController.createSession);



router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signin'}),userController.createSession);
router.get('/signout',userController.destrotysession);
module.exports=router;