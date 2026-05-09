import { Schema, model } from "mongoose";

export const transactionCategories = ["Salary", "Food", "Travel", "Bills", "Shopping", "Entertainment", "Health", "Freelance", "Savings"] as const;

const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, enum: transactionCategories, required: true },
    date: { type: Date, required: true },
    notes: { type: String }
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);
