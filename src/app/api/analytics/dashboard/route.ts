import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { buildDashboardAnalytics, getDashboardAnalytics } from "@/server/dashboard";
import { findLocalBudget, listLocalTransactions } from "@/server/local-store";
import { getCurrentMonthLabel } from "@/server/month";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if ("isLocal" in user && user.isLocal) {
    const transactions = await listLocalTransactions(user._id);
    const currentMonth = getCurrentMonthLabel();
    const budget = await findLocalBudget(user._id, currentMonth);
    const data = buildDashboardAnalytics(transactions, user.monthlyBudget, currentMonth, budget);
    return NextResponse.json(data);
  }

  const data = await getDashboardAnalytics(user._id.toString(), user.monthlyBudget);
  return NextResponse.json(data);
}
