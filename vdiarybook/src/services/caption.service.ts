import { CaptionPayload, CaptionResponse } from "@/types/caption.type";

export const generateCaptions = async (
    payload: CaptionPayload
): Promise<CaptionResponse> => {
    const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    const flatCaptions = Array.isArray(data.captions)
      ? data.captions.flat()
      : [];

    return {
        captions: flatCaptions
    }
}