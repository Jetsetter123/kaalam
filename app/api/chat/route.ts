import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const MAX_MESSAGE_LENGTH = 2_000;

const clipText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    const trimmedMessage = clipText(message, MAX_MESSAGE_LENGTH);

    if (!trimmedMessage) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'Gemini API key not configured',
        details: 'Please add GEMINI_API_KEY to your environment variables'
      }, { status: 500 });
    }

    // Use Gemini API - Using Gemini 2.5 Flash (recommended for speed and cost)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the prompt with context if available
    let fullPrompt = trimmedMessage;
    if (context && typeof context === 'string' && context.trim()) {
      fullPrompt = `Context from uploaded document:\n${context.slice(0, 8000)}\n\nUser question: ${trimmedMessage}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text || 'I apologize, but I could not generate a response. Please try again.' });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    let errorMessage = 'Failed to generate response';
    let errorDetails = error?.message || 'Unknown error';

    if (errorDetails.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key';
      errorDetails = 'The Gemini API key is invalid. Please check your configuration.';
    } else if (errorDetails.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'Rate limit exceeded';
      errorDetails = 'You have exceeded the rate limit. Please wait a moment and try again.';
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
}
