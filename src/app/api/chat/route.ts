import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, smoothStream, streamText } from "ai";

export const maxDuration = 30;
const google = createGoogleGenerativeAI({
    apiKey: "AIzaSyBs7toqNsN1kdjjrWYdH0j5y4XQtH51ueY"
});
export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const modelMessages = convertToModelMessages(messages);
        const result = streamText({
            // Add your desired model here
            model: google("gemini-2.5-flash"),
            messages: modelMessages,
            maxRetries: 3,
            experimental_transform: smoothStream({
                chunking: "word",
            }),
        });
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Unhandled error in chat API:", error);
        throw error;
    }
}