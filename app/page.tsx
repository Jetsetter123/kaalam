'use client';

import { useEffect, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

type ChatMessage = { text: string; isUser: boolean; timestamp: number };

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim();

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        alert(`Upload failed: ${data.error}`);
      } else {
        setContext(data.text ?? '');
        setFileName(data.filename ?? file.name);
        setMessages(prev => [...prev, { 
          text: `Document uploaded: ${data.filename ?? file.name}`, 
          isUser: false,
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const trimmed = cleanText(message);
    setMessages(prev => [...prev, { text: trimmed, isUser: true, timestamp: Date.now() }]);
    setInput('');

    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context }),
      });
      
      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { 
          text: `Error: ${data.error}. ${data.details || ''}`, 
          isUser: false,
          timestamp: Date.now()
        }]);
      } else {
        const answer = data.response ?? 'No response received.';
        setMessages(prev => [...prev, { text: answer, isUser: false, timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, { 
        text: 'Connection error. Please try again.', 
        isUser: false,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition error.');
    };

    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl animate-slide-up">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <span className="text-3xl font-bold text-white">K</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Sign in to Kaalaman</h2>
              <p className="mt-2 text-sm text-gray-600">Choose your sign-in method</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="btn-secondary w-full py-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => signIn('github', { callbackUrl: '/' })}
                className="btn-secondary w-full py-3"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside 
        className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          sidebarOpen ? 'w-80' : 'w-0 opacity-0'
        }`}
      >
        {sidebarOpen && (
          <div className="flex h-full flex-col overflow-hidden p-6">
            {/* Logo */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-xl font-bold text-white">K</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Kaalaman</h1>
                    <p className="text-xs text-gray-500">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Section */}
            {session?.user ? (
              <div className="mb-6 card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-gray-900">{session.user.name || 'User'}</p>
                    <p className="truncate text-xs text-gray-500">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="mt-3 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="mb-6 btn-primary w-full"
              >
                Sign In
              </button>
            )}

            {/* Upload Section */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={handleFileUpload}
                disabled={loading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
              
              {fileName && (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                  <p className="text-xs font-semibold text-green-800">Document loaded</p>
                  <p className="mt-1 truncate text-xs text-green-600">{fileName}</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="card flex-1 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">About</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Kaalaman is an AI-powered assistant using Google Gemini. Ask any question or upload documents for context-aware responses.
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-lg font-bold text-white">K</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Kaalaman AI</p>
                <p className="text-xs text-gray-500">Powered by Google Gemini</p>
              </div>
            </div>
          </div>

          {fileName && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700">Document loaded</span>
            </div>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto max-w-4xl px-6 py-8">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-4xl font-bold text-white">K</span>
                </div>
                <h2 className="mb-3 text-3xl font-bold text-gray-900">Welcome to Kaalaman</h2>
                <p className="mb-8 max-w-lg text-lg text-gray-600">
                  Your AI-powered knowledge assistant. Ask me anything or upload documents for context-aware answers.
                </p>
                <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="card p-4 text-left">
                    <div className="mb-2 text-2xl">📄</div>
                    <h3 className="mb-1 font-semibold text-gray-900">Upload</h3>
                    <p className="text-sm text-gray-600">Add documents for context</p>
                  </div>
                  <div className="card p-4 text-left">
                    <div className="mb-2 text-2xl">💬</div>
                    <h3 className="mb-1 font-semibold text-gray-900">Ask</h3>
                    <p className="text-sm text-gray-600">Type or speak your question</p>
                  </div>
                  <div className="card p-4 text-left">
                    <div className="mb-2 text-2xl">🎤</div>
                    <h3 className="mb-1 font-semibold text-gray-900">Voice</h3>
                    <p className="text-sm text-gray-600">Use voice recognition</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`animate-slide-up flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg px-6 py-4 ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          msg.isUser ? 'bg-blue-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {msg.isUser ? 'U' : 'K'}
                        </div>
                        <span className={`text-xs ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap leading-7">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Shift+Enter for new line)"
                disabled={loading}
                rows={1}
                className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-400 outline-none"
                style={{ maxHeight: '150px' }}
              />
              
              <button
                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                className={`rounded-lg px-4 py-2 font-semibold transition ${
                  isListening
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isListening ? 'Stop' : 'Voice'}
              </button>
              
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="btn-primary"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
            
            <p className="mt-2 text-center text-xs text-gray-500">
              Powered by Google Gemini • Press Enter to send
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
