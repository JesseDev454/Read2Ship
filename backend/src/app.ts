import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { isAppError } from "./lib/errors.js";
import { dailyDevRouter } from "./routes/dailydev.js";
import { healthRouter } from "./routes/health.js";
import { plansRouter } from "./routes/plans.js";

export function createApp() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

  app.use(
    cors({
      origin: frontendOrigin.split(",").map((origin) => origin.trim()),
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/dailydev", dailyDevRouter);
  app.use("/api/plans", plansRouter);

  app.use((_request, response) => {
    response.status(404).json({ code: "NOT_FOUND", message: "Route not found." });
  });

  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (isAppError(error)) {
      response.status(error.status).json({ code: error.code, message: error.message });
      return;
    }

    console.error(error);
    response.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "Read2Ship hit an unexpected server error.",
    });
  };

  app.use(errorHandler);

  return app;
}
