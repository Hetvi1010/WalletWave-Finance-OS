import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Transaction } from "../models/Transaction";
import { buildCsv, buildPdf } from "../services/export.service";

export const exportTransactionsCsv = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Transaction.find({ user: req.user!.id }).sort({ date: -1 }).lean();
  const csv = buildCsv(
    rows.map((row) => ({
      title: row.title,
      amount: row.amount,
      category: row.category,
      type: row.type,
      date: new Date(row.date).toISOString().slice(0, 10)
    }))
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
  res.send(csv);
});

export const exportTransactionsPdf = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Transaction.find({ user: req.user!.id }).sort({ date: -1 }).lean();
  const pdf = await buildPdf(
    rows.map((row) => ({
      title: row.title,
      amount: row.amount,
      category: row.category,
      type: row.type,
      date: new Date(row.date).toISOString().slice(0, 10)
    }))
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");
  res.send(pdf);
});
