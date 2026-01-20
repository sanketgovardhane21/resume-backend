import { improveBio } from "../services/openai.service.js";

export async function generateBio(req, res) {
  try {
    const { bio } = req.body;

    /* 🔐 Validation */
    if (!bio || typeof bio !== "string") {
      return res.status(400).json({ error: "Bio is required" });
    }

    if (bio.length > 500) {
      return res.status(400).json({ error: "Bio too long (max 500 chars)" });
    }

    const improvedBio = await improveBio(bio);

    res.json({
      success: true,
      bio: improvedBio,
    });
  } catch (error) {
    console.error("AI Bio Error:", error.message);
    res.status(500).json({ error: "Failed to generate bio" });
  }
}
