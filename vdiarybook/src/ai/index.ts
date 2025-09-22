import "dotenv/config"; 
import { wrapLanguageModel } from "ai";
import { google } from "@ai-sdk/google";

export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-1.5-flash-002"),
  middleware: []
});

