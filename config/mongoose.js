const mongoose=require('mongoose');
const dotenv=require('dotenv').config();


mongoose.connect(process.env.MONGO_URI);
const db=mongoose.connection;

db.on('error',function(err){
    console.log("error while connecting to db",err);
    return;
})

db.once('open',function(){
    console.log('successfuuly connected to db');
})

module.exports=db;