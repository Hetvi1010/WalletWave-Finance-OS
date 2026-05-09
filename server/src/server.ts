import { app } from "./app";
// import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function start() {
  // await connectDatabase();
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});
