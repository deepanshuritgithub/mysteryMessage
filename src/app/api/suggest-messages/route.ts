import { OpenAI } from "openai";
import { NextResponse } from "next/server";

//USE CASE

//1. User will click on suggest-message
//2. we will go to open ai with some prompts
//3. we will show the response on frontend

const openai = new OpenAI({     
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

                const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 400,
                stream: true,
                });

                const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of response) {
                    const { choices } = chunk;
                    if (choices && choices.length > 0) {
                        const text = choices[0].delta?.content || "";
                        controller.enqueue(text);
                    }
                    }
                    controller.close();
                },
                });

                return new Response(stream, {
                    headers: { "Content-Type": "text/plain" },
                });


    } catch (error) {

            if (error instanceof OpenAI.APIError) {

                // OpenAI API error handling
                const { name, status, headers, message } = error;
                //ho sakta hai api keys sahi se na phuchi ho ,to apko headers error dekhne padenge , ho sakta hai apke pass status shi se na phucha ho , kai baar open ai krte time dekha hoga vo response hi nahi deta hai , uss case mai apko msgs mil jate hai , to vo app kai baar handle kr sakte ho, better trike se, agr krne ka maan hai to  
                return NextResponse.json(
                    { 
                    name, 
                    status,
                    headers, 
                    message 
                    },
                    { status });

            } else {

                console.error("An unexpected error occurred:", error);
                throw error;
            }

        }
    }