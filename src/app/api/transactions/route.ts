import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { createLocalTransaction, listLocalTransactions } from "@/server/local-store";
import { Transaction, transactionCategories } from "@/server/models/Transaction";
import { serializeTransaction } from "@/server/serializers";

export const runtime = "nodejs";

const transactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.enum(transactionCategories),
  date: z.string(),
  notes: z.string().optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if ("isLocal" in user && user.isLocal) {
    const transactions = await listLocalTransactions(user._id);
    return NextResponse.json(transactions.map(serializeTransaction));
  }

  const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 });
  return NextResponse.json(transactions.map(serializeTransaction));
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const values = transactionSchema.parse(body);
    if ("isLocal" in user && user.isLocal) {
      const transaction = await createLocalTransaction(user._id, {
        ...values,
        notes: values.notes || "",
        date: new Date(values.date).toISOString()
      });

      return NextResponse.json(serializeTransaction(transaction), { status: 201 });
    }

    const transaction = await Transaction.create({
      ...values,
      user: user._id,
      date: new Date(values.date)
    });

    return NextResponse.json(serializeTransaction(transaction), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create transaction" }, { status: 500 });
  }
}
