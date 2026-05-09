import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { buildCsv } from "@/server/export";
import { listLocalTransactions } from "@/server/local-store";
import { Transaction } from "@/server/models/Transaction";

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rows =
    "isLocal" in user && user.isLocal
      ? await listLocalTransactions(user._id)
      : await Transaction.find({ user: user._id }).sort({ date: -1 }).lean();
  const csv = buildCsv(
    rows.map((row) => ({
      title: row.title,
      amount: row.amount,
      category: row.category,
      type: row.type,
      date: new Date(row.date).toISOString().slice(0, 10)
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="transactions.csv"'
    }
  });
}
