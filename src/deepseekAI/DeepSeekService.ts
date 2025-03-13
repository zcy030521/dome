import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1", // DeepSeek API 地址
  apiKey: import.meta.env.VITE_API_KEY, // 使用环境变量存储 API Key
  dangerouslyAllowBrowser: true
});

export const getChatResponse = async (prompt: string, callback: (chunk: string) => void): Promise<void> => {
  try {
    const stream = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "deepseek-chat",
      stream: true,
    });

    // 使用 for await...of 直接处理流
    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content;
      if (content) {
        callback(content);
      }
    }
  } catch (error) {
    console.error("Error in getChatResponse:", error);
    throw error;
  }
};
