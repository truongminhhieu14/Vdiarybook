import { generateSocialMediaCaptions } from "@/ai/action";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { prompt, tone, language, numberOfCaptions } = await req.json();

    const { captions } = await generateSocialMediaCaptions({
      prompt,
      tone,
      language,
      numberOfCaptions,
    });

    return NextResponse.json({ success: true, captions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } 
}
