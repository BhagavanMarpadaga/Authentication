const nodeMailer=require('../config/nodemailer');

exports.newPwd=(resetPwdData)=>{
//    console.log("Inside Mailer resetPwdData",resetPwdData);
//    console.log("userName",resetPwdData.userName);
//    console.log("userEmail",resetPwdData.userEmail);
  //  declare your tmeplate here
    let htmlString=nodeMailer.renderTemplate({resetPwdData:resetPwdData},'/resetPwd/new_pwd.ejs');
   // console.log("Html string to pass is ",htmlString);
    nodeMailer.transporter.sendMail({
        from:'AuthenticationDev.in',
        to:resetPwdData.userEmail,
        subject:'Reset your password',
        html:htmlString
    },(err,info)=>{
        if(err)
        {
            console.log('Error in sending mail while sending link to reset password',err);
            return;
        }
        console.log('MESSAGE sent');
        return;
    })
}