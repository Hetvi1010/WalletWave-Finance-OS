import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseAvailable } from "@/server/db";
import { signToken } from "@/server/auth";
import { findLocalUserByEmail, isLocalUser, verifyLocalUserPassword } from "@/server/local-store";
import { User } from "@/server/models/User";
import { serializeUser } from "@/server/serializers";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = loginSchema.parse(body);

    const email = values.email.toLowerCase();
    const useDatabase = await isDatabaseAvailable();
    const user = useDatabase ? await User.findOne({ email }) : await findLocalUserByEmail(email);
    let validPassword = false;

    if (user) {
      validPassword = isLocalUser(user)
        ? await verifyLocalUserPassword(user, values.password)
        : await user.comparePassword(values.password);
    }

    if (!user || !validPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      token: signToken(typeof user._id === "string" ? user._id : user._id.toString()),
      user: serializeUser(user)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to log in" }, { status: 500 });
  }
}
