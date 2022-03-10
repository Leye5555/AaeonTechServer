import axios from "axios";
import express from "express";
import dotenv from "dotenv";

const app = express();
if (app.get("env") !== "production") dotenv.config();

const myPaystackSecretKey = process.env.myPaystackSecretKey;
const paystackAPI = axios.create({
    baseURL : "https://api.paystack.co"
})


paystackAPI.interceptors.request.use(req => {
    req.headers.authorization = `Bearer ${myPaystackSecretKey}`
    return req;
})


export const confirmAccount = (accountNumber, bankCode) => paystackAPI.get(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
export const getBanks = () => paystackAPI.get("/bank");
export const confirmCard = (firstSixDigits) => paystackAPI.get(`/decision/bin/${firstSixDigits}`); 