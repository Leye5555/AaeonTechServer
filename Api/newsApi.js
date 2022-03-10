import axios from "axios";
import express from "express";
import dotenv from "dotenv";

const app = express();
if (app.get("env") !== "production") dotenv.config();

const mySecretKey = process.env.mySecretKey;

const API = axios.create({
    baseURL : "https://newsapi.org"
});

export const getNews = async () => await API.get(`/v2/top-headlines?country=ng&category=business&apiKey=${mySecretKey}`);
