import userAuth from "@/middlewares/userAuth";
import { Router } from "express";
import deleteTransactionHandler from "@/controllers/transaction/deleteTransaction";
import getAllTransactionsHandler from "@/controllers/transaction/getAllTransactions";
import getTransactionHandler from "@/controllers/transaction/getTransaction";
import getUserTransactionsHandler from "@/controllers/transaction/getUserTransactions";
import earningTransactionHandler from "@/controllers/transaction/earningTransaction";
import withdrawTransactionHandler from "@/controllers/transaction/withdrawTransaction";
import approveWithdrawalHandler from "@/controllers/transaction/approveWithdrawal";
import rejectWithdrawalHandler from "@/controllers/transaction/rejectWithdrawal";

const router = Router();

router.get("/transactions", userAuth, getAllTransactionsHandler);

router.post("/transactions/user", userAuth, getUserTransactionsHandler);

router.post("/transaction", userAuth, getTransactionHandler);

router.post("/transaction/earning", userAuth, earningTransactionHandler);

router.post("/transaction/withdraw", userAuth, withdrawTransactionHandler);

router.post(
  "/transaction/approve-withdrawal",
  userAuth,
  approveWithdrawalHandler
);

router.post(
  "/transaction/reject-withdrawal",
  userAuth,
  rejectWithdrawalHandler
);

router.post("/transaction/delete", userAuth, deleteTransactionHandler);

export default router;
