import { NextResponse } from 'next/server'

export const runtime = 'edge'
import axios from 'axios';
type RequestBody = {
  text: string
}

type ResponseData = {
  summary: string
}



export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    const prompt = `Summarize the following text in 1-2 sentences:\n\n${text}`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GOOGLE_API_KEY || '',
        },
      }
    );

    const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: 'No summary content in response' },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Summarization error:', error?.response?.data || error.message);
    return NextResponse.json(
      { error: 'Internal server error during summarization' },
      { status: 500 }
    );
  }
}