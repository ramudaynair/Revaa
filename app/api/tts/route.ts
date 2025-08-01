import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json()
    
    const langMap: {[key: string]: string} = {
      'ml': 'ml',
      'hi': 'hi', 
      'ta': 'ta',
      'te': 'te',
      'en': 'en'
    }
    
    const ttsLang = langMap[language] || 'en'
    
    const response = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${ttsLang}&client=tw-ob`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.ok) {
      const audioBuffer = await response.arrayBuffer()
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg'
        }
      })
    }
    
    throw new Error('TTS failed')
  } catch (error) {
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}