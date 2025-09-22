import { generateObject } from "ai";
import { z } from "zod";

import { geminiFlashModel } from ".";

export async function generateSocialMediaCaptions({
  prompt,
  tone = "default",
  language = "vi",
  numberOfCaptions = 3,
}: {
  prompt: string;
  tone?: "default" | "ha-huoc" | "lang-man" | "deep" | "trendy";
  language?: string;
  numberOfCaptions?: number;
}) {
  const { object: captions } = await generateObject({
    model: geminiFlashModel,
    prompt: `Bạn là AI chuyên viết caption mạng xã hội.
        Viết ${numberOfCaptions} caption ngắn gọn, ấn tượng dựa trên nội dung: "${prompt}".
        Tone: ${tone}
        Ngôn ngữ: ${language}.
        Mỗi caption ngắn gọn, có thể có emoji phù hợp. Trả về ${numberOfCaptions} caption dưới dạng mảng.`,
    output: "array",
    schema: z.array(
      z.object({
        text: z.string().describe("Caption text, ngắn gọn và ấn tượng"),
        emoji: z
          .string()
          .optional()
          .describe("Emoji phù hợp với caption, nếu có"), 
        hashtags: z
          .array(z.string())
          .optional()
          .describe("Danh sách hashtag liên quan, nếu có"),
      })
    ),
  });

  return { captions };
}
