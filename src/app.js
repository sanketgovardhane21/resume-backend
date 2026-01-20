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

/* 📦 Body parser */
app.use(express.json({ limit: "1mb" }));

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

const pdfLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2,             // max 2 PDF requests per IP per minute
  message: {
    error: "Too many PDF requests. Please wait a minute and try again.",
  },
});

app.use("/api/pdf", pdfLimiter, pdfRoutes);

app.use("/api/payment", paymentRoutes);

/* ✅ Health check */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Resume Builder Backend is running",
  });
});

app.use("/api/ai", aiLimiter ,aiRoutes);

export default app;
