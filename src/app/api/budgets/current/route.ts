import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { findLocalBudget, listLocalTransactions } from "@/server/local-store";
import { Budget } from "@/server/models/Budget";
import { Transaction } from "@/server/models/Transaction";
import { getCurrentMonthLabel, getMonthRange } from "@/server/month";
import { serializeBudget } from "@/server/serializers";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const month = getCurrentMonthLabel();
  const { monthStart, monthEnd } = getMonthRange();
  if ("isLocal" in user && user.isLocal) {
    const budget = await findLocalBudget(user._id, month);
    const transactions = await listLocalTransactions(user._id);
    const spent = transactions
      .filter((item) => item.type === "expense" && new Date(item.date) >= monthStart && new Date(item.date) <= monthEnd)
      .reduce((sum, item) => sum + item.amount, 0);

    return NextResponse.json(serializeBudget(budget, month, budget?.limit || user.monthlyBudget, spent));
  }

  const budget = await Budget.findOne({ user: user._id, month });
  const spent = await Transaction.aggregate([
    { $match: { user: user._id, type: "expense", date: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  return NextResponse.json(serializeBudget(budget, month, budget?.limit || user.monthlyBudget, spent[0]?.total || 0));
}
