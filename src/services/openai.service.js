import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function improveBio(bioText) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Improve the bio to be concise, professional, and ATS-friendly. Keep it under 4 lines.",
      },
      {
        role: "user",
        content: bioText,
      },
    ],
    max_tokens: 120,
    temperature: 0.5,
  });

  return response.choices[0].message.content.trim();
}
