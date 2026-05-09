import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { asyncHandler } from "../utils/async-handler";

export const requireAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = header.replace("Bearer ", "");
  const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
  const user = await User.findById(payload.userId);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.user = user;
  next();
});
