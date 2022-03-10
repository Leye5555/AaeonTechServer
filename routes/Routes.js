import express from "express";
import Auth from "../middleware/Auth.js"
import { newUser, loginUser, getAnalyticsData, makePayment, getTransactions, getAllUsers,addBeneficiary, logout, getBeneficiaries, changePassword, deleteAccount} from "../controllers/controls.js";
import { confirmAccount,confirmCard, deleteCard, getBanks, getCards } from "../controllers/paystack.js";
import { getNews } from "../controllers/newsApi.js";

const router = express.Router();


router.post("/auth/sign_up", newUser);
router.post("/auth/login", loginUser);
router.get("/all_users", Auth, getAllUsers); // not needed
router.patch("/make-payment",Auth, makePayment);
router.get("/set_analytics/:id",Auth, getAnalyticsData); 
router.post("/confirm-card",Auth, confirmCard); //
router.get("/get_cards/:id",Auth, getCards);
router.post("/confirm-account",Auth, confirmAccount); // not needed
router.get("/transactions/:id",Auth, getTransactions);
router.post("/add_beneficiary",Auth, addBeneficiary);
router.get("/get_beneficiaries/:id",Auth, getBeneficiaries);
router.get("/bank",Auth, getBanks); //
router.get("/get_news",Auth, getNews);
router.patch("/change_password", changePassword);
router.delete("/delete_card/:id", deleteCard);
router.get("/logout",Auth, logout);
router.patch("/delete_account", deleteAccount); // patch was used to confirm password before deleting account


export default router;