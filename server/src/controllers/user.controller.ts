import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    currency: user.currency,
    monthlyBudget: user.monthlyBudget,
    themePreference: user.themePreference
  });
});
