import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

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

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
