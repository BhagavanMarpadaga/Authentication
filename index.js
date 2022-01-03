const express=require('express');
const app=express();
const port=8000;

const expresslayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport_local_strategy');
const passportGoogle=require('./config/passport_google_oauth2_strategy');
const mongoStore=require('connect-mongo');
const dotenv=require('dotenv').config();
const cookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs');
const flash=require('connect-flash');
const customMiddleware=require('./config/middleware');



app.use(express.urlencoded({extended:true}));

app.use(expresslayouts);

//extractong styles in to the app
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(express.static('./Assets'));


//set up our views
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({name:'Authentication',
secret:'something',
resave: false,
saveUninitialized: true,
cookie:{
    maxAge:(1000*60*100)
},
store: mongoStore.create({
    mongoUrl: 'mongodb://localhost/authentication_dev',
    autoRemove: 'disabled'
}, function (err) {
    console.log(err);
})}))


//tell app to use session
app.use(passport.initialize());
app.use(passport.session());
//set up current user usage
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setFlash);

app.use('/',require('./routes'));


app.listen(process.env.PORT || 5000,function(err){

    if(err)
    {
        console.log("error while firing the server");
        return;
    }
    console.log("successfully connected to server on port",port);
})