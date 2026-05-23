import { Router } from "express";
import { analyzeDailyDev, fetchDailyDevPreview } from "../services/dailydev.js";

export const dailyDevRouter = Router();

dailyDevRouter.post("/preview", async (request, response, next) => {
  try {
    const token = String(request.body?.token ?? "");
    const preview = await fetchDailyDevPreview(token);
    response.json(preview);
  } catch (error) {
    next(error);
  }
});

dailyDevRouter.post("/analyze", async (request, response, next) => {
  try {
    const token = String(request.body?.token ?? "");
    const analysis = await analyzeDailyDev(token);
    response.json(analysis);
  } catch (error) {
    next(error);
  }
});
