import { NextResponse } from 'next/server'

export const runtime = 'edge'

type RequestBody = {
  text: string
}

type ResponseData = {
  summary: string
}

export async function POST(request: Request) {
  const { text } = (await request.json()) as RequestBody

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json(
      { error: 'Valid text is required for summarization' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        temperature: 0.7,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('DeepSeek API error:', error)
      return NextResponse.json(
        { error: 'Failed to get summary from API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content?.trim()

    if (!summary) {
      return NextResponse.json(
        { error: 'No summary content in response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ summary } as ResponseData)
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Internal server error during summarization' },
      { status: 500 }
    )
  }
}