const queue=require('../config/kue');

const resetpwdMailer=require('../mailers/reset_password');

//process function
queue.process('emails',function(job,done){
    console.log('yes my workers are workig fine',job.data);
    resetpwdMailer.newPwd(job.data);
    done();
})