import fs from "fs";
import path from "path";
import { generatePdf } from "../services/puppeteer.service.js";

export async function generateResumePdf(req, res) {
  try {
        const {
      personal,
      bio,
      skills,
      experience = [],
      education = [],
      certifications = [],
    } = req.body;

    /* 🔐 Strict validation */
    if (
      !personal ||
      !personal.name ||
      !personal.email ||
      typeof bio !== "string" ||
      !Array.isArray(skills)
    ) {
      return res.status(400).json({ error: "Invalid resume data" });
    }

    if (bio.length > 500) {
      return res.status(400).json({ error: "Bio too long (max 500 chars)" });
    }

    if (skills.length > 20) {
      return res.status(400).json({ error: "Too many skills (max 20)" });
    }

    if (experience.length > 3) {
      return res.status(400).json({ error: "Too many experience entries" });
    }

    if (education.length > 2) {
      return res.status(400).json({ error: "Too many education entries" });
    }

    if (certifications.length > 3) {
      return res.status(400).json({ error: "Too many certifications" });
    }


    const templatePath = path.resolve("src/templates/resume.html");
    let html = fs.readFileSync(templatePath, "utf8");

    html = html
      .replace("{{name}}", data.name)
      .replace("{{email}}", data.email)
      .replace("{{phone}}", data.phone || "")
      .replace("{{location}}", data.location || "")
      .replace("{{bio}}", data.bio)
      .replace("{{skills}}", (data.skills || []).join(", "));

    /* Optional sections */
    html = html.replace("{{experience}}", "");
    html = html.replace("{{education}}", "");
    html = html.replace("{{certifications}}", "");

    const pdf = await generatePdf(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    res.send(pdf);
  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
