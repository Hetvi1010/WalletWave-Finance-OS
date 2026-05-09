import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { asyncHandler } from "../utils/async-handler";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const values = signupSchema.parse(req.body);
  const exists = await User.findOne({ email: values.email });
  if (exists) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const user = await User.create(values);
  const token = signToken(user.id);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
      themePreference: user.themePreference
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const values = loginSchema.parse(req.body);
  const user = await User.findOne({ email: values.email });

  if (!user || !(await user.comparePassword(values.password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
      themePreference: user.themePreference
    }
  });
});
