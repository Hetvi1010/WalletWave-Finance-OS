import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { isLocalUser, listLocalTransactions, updateLocalUser, upsertLocalBudget } from "@/server/local-store";
import { Budget } from "@/server/models/Budget";
import { Transaction } from "@/server/models/Transaction";
import { getCurrentMonthLabel } from "@/server/month";
import { serializeBudget } from "@/server/serializers";

export const runtime = "nodejs";

const budgetSchema = z.object({
  limit: z.number().positive()
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const values = budgetSchema.parse(body);
    const month = getCurrentMonthLabel();

    if (isLocalUser(user)) {
      const budget = await upsertLocalBudget(user._id, month, values.limit);
      await updateLocalUser(user._id, { monthlyBudget: values.limit });

      const date = new Date();
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      const transactions = await listLocalTransactions(user._id);
      const spent = transactions
        .filter((item) => item.type === "expense" && new Date(item.date) >= monthStart && new Date(item.date) <= monthEnd)
        .reduce((sum, item) => sum + item.amount, 0);

      user.monthlyBudget = values.limit;

      return NextResponse.json(serializeBudget(budget, month, values.limit, spent), {
        status: 201
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: user._id, month },
      { user: user._id, month, limit: values.limit },
      { upsert: true, new: true }
    );

    user.monthlyBudget = values.limit;
    await user.save();

    const date = new Date();
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    const spent = await Transaction.aggregate([
      { $match: { user: user._id, type: "expense", date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return NextResponse.json(serializeBudget(budget, month, values.limit, spent[0]?.total || 0), {
      status: 201
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to save budget" }, { status: 500 });
  }
}
