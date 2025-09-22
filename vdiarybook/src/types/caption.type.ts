export interface CaptionSuggestion {
    text: string;
    emoji?: string;
    hashtags?: string[];
}

export interface CaptionPayload {
    prompt: string;
    tone?: "default" | "hai-huoc" | "lang-man" | "deep" | "trendy";
    language?: string;
    numberOfCaptions?: number;
}

export interface CaptionResponse {
    captions: CaptionSuggestion[];
}