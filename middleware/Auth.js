import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();


const  JWT_SECRET = process.env.JWT_SECRET; 

const Auth = async (req, res, next) => {
      try {
      const token = await req.headers.authorization.replace("Bearer ", "");
      const decodedToken = jwt.verify(token, JWT_SECRET);
      const user = await User.find({_id : decodedToken, "tokens.token" : token});


      if (!user) {
        throw new Error("unauthorised user")  }

      req.user = user;
      req.userId = user[0]?._id;
      req.token = token;
      next()

      }catch (error) {
          res.status(500).send(error)
          console.log(error);
      }
}

export default Auth;