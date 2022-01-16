import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

const mySecretKey = process.env.mySecretKey;

const API = axios.create({
    baseURL : "https://newsapi.org"
});

export const getNews = async () => await API.get(`/v2/top-headlines?country=ng&category=business&apiKey=${mySecretKey}`);
