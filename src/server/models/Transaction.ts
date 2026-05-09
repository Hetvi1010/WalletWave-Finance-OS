import { InferSchemaType, Schema, model, models } from "mongoose";

export const transactionCategories = [
  "Salary",
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Freelance",
  "Savings"
] as const;

const transactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, enum: transactionCategories, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export type TransactionDocument = InferSchemaType<typeof transactionSchema> & {
  _id: { toString(): string };
};

export const Transaction = models.Transaction || model("Transaction", transactionSchema);
