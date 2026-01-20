import express from "express";
import { generateBio } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/bio", generateBio);

export default router;
