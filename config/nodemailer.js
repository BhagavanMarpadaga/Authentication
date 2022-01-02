const nodemailer=require('nodemailer');
const dotenv=require('dotenv').config();
const ejs=require('ejs');
const path=require('path');

let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth: {  //with which you will send emails
        user: process.env.USER, // generated ethereal user
        pass:process.env.PASSWORD // generated ethereal password
    }

});

let renderTemplate=(data,relativePath)=>{
    // console.log("inside nodemailersjs data",data);
    let mailHTML;
    ejs.renderFile(path.join(__dirname,'../views/mailers',relativePath),data,
    function(err,template){
        if(err)
        {
            console.log('error in rendering the template',err);
            return;
        }
        mailHTML=template;

    })
    return mailHTML;
}
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate

}
