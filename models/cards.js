import mongoose from "mongoose";
const cardSchema = mongoose.Schema({
      userID : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "User",
          required : true
        },
       
        bankCode : {
            type : String,
            required : true
        },
    
          accountNumber : {
              type : String,
              required : true
          },
   
          nameOnCard : {
          type : String,
          required : true
       },
         cardNumber : {
             type : Number,
             required : true,
             default : 12345671234
         },
         expiration : {
             year : {
                 type : Number,
                 required : true
             },
             month : {
                 type : Number,
                 required : true
             }
         },
         cvv : {
             type : Number,
             required : true,
             default : 123
         }
})

const Card = mongoose.model("Card", cardSchema);

export default Card;