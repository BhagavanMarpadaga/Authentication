const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//user bcrypt js to decrpt and comapre user passowrd
const bcrypt=require('bcryptjs');
const User = require('../models/user');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true},
    function (req, email, password, done) {
        
        User.findOne({ email: email }, function (err, user) {
            
            // console.log('password',password,user.password);
            if (err) {
                console.log("Error in finding the user in db",err);
                return done(err);
            }
            if (!user) {

                console.log("checking i m i coming here again and again in side user not found");
                req.flash('success','Invalid username/password');
                // req.session.destroy();
                return done(null, false);
            }
            bcrypt.compare(password,user.password,function(err,result){
                if(err)
                {
                    // console.log('error in decrypting code');
                     done(err);
                }
                else if(!result)
                {
                
                   // console.log("checking i m i coming here again and again in sidepwd doesn't macth");
                    req.flash('error','Invalid username/password');
                    // req.session.destroy();
                     done(null,false);
                }
                else {
                  
                    console.log("okay both passwords matched");
                     done(null, user);
                }
            })

        })
    }))
   

//serialize the user to decide which key is to be kept in cookies
passport.serializeUser(function(user,done){

    done(null,user.id);

})

passport.deserializeUser(function(id,done){

    User.findById(id,function(err,user){
        if(err)
        {
            console.log("Error in deserializing the user",err);
            return;
        }
         done(null,user);
    })
})



//check if the user is authenticated

passport.checkAuthentication=function(req,res,next)
{
    //if the user is signed in then pass on the requets to the next function(controller)

    // console.log(req.user);
    console.log('is Authenticated',req.isAuthenticated);
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        res.redirect('/user/signin');
    }
}

passport.setAuthenticatedUser=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        //req.user contains current signed user from the session cookie and we are just 
        //sending them to locals for the views
        res.locals.user=req.user;

    }
    next();

}

module.exports=passport;

