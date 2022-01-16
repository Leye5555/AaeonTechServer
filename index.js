import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/Routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.CONNECTION_URL;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({extended : true, limit : "30mb"}));
app.use(cors()); // cors should always come before router 


app.use("/", router)

app.get("/", (req,res) => {
    res.send("Welcome to Aaeon Tech API");
})



mongoose.connect(CONNECTION_URL, {useNewUrlParser : true}, {useUnifiedTopology : true, useCreateIndex : true}).then(() => {app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))}).catch(err => console.log(err));
