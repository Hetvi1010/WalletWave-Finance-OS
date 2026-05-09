import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { getDashboardAnalytics } from "../services/analytics.service";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getDashboardAnalytics(req.user!.id);
  res.json(data);
});
