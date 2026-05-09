import bcrypt from "bcryptjs";
import { HydratedDocument, Model, Schema, model, models } from "mongoose";

export interface UserType {
  name: string;
  email: string;
  password: string;
  currency: string;
  monthlyBudget: number;
  themePreference: "light" | "dark" | "system";
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<UserType, object, UserMethods>;
export type UserDocument = HydratedDocument<UserType, UserMethods>;

const userSchema = new Schema<UserType, UserModel, UserMethods>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    currency: { type: String, default: "USD" },
    monthlyBudget: { type: Number, default: 3200 },
    themePreference: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system"
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = (models.User as UserModel | undefined) || model<UserType, UserModel>("User", userSchema);
