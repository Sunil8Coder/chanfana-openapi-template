import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

import { authRouter } from "./endpoints/auth/router";
import { profileRouter } from "./endpoints/profile/router";
import { resumeRouter } from "./endpoints/resume/router";
import { healthEndpoint } from "./endpoints/health";

// Start Hono app
const app = new Hono<{ Bindings: Env }>();

/**
 * Global Error Handler
 */
app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode,
    );
  }

  console.error("Global error handler caught:", err);

  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: "Internal Server Error" }],
    },
    500,
  );
});

/**
 * OpenAPI / Swagger setup
 */
const openapi = fromHono(app, {
  docs_url: "/", // Swagger UI at root
  schema: {
    info: {
      title: "Resume4J API",
      version: "1.0.0",
      description:
        "Backend API for Resume4J — Free lifetime resume builder with authentication, profiles, and resume management.",
    },
    servers: [
      {
        url: "https://resume4j-api.scriptimiz.com",
        description: "Production",
      },
    ],
  },
});

/**
 * Routes
 */
openapi.route("/auth", authRouter);       // login / register
openapi.route("/profile", profileRouter); // user profile
openapi.route("/resumes", resumeRouter);  // resume CRUD

/**
 * Health check / ping
 */
openapi.get("/health", healthEndpoint);

/**
 * Export app
 */
export default app;
