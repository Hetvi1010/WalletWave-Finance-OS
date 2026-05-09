import { InferSchemaType, Schema, model, models } from "mongoose";

const budgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true },
    limit: { type: Number, required: true }
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

export type BudgetDocument = InferSchemaType<typeof budgetSchema> & {
  _id: { toString(): string };
};

export const Budget = models.Budget || model("Budget", budgetSchema);
