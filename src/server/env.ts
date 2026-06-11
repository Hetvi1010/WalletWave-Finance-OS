const isProduction = process.env.NODE_ENV === "production";

export const env = {
  mongoUri: process.env.MONGODB_URI || (isProduction ? "" : "mongodb://127.0.0.1:27017/walletwave"),
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d"
};
