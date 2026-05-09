import { Request, Response } from "express";
import { z } from "zod";
import { Transaction, transactionCategories } from "../models/Transaction";
import { asyncHandler } from "../utils/async-handler";

const transactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.enum(transactionCategories),
  date: z.string(),
  notes: z.string().optional()
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.find({ user: req.user!.id }).sort({ date: -1 });
  res.json(transactions);
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const values = transactionSchema.parse(req.body);
  const transaction = await Transaction.create({
    ...values,
    user: req.user!.id,
    date: new Date(values.date)
  });
  res.status(201).json(transaction);
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const values = transactionSchema.partial().parse(req.body);
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    { ...values, ...(values.date ? { date: new Date(values.date) } : {}) },
    { new: true }
  );
  res.json(transaction);
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
  res.json({ message: "Transaction deleted" });
});
