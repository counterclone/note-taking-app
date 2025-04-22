import { NextResponse } from 'next/server'
import OpenAI from "openai";
export const runtime = 'edge'

type RequestBody = {
  text: string
}

type ResponseData = {
  summary: string
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-zero:free',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text concisely. Provide a 1-2 sentence summary of the given text.'
        },
        {
          role: 'user',
          content: `Summarize the following text in 1-2 sentences:\n\n${text}`
        }
      ],
      
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: 'No summary content in response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Internal server error during summarization' },
      { status: 500 }
    );
  }
}