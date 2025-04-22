import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { text } = await request.json()

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
            content: 'You are a helpful assistant that summarizes text. Provide a concise summary of the given text.'
          },
          {
            role: 'user',
            content: `Summarize the following text:\n\n${text}`
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}