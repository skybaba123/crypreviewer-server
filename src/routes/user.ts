import deleteUserHandler from "@/controllers/user/deleteUser";
import getAllUsersHandler from "@/controllers/user/getAllUsers";
import getUser from "@/controllers/user/getUser";
// import getUserReferralsHandler from "@/controllers/user/getUserReferrals";
import updateUserHandler from "@/controllers/user/updateUser";
import userAuth from "@/middlewares/userAuth";
import { Router } from "express";

const router = Router();

router.get("/user", userAuth, getUser);

router.get("/users", userAuth, getAllUsersHandler);

// router.post("/user/referrals", userAuth, getUserReferralsHandler);

router.post("/user/update", userAuth, updateUserHandler);

router.post("/user/delete", userAuth, deleteUserHandler);

export default router;
