import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import aiRoutes from "./routes/ai.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

/* 🔒 Security middlewares */
app.use(helmet());

app.use(
  cors({
    origin: env.frontendUrl,
    methods: ["GET", "POST"],
  })
);

/* 🛑 Rate limiting */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
});
app.use(limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 AI calls per minute per IP
});

app.use("/api/ai", aiLimiter);

const pdfLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
});

app.use("/api/pdf", pdfLimiter, pdfRoutes);

app.use("/api/payment", paymentRoutes);

/* 📦 Body parser */
app.use(express.json({ limit: "1mb" }));

/* ✅ Health check */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Resume Builder Backend is running",
  });
});

app.use("/api/ai", aiRoutes);

export default app;
