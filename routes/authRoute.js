// routes/authRoute.js
import express from "express";
import { login, register,refreshToken, logout } from "../controllers/authController.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").get(refreshToken);
router.post("/logout", logout);


export default router;
