import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: body.system,
      messages: body.messages,
    }),
  })

  const data = await response.json()
  console.log('Anthropic status:', response.status, JSON.stringify(data))
  
  return NextResponse.json({
    content: [{ text: data.content?.[0]?.text || 'Sorry, try again.' }]
  })
}
