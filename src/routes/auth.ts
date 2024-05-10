import forgotKeyHandler from "@/controllers/auth/forgotKey";
import loginController from "@/controllers/auth/login";
import registerController from "@/controllers/auth/register";
import { Router } from "express";
import verifyOtpHandler from "@/controllers/auth/verifyOtp";
import userAuth from "@/middlewares/userAuth";

const router = Router();

router.post("/login", loginController);

router.post("/register", userAuth, registerController);

router.post("/auth/forgot-key", forgotKeyHandler);

router.post("/auth/verify-otp", verifyOtpHandler);

export default router;
