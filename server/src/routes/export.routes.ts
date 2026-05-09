import { Router } from "express";
import { exportTransactionsCsv, exportTransactionsPdf } from "../controllers/export.controller";

export const exportRouter = Router();

exportRouter.get("/transactions.csv", exportTransactionsCsv);
exportRouter.get("/transactions.pdf", exportTransactionsPdf);
