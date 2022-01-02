const mongoose=require('mongoose');

const resetPwdSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    accesstoken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

const Resetpwd=mongoose.model('Resetpwd',resetPwdSchema);
module.exports=Resetpwd;