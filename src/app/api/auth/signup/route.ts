import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseAvailable } from "@/server/db";
import { signToken } from "@/server/auth";
import { createLocalUser, findLocalUserByEmail } from "@/server/local-store";
import { User } from "@/server/models/User";
import { serializeUser } from "@/server/serializers";

export const runtime = "nodejs";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = signupSchema.parse(body);

    const email = values.email.toLowerCase();
    const useDatabase = await isDatabaseAvailable();
    const exists = useDatabase ? await User.findOne({ email }) : await findLocalUserByEmail(email);
    if (exists) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const user = useDatabase
      ? await User.create({ ...values, email })
      : await createLocalUser({ ...values, email });
    const token = signToken(typeof user._id === "string" ? user._id : user._id.toString());

    return NextResponse.json(
      {
        token,
        user: serializeUser(user)
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || "Invalid request" }, { status: 400 });
    }

    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to sign up" }, { status: 500 });
  }
}
