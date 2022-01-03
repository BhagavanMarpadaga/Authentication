const User = require('../models/user');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const fetch = require('isomorphic-fetch');


//create a new user in db
module.exports.createUser = async function (req, res) {
    //check if the user already existed in the data base by finding db
    const user = await User.findOne({ email: req.body.email });

    //if user already present
    if (user) {
        req.flash('success', 'Id is alredy exist please login');
        return res.redirect('/user/signin');
    }
    //check pwd and confirm pwd correct or not
    if (!user && req.body.password == req.body.confirmPassword) {
        //add user to database and redirect to sign in page

        const response_key = req.body["g-recaptcha-response"];
        const secret_key = process.env.RECAPTCHA_SECRERKEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

        let response=await (await fetch(url,{method:'post'})).json();
        console.log('google response',response);
        if (!response.success) {

            req.flash('success', 'invalid captcha');
            return res.redirect('back');
        }
        else
        {
            const encryptedPwd = await bcrypt.hash(req.body.password, 10);
            let newuser = User.create(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: encryptedPwd
                });
                if(newuser)
                {
                    console.log('user added to db');
                    req.flash('success','successfully signed up');
                    return res.redirect('/user/signin');
                } 
        }
    }
    //if password not matched
    else {
        return res.redirect('back');

    }

}

//method to create a session
module.exports.createSession = function (req, res) {

    if (req.user.isGoogle) {
        User.findByIdAndUpdate(req.user.id,{isGoogle:false},function(err,user){
            if(err)
            {
                console.log('error while updating',err);
                return;
            }
        
        })
        req.flash('success', 'logged in successfully');
        res.redirect('/');
    }
    else {
        const response_key = req.body["g-recaptcha-response"];
        const secret_key = process.env.RECAPTCHA_SECRERKEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

        fetch(url, {
            method: 'post'
        }).then((response) => response.json())
            .then((google_response) => {

                console.log('google respose is ', google_response);
                if (google_response.success === false) {
                    console.log('yes it is false');
                    req.logout();
                    req.flash('error', 'invalid captcha');
                    res.redirect('/user/signin');
                }
                else {
                    req.flash('success', 'logged in successfully');
                    res.redirect('/');
                }

            }).catch(error => {
                console.log(error)
                return;
            })

    }


}

//renders signup page 
module.exports.signup = function (req, res) {
    return res.render('user_signup');
}
//renders signin page
module.exports.signin = function (req, res) {

    if (req.isAuthenticated()) {

        return res.redirect('/');
    }
    return res.render('user_signin');
}
//render page for reset password

// module.exports.reset=function(req,res)
// {
//     // console.log('req user is',req.user);

//     return res.render('reset_pwd',{title:'reset password'});
// }

module.exports.destrotysession = function (req, res) {
    req.logout();
   // console.log("1");
    req.flash('success', 'you are logged out successfully');
   // console.log("2")
    res.redirect('/user/signin');

}


module.exports.updatePwd = async function (req, res) {
    if (req.body.password != req.body.confirmPassword) {
        res.redirect('back');
    }
    const encryptedPwd = await bcrypt.hash(req.body.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, { password: encryptedPwd });
    return res.redirect('/');
}


