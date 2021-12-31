const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/authentication_dev');
const db=mongoose.connection;

db.on('error',function(err){
    console.log("error while connecting to db",err);
    return;
})

db.once('open',function(){
    console.log('successfuuly connected to db');
})

module.exports=db;