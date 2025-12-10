// backend/content_factory.js
// Abigail Content Factory - generate titles, descriptions, ad scripts, video briefs
// Uses OpenAI via ai.js wrapper (we'll call backend/ai.js generate functions)

import { generateReply } from "./ai.js"; // reuse ai.js for prompt calls

export async function generateProductAssets(product) {
  // product: { title, price, images, benefits }
  const prompt = `You are Abigail, create:
  1) 3 short ad hooks (<= 6 words)
  2) 3 video scripts TikTok (15-30s) with shots
  3) 1 product description (140 chars) and 1 long (300 chars)
  Product: ${JSON.stringify(product)}
  Language: French primarily but adapt if product market is EN.
  Tone: persuasive, slightly playful, clear CTA.`;

  const resp = await generateReply(prompt, "system-content-factory");
  // We expect structured text back; in production we parse into JSON
  return { raw: resp };
}
