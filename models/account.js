import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
     userID : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "User",
         required : true,
         unique : true    
     },
     balance : {
         type : Number,
         required : true,
         default : 5000
     },
     credit : {
         type : Number,
         required : true,
         default : 0
     },
     debit : {
        type : Number,
        required : true,
        default : 0
    },
    totalCredit : {
        type : Number,
        required : true,
        default : 0
    },
    totalDebit : {
        type : Number,
        required : true,
        default : 0
    },
    month : {
       type : Number,
       default : new Date().getMonth()
    }
    



}, {timestamps : true})

accountSchema.methods.toJSON = function () {
    const account = this.toObject();
    delete account._id;
    delete account.userID;
    delete account.cardDetails;
    return account;
}

const Account = mongoose.model("Account", accountSchema);

export default Account;