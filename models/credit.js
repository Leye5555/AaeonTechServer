import mongoose from "mongoose";
const creditSchema = mongoose.Schema({
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
        required : true,
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
}, {timestamps : true});

const Credit = mongoose.model("Credit", creditSchema);

export default Credit;


