import { Router } from "express";
import { getCurrentBudget, upsertBudget } from "../controllers/budget.controller";

export const budgetRouter = Router();

budgetRouter.get("/current", getCurrentBudget);
budgetRouter.post("/", upsertBudget);
