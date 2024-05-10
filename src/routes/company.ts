import { Router } from "express";
import getCompanyDataHandler from "@/controllers/company/getCompanyData";
import updateCompanyHandler from "@/controllers/company/updateCompany";
import userAuth from "@/middlewares/userAuth";

const router = Router();

router.post("/company", getCompanyDataHandler);

router.post("/company/update", userAuth, updateCompanyHandler);

export default router;
