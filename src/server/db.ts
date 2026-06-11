import mongoose from "mongoose";
import { env } from "@/server/env";

declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
  var mongooseUnavailableUntil: number | undefined;
}

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

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

export function isPersistentStorageRequired() {
  return process.env.NODE_ENV === "production";
}

export function isDatabaseConfigured() {
  return Boolean(env.mongoUri);
}

export async function isDatabaseAvailable() {
  if (!isDatabaseConfigured()) {
    return false;
  }

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
