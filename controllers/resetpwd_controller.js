const ResetPassword=require('../models/resetPwd');
const User=require('../models/user');
const crypto=require('crypto');
const path=require('path');
const resetPwdmailer=require('../mailers/reset_password');
const resetPwdemailWorker=require('../workers/resetPwd_emailworkers');
const queue=require('../config/kue');
const bcrypt=require('bcryptjs');



module.exports.forgotpwd=function(req,res){

   return  res.render('reset_pwd',{title:'Reset password'});

}
module.exports.sendresetLink = async function (req, res) {

    //console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        let newpassword = await ResetPassword.create({
            user: user._id,
            accesstoken: crypto.randomBytes(20).toString('hex'),
            isValid: false
        });
        let linktoSend = "http://localhost:8000/resetpwd/reset/"+newpassword.accesstoken;
        console.log(linktoSend);
 
        let dataTosent = {
            link: linktoSend,
            userName: user.name,
            userEmail: user.email
        };
        //this line sends the mail to user if user clicks on forgot password
    //    resetPwdmailer.newPwd(dataTosent);
             let job=queue.create('emails',dataTosent).save(function(err){
               if(err)
               {
                   console.log("Error while queuing the job",err);
                   return;
               }
               console.log("job addeding to queue with id:",job.id);
           })
           
        res.send("<h1>A link to reset your password is sent to email</h1>");


    }
    else {
        req.flash('error','email id does not exists');
        return res.redirect('/');
    }
    //send a mail to user asking to create new password by giving one link

}
module.exports.allowToenterNewpwd= async function(req,res)
{

    let item =await ResetPassword.findOne({accesstoken:req.params.id});
    if(item.isValid!=true)
    {
        console.log("Access Token",req.params.id);
        return res.render('create_newpassword',
        {
            title: 'create new password',
            accesstoken:req.params.id
            
        })

    }
    else
    {
        req.flash('success','your session has expired');
        res.redirect("/user/signin");
    }


}
module.exports.savenewPwd=async function(req,res){

    if(req.body.password==req.body.confirmpassword)
    {
        let item=await ResetPassword.findOne({accesstoken:req.params.id});

        //populate user using the item update the passwords
        let user=await item.populate('user');
       // console.log("user found with his id as ",user.user._id);

       const encryptedPwd=await bcrypt.hash(req.body.password,10);
        User.findByIdAndUpdate(user.user._id,{password:encryptedPwd},function(err,user){
            if(err)
            {
                Console.log("Error while updating password in user in db",err);
                return;
            }
            else
            {
                console.log("User updated");
            }
        })


        //make sure accessToke no longer valid

        ResetPassword.findByIdAndUpdate(item._id,{isValid:true},function(err,item){
            if(err)
            {
                Console.log("Error while updating accessToken to true in db",err);
                return;
            }
            else{
                req.flash('success','password updated successfully');
                if(req.isAuthenticated())
                {
                    
                    return res.redirect('/');
                }
                return res.redirect('/user/signin');
            }
        })
    }

} 