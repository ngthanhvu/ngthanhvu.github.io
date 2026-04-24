import { app } from "./app.js";
import { verifyDatabaseConnection } from "./config/database.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";

const startServer = async (): Promise<void> => {
  await verifyDatabaseConnection();

  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`Backend is running at http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
