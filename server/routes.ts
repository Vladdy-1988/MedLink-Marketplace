/**
 * routes.ts — thin re-export shim.
 *
 * All actual route logic lives in server/routes/*.ts sub-modules.
 * This file exists so that server/index.ts can keep importing
 * `registerRoutes` without any changes.
 */
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated } from "./auth0";
import { setupAuth0Debug } from "./auth0Debug";
import { getSession } from "./auth0";
import { registerApiRouters } from "./routes/index";
import { ensureAuthUserColumns } from "./schemaMaintenance";

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureAuthUserColumns();

  // Session middleware must be mounted once and before passport middleware.
  app.use(getSession());

  try {
    await setupAuth(app);
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.ENABLE_AUTH_DEBUG === "1"
    ) {
      setupAuth0Debug(app);
    }
    console.log("Auth0 authentication setup completed successfully");
  } catch (error) {
    console.error("Failed to setup Auth0 authentication:", error);
    throw error;
  }

  // Register all domain sub-routers
  registerApiRouters(app);

  const httpServer = createServer(app);
  return httpServer;
}

// Re-export helpers that external code may import from this module
export { isAuthenticated };
