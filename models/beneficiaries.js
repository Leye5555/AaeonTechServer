import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    beneficiaryEmail : {
        type : String,
        required : true
    },
    beneficiaryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
   
    beneficiaryName : {
        type : String,
        required : true
    }
}, {timestamps : true});

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);

export default Beneficiary;