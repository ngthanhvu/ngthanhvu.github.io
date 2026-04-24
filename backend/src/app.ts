import cors from "cors";
import express, { Request, Response } from "express";

import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({
    message: "Hello from Express + TypeScript"
  });
});

app.use("/api/auth", authRouter);
