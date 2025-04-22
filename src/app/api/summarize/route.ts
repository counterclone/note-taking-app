import { NextResponse } from 'next/server'

export const runtime = 'edge' // Recommended for AI APIs

export async function POST(request: Request) {
  const { text } = await request.json()

  if (!text || typeof text !== 'string') {
    return NextResponse.json(
      { error: 'Text is required and must be a string' },
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
            content: 'You are a helpful assistant that summarizes text. Provide a concise summary of the given text in 1-2 sentences.'
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DeepSeek API error:', errorData)
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('No summary content in response')
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    )
  }
}
