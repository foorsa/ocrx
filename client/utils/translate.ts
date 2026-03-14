import OpenAI from "openai";

const getClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not configured. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment.");
    }
    return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
};

export async function translateText(
    text: string,
    from: string = "French",
    to: string = "English"
): Promise<string> {
    const client = getClient();

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a professional translator. Translate the following text from ${from} to ${to}. Return ONLY the translated text, nothing else. Preserve any formatting, numbers, dates, and proper nouns as appropriate.`,
            },
            {
                role: "user",
                content: text,
            },
        ],
        temperature: 0.1,
        max_tokens: 1024,
    });

    const translated = response.choices[0]?.message?.content?.trim();
    if (!translated) {
        throw new Error("No translation returned from OpenAI.");
    }
    return translated;
}
