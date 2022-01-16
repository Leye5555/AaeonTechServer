import * as api from "../Api/paystack.js";
import Account from "../models/account.js";
import Card from "../models/cards.js";



export const confirmAccount = async (req,res) => {
     try {
       const accountNumber = req.body.accountNumber;
       const bankSlug = req.body.bankSlug;
       const banks = await api.getBanks();
       const bankCode = banks.data.data.filter((bank) => bank.slug === bankSlug)[0].code;
       const paystackResponse = await api.confirmAccount(accountNumber,bankCode);
       res.status(200).send("ok");
     } catch(err) {
         res.status(401).send("fail");
     } 
} 

export const confirmCard = async (req,res) => {
    const cardNum = req.body.cardNumber;
    const newCard = req.body;
    newCard.userID;
    try {
         const firstSixDigits = cardNum?.slice(0,6);
         await api.confirmCard(firstSixDigits);
         await api.confirmAccount(req.body.accountNumber, req.body.bankCode);
         const existingCard = await Card.findOne({cardNumber : req.body.cardNumber});
         if (existingCard){
              res.send({message : "Existing Card 🚫"})
         }else {
               const addedCard = new Card(newCard);
               await addedCard.save();
               res.status(200).send({message : "Successful! ✅"});
         }
        
    }catch(err) {
         console.log(err)
         res.send({message : "Details Incorrect"})
    }
}

export const getCards = async (req,res) => {
     const _id = req.params.id
     try {
         const myCards = await Card.find({userID : _id});
         res.status(200).send(myCards);
     }catch(err) {
          console.log(err)
     }
}

export const deleteCard = async (req,res) => {
     const _id =req.params.id;
     try{
          const card = await Card.findByIdAndDelete(_id);
          if (card) {
            res.status(200).send({message : "Card deleted ✅"})
          }else {
               res.send({message : "Delete failed 🚫"})
          }
         
     }catch(err) {
          console.log(err);
     }
}

export const getBanks = async (req,res) => {
    try{
         const banks = await api.getBanks();
         res.status(200).send(banks.data.data);
    }catch(err) {
       console.log(err);
    }
}

