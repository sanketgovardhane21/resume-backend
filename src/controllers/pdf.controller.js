import fs from "fs";
import path from "path";
import { generatePdf } from "../services/puppeteer.service.js";

export async function generateResumePdf(req, res) {
  try {
    const data = req.body;

    /* 🔐 Basic validation */
    if (!data.name || !data.email || !data.bio) {
      return res.status(400).json({ error: "Missing required fields" });
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
