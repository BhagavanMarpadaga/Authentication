const express= require('express');
const router=express.Router();
const Resetpwd=require('../controllers/resetpwd_controller');

router.get('/',Resetpwd.forgotpwd);
router.post('/reset',Resetpwd.sendresetLink);
router.get('/reset/:id',Resetpwd.allowToenterNewpwd);
router.post('/savepwd/:id',Resetpwd.savenewPwd);

module.exports=router;
