import mongoose from "mongoose";
const debitSchema = mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    senderEmail  : {
        type : String,
        required : true
    },  
     senderId : {
        type : String,
        required : true
    },
     senderName : {
        type : String,
        required : true
     },
    receiverEmail : {
       type : String,
       required : true
    }, 
    receiverId : {
       type : String,
       required : true
    },
    receiverName : {
        type : String,
        required : true
    },
    amount : {
            type : Number,
            required : true
        }

},{timestamps : true});

const Debit = mongoose.model("debit", debitSchema);

export default Debit;