const User=require('../models/user');
const bcrypt=require('bcryptjs');

//create a new user in db
module.exports.createUser=async function(req,res)
{
    //check if the user already existed in the data base by finding db
    const user=await User.findOne({email:req.body.email});

    //if user already present
    if(user)
    {
        req.flash('success','Id is alredy exist please login');
        return res.send('an account is alreday existed with the id please log in');

    }
    //check pwd and confirm pwd correct or not
    if(!user&& req.body.password==req.body.confirmPassword)
    {
        //add user to database and redirect to sign in page

        const encryptedPwd=await bcrypt.hash(req.body.password,10);
        const newUser=await User.create(
            {
                name:req.body.name,
                email:req.body.email,
                password:encryptedPwd
            }
        );
        return res.render('user_signin');
    }
    //if password not matched
    else
    {
        return res.redirect('back');

    }

}

//method to create a session
module.exports.createSession=function(req,res)
{
    console.log(res.locals.flash);
   req.flash('success','logged in successfully');
        res.redirect('/');

}

//renders signup page 
module.exports.signup=function(req,res)
{
    return res.render('user_signup');
}
//renders signin page
module.exports.signin=function(req,res)
{
    if(req.isAuthenticated())
    {
       return res.redirect('/');
    }
    return res.render('user_signin');
}
//render page for reset password

module.exports.reset=function(req,res)
{
    return res.render('reset');
}
module.exports.updatePwd=async function(req,res)
{
    if(req.body.password!=req.body.confirmPassword)
    {
        res.redirect('back');
    }
    const encryptedPwd=await bcrypt.hash(req.body.password,10);
    const user=await User.findByIdAndUpdate(req.params.id,{password:encryptedPwd});
    return res.redirect('/');
}


module.exports.destrotySession=function(req,res)
{
    console.log(req.flash);
    console.log(res.locals.flash);
    // req.flash('success','logged out successfully');

    console.log("res falsh is ",req.flash('error','logged out successfully'));
    req.logout();
    req.flash('error','logged out successfully');
    
    return res.redirect('/');
}