import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { z } from "zod";
import { env } from "@/server/env";
import { isDatabaseAvailable, isPersistentStorageRequired } from "@/server/db";
import { findLocalUserById } from "@/server/local-store";
import { User } from "@/server/models/User";

const authHeaderSchema = z.string().startsWith("Bearer ");

export function signToken(userId: string) {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
}

export async function requireUser() {
  const requestHeaders = await headers();
  const authorization = requestHeaders.get("authorization");

  const parsedHeader = authHeaderSchema.safeParse(authorization);
  if (!parsedHeader.success) {
    return null;
  }

  try {
    const token = parsedHeader.data.replace("Bearer ", "");
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    if (await isDatabaseAvailable()) {
      return User.findById(payload.userId);
    }

    if (isPersistentStorageRequired()) {
      return null;
    }

    return findLocalUserById(payload.userId);
  } catch {
    return null;
  }
}
