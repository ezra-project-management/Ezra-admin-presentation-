import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: body.system },
        ...body.messages,
      ],
      max_tokens: 1000,
    }),
  })

  const data = await response.json()
  return NextResponse.json({
    content: [{ text: data.choices?.[0]?.message?.content || 'Sorry, try again.' }]
  })
}
