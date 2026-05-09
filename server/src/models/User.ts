import bcrypt from "bcryptjs";
import { HydratedDocument, Model, Schema, model } from "mongoose";

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

interface UserType {
  name: string;
  email: string;
  password: string;
  currency: string;
  monthlyBudget: number;
  themePreference: "light" | "dark" | "system";
}

type UserModel = Model<UserType, object, UserMethods>;
export type UserDocument = HydratedDocument<UserType, UserMethods>;

const userSchema = new Schema<UserType, UserModel, UserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currency: { type: String, default: "USD" },
    monthlyBudget: { type: Number, default: 3200 },
    themePreference: { type: String, enum: ["light", "dark", "system"], default: "system" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<UserType, UserModel>("User", userSchema);
