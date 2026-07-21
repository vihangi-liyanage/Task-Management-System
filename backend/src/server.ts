import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { bootstrapDatabase } from "./db/bootstrap.js";

async function main() {
  await bootstrapDatabase();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
