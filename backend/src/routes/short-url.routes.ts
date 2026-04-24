import { Router } from "express";

import { shortUrlController } from "../controllers/short-url.controller.js";

export const shortUrlRouter = Router();

shortUrlRouter.get("/", shortUrlController.list);
shortUrlRouter.post("/", shortUrlController.create);
