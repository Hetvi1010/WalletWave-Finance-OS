import { Router } from "express";
import { getProfile } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/me", getProfile);
