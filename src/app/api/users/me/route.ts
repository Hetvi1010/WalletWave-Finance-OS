import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { isLocalUser, updateLocalUser } from "@/server/local-store";
import { serializeUser } from "@/server/serializers";

export const runtime = "nodejs";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  currency: z.string().min(1).max(10).optional(),
  monthlyBudget: z.number().positive().optional(),
  themePreference: z.enum(["light", "dark", "system"]).optional()
});

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(serializeUser(user));
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const values = updateProfileSchema.parse(body);

    if (values.name !== undefined) user.name = values.name;
    if (values.currency !== undefined) user.currency = values.currency;
    if (values.monthlyBudget !== undefined) user.monthlyBudget = values.monthlyBudget;
    if (values.themePreference !== undefined) user.themePreference = values.themePreference;

    if (isLocalUser(user)) {
      await updateLocalUser(user._id, values);
    } else {
      await user.save();
    }

    return NextResponse.json(serializeUser(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
