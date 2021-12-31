const passport=require('passport');
const googleStratrgy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const bcrypt=require('bcryptjs');

//tell passport to use google
//if accesstoken expires refresh token helps 
passport.use(new googleStratrgy({
    clientID:"78092715911-7l7ntuvr1m5i7v2a29656ibr45kroi3o.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/user/auth/google/callback",

},function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err)
        {
            console.log("Error in passport google stargey",err);
            return;
        }
        console.log(profile);

        if(user)
        {
            return done(null,user);
        }
        else
        {
            //generate random pwd
            let Randompwd=crypto.randomBytes(10).toString('hex');
            //encrpt it using bcrpy
            bcrypt.hash(Randompwd,10).then((pwd)=>{

                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:pwd
                },function(err,user){
                    if(err)
                    {
                        console.log("error in creating user",err);
                        return;
                    }
                    return done(null,user);
                })

            })

        }

    })
}))

module.exports=passport;