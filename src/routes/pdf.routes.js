import express from "express";
import { generateResumePdf } from "../controllers/pdf.controller.js";

const router = express.Router();

router.post("/generate", generateResumePdf);

export default router;
