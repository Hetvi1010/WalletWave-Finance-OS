import { Router } from "express";
import { getDashboard } from "../controllers/analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard", getDashboard);
