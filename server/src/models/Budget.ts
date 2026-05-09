import { Schema, model } from "mongoose";

const budgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },
    limit: { type: Number, required: true }
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export const Budget = model("Budget", budgetSchema);
