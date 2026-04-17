'use client';

import { useEffect, useRef, useState } from 'react';

type StudyMode = 'general' | 'summary' | 'quiz' | 'explain' | 'translate';
type ChatMessage = { text: string; isUser: boolean };

const studyModes = [
  { id: 'general', label: 'General', icon: '💬' },
  { id: 'summary', label: 'Summarize', icon: '📝' },
  { id: 'quiz', label: 'Quiz', icon: '❓' },
  { id: 'explain', label: 'Explain', icon: '🔍' },
  { id: 'translate', label: 'Translate', icon: '🌐' },
] as const;

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim();

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedMode, setSelectedMode] = useState<StudyMode>('general');
  const [loading, setLoading] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        setMessages(prev => [...prev, { text: `Uploaded ${data.filename ?? file.name}`, isUser: false }]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const trimmed = cleanText(message);
    setMessages(prev => [...prev, { text: trimmed, isUser: true }]);
    setInput('');

    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context, mode: selectedMode }),
      });
      const data = await response.json();

      const answer = data.response ?? 'No response';
      setMessages(prev => [...prev, { text: answer, isUser: false }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, { text: 'Error: Could not get response', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="gradient-bg absolute inset-0"></div>
        <div className="data-stream" style={{ left: '10%' }}></div>
        <div className="data-stream" style={{ left: '30%' }}></div>
        <div className="data-stream" style={{ left: '50%' }}></div>
        <div className="data-stream" style={{ left: '70%' }}></div>
        <div className="data-stream" style={{ left: '90%' }}></div>
      </div>

      {/* Sidebar */}
      <aside className={`flex h-full flex-col border-r border-cyan-500/10 bg-black/40 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'}`}>
        {sidebarOpen && (
          <div className="flex h-full flex-col p-4">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-gradient text-2xl font-black">KAALAMAN</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  ✕
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-cyan-400/60">AI STUDY COMPANION</p>
            </div>

            {/* Upload Section */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary w-full"
                disabled={loading}
              >
                📤 UPLOAD NOTES
              </button>
              {fileName && (
                <p className="mt-2 truncate font-mono text-xs text-green-400">✓ {fileName}</p>
              )}
            </div>

            {/* Study Modes */}
            <div className="mb-6">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">STUDY MODES</p>
              <div className="space-y-2">
                {studyModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full rounded-lg px-4 py-3 text-left font-bold uppercase tracking-wide transition-all ${
                      selectedMode === mode.id
                        ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                        : 'border border-cyan-500/20 bg-cyan-500/5 text-cyan-400/70 hover:bg-cyan-500/10'
                    }`}
                  >
                    {mode.icon} {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lite Mode Toggle */}
            <div className="card-glass mt-auto rounded-xl p-4">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="font-mono text-sm font-bold text-cyan-300">LITE MODE</span>
                <input
                  type="checkbox"
                  checked={liteMode}
                  onChange={() => setLiteMode(!liteMode)}
                  className="h-5 w-5 rounded border-cyan-500/30 bg-cyan-500/10 text-cyan-500"
                />
              </label>
            </div>
          </div>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-cyan-500/10 bg-black/40 px-8 py-4 backdrop-blur-xl">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ☰
            </button>
          )}
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-cyan-400">MODE: {selectedMode.toUpperCase()}</span>
            <span className="font-mono text-sm text-cyan-400/60">|</span>
            <span className="font-mono text-sm text-cyan-400">{liteMode ? 'LITE' : 'AI'}</span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-6 py-20 text-center">
                <div className="holographic rounded-full p-8 text-6xl">📚</div>
                <h2 className="text-gradient text-4xl font-black">WELCOME TO KAALAMAN</h2>
                <p className="max-w-2xl font-mono text-lg text-cyan-300/70">
                  Upload your study materials and start asking questions in English or Tagalog
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`animate-slide-up flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-6 py-4 ${
                      msg.isUser
                        ? 'border border-cyan-500/30 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 text-cyan-100'
                        : 'border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-mono text-sm leading-7">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-cyan-500/10 bg-black/40 px-8 py-6 backdrop-blur-xl">
          <div className="mx-auto max-w-4xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage(input)}
                placeholder="Ask anything in English or Tagalog..."
                className="input-modern flex-1 text-lg"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                className="btn-primary px-8"
                disabled={loading}
              >
                {loading ? '⏳' : '✈️'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
