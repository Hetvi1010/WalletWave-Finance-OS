import { Router } from "express";
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from "../controllers/transaction.controller";

export const transactionRouter = Router();

transactionRouter.get("/", getTransactions);
transactionRouter.post("/", createTransaction);
transactionRouter.put("/:id", updateTransaction);
transactionRouter.delete("/:id", deleteTransaction);
