import { Request, Response } from "express";
import { z } from "zod";
import { Budget } from "../models/Budget";
import { Transaction } from "../models/Transaction";
import { asyncHandler } from "../utils/async-handler";

const budgetSchema = z.object({
  month: z.string(),
  limit: z.number().positive()
});

export const getCurrentBudget = asyncHandler(async (req: Request, res: Response) => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const budget = await Budget.findOne({ user: req.user!.id, month });
  const spent = await Transaction.aggregate([
    { $match: { user: req.user!._id, type: "expense", date: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const limit = budget?.limit || req.user!.monthlyBudget;
  const totalSpent = spent[0]?.total || 0;
  const remaining = limit - totalSpent;
  res.json({
    _id: budget?.id,
    month,
    limit,
    spent: totalSpent,
    remaining,
    status: remaining < 0 ? "exceeded" : remaining < limit * 0.2 ? "warning" : "safe"
  });
});

export const upsertBudget = asyncHandler(async (req: Request, res: Response) => {
  const values = budgetSchema.parse(req.body);
  const budget = await Budget.findOneAndUpdate(
    { user: req.user!.id, month: values.month },
    { limit: values.limit, user: req.user!.id, month: values.month },
    { upsert: true, new: true }
  );

  await req.user!.updateOne({ monthlyBudget: values.limit });
  const currentDate = new Date();
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  const spent = await Transaction.aggregate([
    { $match: { user: req.user!._id, type: "expense", date: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const totalSpent = spent[0]?.total || 0;

  res.status(201).json({
    _id: budget.id,
    month: budget.month,
    limit: budget.limit,
    spent: totalSpent,
    remaining: budget.limit - totalSpent,
    status: budget.limit - totalSpent < 0 ? "exceeded" : budget.limit - totalSpent < budget.limit * 0.2 ? "warning" : "safe"
  });
});
