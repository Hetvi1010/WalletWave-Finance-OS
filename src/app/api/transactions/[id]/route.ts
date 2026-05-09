import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { deleteLocalTransaction, updateLocalTransaction } from "@/server/local-store";
import { Transaction, transactionCategories } from "@/server/models/Transaction";
import { serializeTransaction } from "@/server/serializers";

export const runtime = "nodejs";

const transactionSchema = z.object({
  title: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.enum(transactionCategories).optional(),
  date: z.string().optional(),
  notes: z.string().optional()
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const values = transactionSchema.parse(body);
    const { id } = await context.params;

    if ("isLocal" in user && user.isLocal) {
      const transaction = await updateLocalTransaction(id, user._id, {
        ...values,
        ...(values.date ? { date: new Date(values.date).toISOString() } : {})
      });

      if (!transaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
      }

      return NextResponse.json(serializeTransaction(transaction));
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: user._id },
      { ...values, ...(values.date ? { date: new Date(values.date) } : {}) },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(serializeTransaction(transaction));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update transaction" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if ("isLocal" in user && user.isLocal) {
    await deleteLocalTransaction(id, user._id);
    return NextResponse.json({ message: "Transaction deleted" });
  }

  await Transaction.findOneAndDelete({ _id: id, user: user._id });

  return NextResponse.json({ message: "Transaction deleted" });
}
