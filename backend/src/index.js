import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "TaskFlow API",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "taskflow-api",
  });
});

app.listen(port, () => {
  console.log(`TaskFlow backend is running on http://localhost:${port}`);
});
