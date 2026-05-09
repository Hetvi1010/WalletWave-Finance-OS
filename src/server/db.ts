import mongoose from "mongoose";
import { env } from "@/server/env";

declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
  var mongooseUnavailableUntil: number | undefined;
}

export async function connectDatabase() {
  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = mongoose
      .connect(env.mongoUri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 750
      })
      .catch((error) => {
        global.mongooseConnectionPromise = undefined;
        global.mongooseUnavailableUntil = Date.now() + 15_000;
        throw error;
      });
  }

  return global.mongooseConnectionPromise;
}

export async function isDatabaseAvailable() {
  if (global.mongooseUnavailableUntil && Date.now() < global.mongooseUnavailableUntil) {
    return false;
  }

  try {
    await connectDatabase();
    global.mongooseUnavailableUntil = undefined;
    return true;
  } catch {
    return false;
  }
}
