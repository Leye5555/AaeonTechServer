import User from "../models/User.js";
import bcrypt from "bcrypt";
import Account from "../models/account.js";
import Debit from "../models/debit.js";
import Credit from "../models/credit.js";
import Beneficiary from "../models/beneficiaries.js";
import Card from "../models/cards.js";

export const newUser = async (req, res) => {
  try {
    const existingUser = await User.find({ email: req.body.email });
    if (existingUser.length !== 0) {
      res.send({message : "user already exists 🚫"});
    }else {
      const user = new User(req.body);
      user.password = await bcrypt.hash(user.password, 8);
      await user.save();
      const token = await user.generateAuthToken();
      user.tokens = user.tokens.concat({ token });
      await user.save();
      const id = user._id;
      const newAccount = new Account({ userID: id });
      newAccount.save();
      res.status(201).send({ user, newAccount, token });
    }
 
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.loginUserUsingEmailAndPassword(
      req.body.email,
      req.body.password
    );
    if (!user) {
      res.send({message : "Unauthorised user"})
    }else {
      const token = await user.generateAuthToken();
      user.tokens = user.tokens.concat({ token });
      await user.save();
      const currentUser = await User.find({ email: req.body.email });
      const account = await Account.findOne({ userID: currentUser[0]._id });
      res.status(200).send({ user, account, token });
    }
    
  } catch (error) {
    res.send({message : "Unauthorised user"})
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
  }
};

export const makePayment = async (req, res) => {
  try {
    const sender_email = req.body.senderEmail;
    const sender_password = req.body.senderPassword;
    const user = await User.findOne({ email: sender_email });
    const user_id = user?._id;
    const receiver_email = req.body.receiverEmail;
    const receiver = await User.findOne({ email: receiver_email });
    const isPassword = await User.loginUserUsingEmailAndPassword(
      sender_email,
      sender_password
    );
    const receiver_app_id = receiver && receiver?._id.toString().slice(18, 25);
    if (!receiver) {
      res.send({ message: "Invalid User 🚫" });
    }
    if (receiver_app_id !== req.body.receiverId && receiver) {
      res.send({ message: "Incorrect Name" });
    }
    if (!isPassword && receiver_app_id === req.body.receiverId && receiver) {
      res.send({ message: "Incorrect Password" });
    }
    if (receiver && isPassword && receiver_app_id === req.body.receiverId) {
      const receiverAccount = await Account.findOne({ userID: receiver?._id });
      const senderAccount = await Account.findOne({ userID: user_id });
      if (senderAccount?.balance < req.body.amount) {
        res.send({ message: "Insufficient funds" });
      } else {
        const newPayment = new Debit({
          ...req.body,
          userID: user_id,
          senderName: user?.fullName,
          receiverName: receiver?.fullName,
        });
        await newPayment.save();
        let newCreditBalance =
          receiverAccount?.balance + Number(req.body.amount);
        let newDebitBalance = senderAccount?.balance - Number(req.body.amount);
        await Account.findByIdAndUpdate(
          receiverAccount?._id,
          { balance: `${newCreditBalance}` },
          { new: true }
        );
        await Account.findByIdAndUpdate(
          senderAccount?._id,
          { balance: `${newDebitBalance}`},
          { new: true }
        );
        const credit = new Credit({
          ...req.body,
          userID: receiver?._id,
          senderName: user?.fullName,
          receiverName: receiver?.fullName,
        });
        await credit.save();
        res.status(200).send({ message: "Successful! ✅" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAnalyticsData = async (req, res) => {
  const _id = req.params.id;
  try {
    const amount = await Account.findOne({ userID: _id });
    res.status(200).send(amount);
  } catch (err) {
    console.log(err);
  }
};

export const getTransactions = async (req, res) => {
  const _id = req.params.id;
  try {
    const debits = await Debit.find({ userID: _id });
    const credits = await Credit.find({ userID: _id });
    res.status(200).send({ credits, debits });
  } catch (err) {
    console.log(err);
  }
};

export const addBeneficiary = async (req,res) => {
  try{
      const refUser = await User.findOne({_id : req.body.userID});
      const user= await User.findOne({email : req.body.beneficiaryEmail})
      if (!user) {
         res.send({message : "Not a user 🚫"});
      }else{
            const existingBeneficiary = await Beneficiary.find({beneficiaryId : user?._id});
        if (existingBeneficiary?.filter(person => person.userID.toString()  === refUser?._id.toString() )?.length >= 1) {
          res.send({message : "Existing Beneficiary 🚫"});
        }else {
          const beneficiary = new Beneficiary({...req.body , beneficiaryId : user?._id})
          await beneficiary.save();
          res.status(200).send({message : "Successful! ✅"});
        } 
      }
     
  }catch(err) {
      console.log(err);
  }
} 

 export  const getBeneficiaries = async (req, res) => {
     const _id = req.params.id;

     try{
        const allBeneficiaries = await Beneficiary.find({userID : _id});
        res.status(200).send(allBeneficiaries);
     }catch(err) {
       console.log(err);
     }
   }
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.tokens = user.tokens?.filter((token) => token.token !== req.token);
    await user.save();
    res.status(200).send({message : "logout successful"});
  } catch (err) {
    console.log(err);
  }
};

export const changePassword = async (req,res) => {
     try{
        const logggedInUser = await User.loginUserUsingEmailAndPassword(req.body.userEmail, req.body.oldPassword);
        if (logggedInUser) {
          const user = await User.findOne({email : req.body.userEmail});
          const hashedPassword = await bcrypt.hash(req.body.newPassword, 8);
          user.password = hashedPassword;
          await user.save();
          res.status(201).send({message : "Password changed ✅"})
        }else{
          res.send({message : "Old password incorrect ✅"})
        }
        

     }catch(err) {
       console.log(err)
       
     }
} 

export const deleteAccount = async (req,res) => {
    try{
        const user = await User.loginUserUsingEmailAndPassword(req.body.email,req.body.password);
        
        if (user) {
           const id = user?._id;
           await Account.findOneAndDelete({userID : id});
           await Credit.findOneAndDelete({userID : id});
           await Debit.deleteMany({userID : id});
           await Card.deleteMany({userID : id});
           await Beneficiary.deleteMany({userID : id});
           await User.findByIdAndDelete(id);
           res.status(200).send({message : "Account deleted"});
        }else {
            res.send({message : "Incorrect password"})
        }
    }catch(err){
         console.log(err);
    }
}
