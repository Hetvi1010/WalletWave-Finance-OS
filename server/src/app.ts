import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { analyticsRouter } from "./routes/analytics.routes";
import { authRouter } from "./routes/auth.routes";
import { budgetRouter } from "./routes/budget.routes";
import { exportRouter } from "./routes/export.routes";
import { transactionRouter } from "./routes/transaction.routes";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// app.use("/api/auth", authRouter);
// app.use("/api/users", requireAuth, userRouter);
// app.use("/api/transactions", requireAuth, transactionRouter);
// app.use("/api/budgets", requireAuth, budgetRouter);
// app.use("/api/analytics", requireAuth, analyticsRouter);
// app.use("/api/exports", requireAuth, exportRouter);
app.use(errorHandler);
