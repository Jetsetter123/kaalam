'use client';

import { useEffect, useRef, useState } from 'react';

type StudyMode = 'general' | 'summary' | 'quiz' | 'explain' | 'translate';
type ChatMessage = { text: string; isUser: boolean };
type StoredChatState = {
  messages?: ChatMessage[];
  context?: string;
  fileName?: string;
  selectedMode?: StudyMode;
  liteMode?: boolean;
};

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = ArrayLike<SpeechRecognitionAlternativeLike>;

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const studyModes = [
  { id: 'general', label: 'General' },
  { id: 'summary', label: 'Summarize' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'explain', label: 'Explain' },
  { id: 'translate', label: 'Translate' },
] as const satisfies ReadonlyArray<{ id: StudyMode; label: string }>;

const quickActions = [
  { action: 'summary', label: 'Summarize' },
  { action: 'quiz', label: 'Create Quiz' },
  { action: 'explain', label: 'Explain Concept' },
  { action: 'translate', label: 'Translate to Filipino' },
] as const satisfies ReadonlyArray<{ action: StudyMode; label: string }>;

const modeDescriptions: Record<StudyMode, string> = {
  general: 'Flexible question-and-answer grounded in your uploaded material.',
  summary: 'Condense long notes into a clean briefing with the main ideas.',
  quiz: 'Turn source material into a quick review set for practice.',
  explain: 'Break down difficult concepts into simpler, more teachable language.',
  translate: 'Switch clearly between English and Filipino phrasing.',
};

const isStudyMode = (value: unknown): value is StudyMode =>
  studyModes.some((mode) => mode.id === value);

const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim();

const MAX_CHAT_MESSAGES = 30;
const trimMessages = (messages: ChatMessage[]) => messages.slice(-MAX_CHAT_MESSAGES);

const splitSentences = (text: string) => {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => cleanText(sentence))
    .filter(Boolean);
};

const extractKeywords = (text: string) => {
  const stopWords = new Set([
    'ang', 'ng', 'sa', 'mga', 'at', 'ay', 'na', 'para', 'kung', 'ito', 'ni', 'gamit', 'may', 'buong', 'isa', 'lahat', 'tulad', 'kaysa', 'dapat', 'nito', 'kaniyang', 'kaniya', 'sina', 'siya', 'mula', 'dahil', 'ngunit', 'pero', 'hindi', 'mayroon', 'higit', 'mas', 'hindi', 'handa', 'iyong', 'atin', 'nasaan', 'lamang', 'kanila', 'kanilang', 'kanino',
  ]);

  const words = (text
    .replace(/[^a-zA-Z\s]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean) as string[]).filter(word => word.length > 4 && !stopWords.has(word));

  const frequency = new Map<string, number>();
  words.forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 1));

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

const buildLiteSummary = (text: string) => {
  const sentences = splitSentences(text);
  const top = sentences.slice(0, 4).join(' ');
  const bullets = sentences.slice(0, 5).map((sentence) => `• ${sentence}`);

  return `Lite mode summary:
${top}

Key points:
${bullets.join('\n')}

Note: Para sa mas malalim na paliwanag, i-slide ang Lite Mode off at gumamit ng AI chat.`;
};

const buildLiteQuiz = (text: string) => {
  const keywords = extractKeywords(text);
  const questions = keywords.length
    ? keywords.map((keyword, index) => `Q${index + 1}. Ano ang kahulugan o kahalagahan ng "${keyword}" sa iyong notes?`)
    : [
        'Q1. Ano ang pangunahing paksa na tinalakay sa dokumento?',
        'Q2. Ano ang isang mahalagang ideya na dapat tandaan?',
        'Q3. Paano makakatulong ang impormasyon sa pag-aaral mo?',
      ];

  return `Lite mode quiz:
${questions.join('\n')}

Sagot: Gumawa ng sarili mong sagot batay sa notes at pangunahing paksa. Kung gusto mo ng aktwal na sagot, i-off ang Lite Mode at subukang gamitin ang AI chat.`;
};

const buildLiteExplanation = (text: string, question: string) => {
  const summary = buildLiteSummary(text);
  return `Lite mode explanation:
Batay sa iyong notes, ang mahalagang punto ay nasa core ng materyal. ${question ? `Tungkol sa "${question}", subukan hanapin ang mga bahagi ng text na may mga terminong ito at pag-aralan kung paano ito ginagamit.` : 'I-type ang tiyak na tanong mo para mas mabigyan ng konteksto.'}

${summary}`;
};

const buildLiteTranslate = (question: string) => {
  return `Lite mode translation:
${question}

(Tandaan: Ang translation na ito ay isang simpleng bersyon. Para sa mas tamang salin, gamitin ang AI mode.)`;
};

const createLiteResponse = (mode: StudyMode, contextText: string, question: string) => {
  if (!contextText) {
    return 'Wala pang na-upload na notes. Mag-upload ng PDF, DOCX, o text file upang gumana ang Lite Mode summary, quiz, at explanation.';
  }

  if (mode === 'summary') {
    return buildLiteSummary(contextText);
  }

  if (mode === 'quiz') {
    return buildLiteQuiz(contextText);
  }

  if (mode === 'explain') {
    return buildLiteExplanation(contextText, question);
  }

  if (mode === 'translate') {
    return buildLiteTranslate(question || contextText.slice(0, 200));
  }

  return `Lite mode response:
${buildLiteSummary(contextText)}`;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedMode, setSelectedMode] = useState<StudyMode>('general');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [voiceLang, setVoiceLang] = useState('tl-PH');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('kaalaman_chat');
    if (!saved) return;

    try {
      const data = JSON.parse(saved) as StoredChatState;
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setContext(typeof data.context === 'string' ? data.context : '');
      setFileName(typeof data.fileName === 'string' ? data.fileName : '');
      setSelectedMode(isStudyMode(data.selectedMode) ? data.selectedMode : 'general');
      setLiteMode(Boolean(data.liteMode));
    } catch {
      // ignore invalid storage
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      'kaalaman_chat',
      JSON.stringify({ messages, context, fileName, selectedMode, liteMode }),
    );
  }, [messages, context, fileName, selectedMode, liteMode]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const notify = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(''), 4500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        notify(`Upload failed: ${data.error}`);
      } else {
        setContext(data.text ?? '');
        setFileName(data.filename ?? file.name);
        setMessages(prev => trimMessages([
          ...prev,
          { text: `Uploaded ${data.filename ?? file.name}. Notes are ready for chat.`, isUser: false },
        ]));
        notify('File uploaded successfully. Proceed with a question or use Lite Mode.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      notify('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string, modeOverride?: StudyMode) => {
    if (!message.trim()) return;

    const activeMode = modeOverride ?? selectedMode;
    const trimmed = cleanText(message);
    setMessages(prev => trimMessages([...prev, { text: trimmed, isUser: true }]));
    setInput('');

    if (liteMode) {
      const localResponse = createLiteResponse(activeMode, context, trimmed);
      setMessages(prev => trimMessages([...prev, { text: localResponse, isUser: false }]));
      speak(localResponse);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context, mode: activeMode }),
      });
      const data = await response.json();

      if (data.error) {
        notify(`Chat failed: ${data.error}`);
        if (!data.response) {
          const fallback = createLiteResponse(activeMode, context, trimmed);
          setMessages(prev => trimMessages([...prev, { text: fallback, isUser: false }]));
          speak(fallback);
        }
      } else {
        const answer = data.response ?? 'Walang sagot mula sa AI. Subukan muli.';
        setMessages(prev => trimMessages([...prev, { text: answer, isUser: false }]));
        speak(answer);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      const fallback = createLiteResponse(activeMode, context, trimmed);
      setMessages(prev => trimMessages([...prev, { text: fallback, isUser: false }]));
      notify('AI service unavailable. Lite Mode response generated.');
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (modeId: StudyMode) => {
    setSelectedMode(modeId);
    const quickPrompts: Record<StudyMode, string> = {
      summary: 'Paki-summarize ang na-upload na notes sa paraang madaling maintindihan.',
      quiz: 'Gumawa ng maikling quiz na 3 tanong batay sa na-upload na notes.',
      explain: 'Ipaliwanag ang mahahalagang konsepto sa na-upload na notes sa babae o lalaki na mag-aaral.',
      translate: 'Isalin ang huling mensahe ko sa Filipino nang natural at malinaw.',
      general: 'Tulungan mo ako sa pag-aaral batay sa na-upload na notes.',
    };
    sendMessage(quickPrompts[modeId] || quickPrompts.general, modeId);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      notify('Speech recognition hindi sinusuportahan sa browser na ito.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notify('Speech recognition hindi sinusuportahan sa browser na ito.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = voiceLang;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      if (!transcript) return;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognitionRef.current.onerror = () => {
      setIsListening(false);
      notify('Speech recognition error. Please try again.');
    };

    recognitionRef.current.start();
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const selectedModeLabel = studyModes.find((mode) => mode.id === selectedMode)?.label ?? 'General';
  const voiceLabel = voiceLang === 'tl-PH' ? 'Tagalog' : 'English';
  const serviceLabel = liteMode ? 'Local fallback' : 'AI assistant';
  const sourceLabel = fileName ? 'Source attached' : 'Awaiting upload';
  const workspaceStats = [
    { label: 'Mode', value: selectedModeLabel },
    { label: 'Source', value: sourceLabel },
    { label: 'Voice', value: voiceLabel },
    { label: 'Service', value: serviceLabel },
  ];
  const heroHighlights = [
    {
      title: 'Context-aware responses',
      description: 'Questions, summaries, and quizzes stay tied to the material you upload.',
    },
    {
      title: 'Bilingual by design',
      description: 'Move naturally between English and Tagalog while keeping the same study flow.',
    },
    {
      title: 'Resilient workflow',
      description: 'Lite Mode keeps the workspace useful even when the AI service is unavailable.',
    },
  ];
  const guidanceItems = [
    'Upload notes first so the assistant can answer with the right context.',
    'Use quick actions when you want a structured summary, quiz, or explanation.',
    'Switch voice input to match the language you want to speak naturally.',
    'Turn on Lite Mode when you want a local fallback without relying on the API.',
  ];

  return (
    <div className="page-shell min-h-screen overflow-hidden">
      <div className="ambient-orb animate-float-soft left-[-8rem] top-24 h-64 w-64 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]" />
      <div
        className="ambient-orb animate-float-soft right-[-6rem] top-40 h-72 w-72 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]"
        style={{ animationDelay: '1.8s' }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(3,3,3,0.84)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-12 md:items-center">
            <div className="animate-rise md:col-span-7">
              <div className="eyebrow">Bilingual study intelligence</div>
              <div className="mt-4 flex items-start gap-4">
                <div className="brand-panel flex h-10 w-10 items-center justify-center rounded-xl">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Kaalaman</p>
                  <h1 className="brand-wordmark mt-2 text-3xl leading-none text-white sm:text-[2.85rem]">
                    Kaalaman
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                    A professional workspace for document-driven learning, built to support English and
                    Tagalog study flows with clarity and structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card animate-rise rounded-[1.6rem] p-5 md:col-span-5 md:ml-auto md:w-full md:max-w-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Lite Mode</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                    Choose between the full AI workflow and the local fallback experience.
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={liteMode}
                    onChange={() => setLiteMode(!liteMode)}
                    className="sr-only"
                  />
                  <span className={`toggle-shell ${liteMode ? 'bg-white/85' : 'bg-white/10'}`}>
                    <span className={`toggle-knob ${liteMode ? 'translate-x-[2.1rem]' : 'translate-x-0'}`} />
                  </span>
                </label>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white px-3 py-1.5 text-xs font-medium text-black">
                  {serviceLabel}
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300">
                  {voiceLabel} voice
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="grid items-start gap-6 md:grid-cols-12">
          <div className="brand-panel animate-rise rounded-[2rem] p-7 text-white sm:p-8 md:col-span-7">
            <div className="eyebrow !border-white/10 !bg-white/10 !text-white/72">Designed for focus</div>
            <h2 className="brand-section-title relative mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
              A calmer, more capable place to study with context.
            </h2>
            <p className="relative mt-4 max-w-2xl text-base leading-7 text-zinc-300">
              Kaalaman brings source material, guided prompts, and bilingual conversation into a single
              interface so the product feels trustworthy, purposeful, and easy to use under pressure.
            </p>

            <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {heroHighlights.map(({ title, description }, index) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 whitespace-nowrap">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:col-span-5">
            <div className="surface-card animate-rise delay-100 rounded-[1.75rem] p-5">
              <div className="eyebrow">Workspace status</div>
              <div className="mt-4 grid gap-2">
                {workspaceStats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card animate-rise delay-200 rounded-[1.75rem] p-5">
              <div className="eyebrow">Study modes</div>
              <h3 className="brand-section-title mt-4 text-2xl text-white">Choose a response style</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Keep the same workspace and switch only the kind of help you want from the assistant.
              </p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {studyModes.map((mode) => {
                  const isActive = selectedMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`mode-chip rounded-[1.25rem] p-3 text-left ${isActive ? 'mode-chip-active' : ''}`}
                    >
                      <p className={`text-sm font-semibold ${isActive ? 'text-black' : 'text-white'}`}>
                        {mode.label}
                      </p>
                      <p className={`mt-2 text-sm leading-6 ${isActive ? 'text-black/70' : 'text-zinc-400'}`}>
                        {modeDescriptions[mode.id]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid items-start gap-6 md:grid-cols-12">
          <div className="surface-card surface-card--strong animate-rise rounded-[1.75rem] p-5 sm:p-6 md:col-span-7">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="eyebrow">Source material</div>
                <h3 className="brand-section-title mt-4 text-2xl text-white">Upload notes and build context</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Add PDF, DOCX, text, or Markdown files and Kaalaman will use that material to ground the
                  study experience.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-[1.5rem] border border-dashed border-white/14 bg-white/[0.03] p-5 transition-all duration-200 hover:border-white/24 hover:bg-white/[0.05] hover:shadow-[0_18px_30px_rgba(0,0,0,0.28)]">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-white transition-transform duration-200 group-hover:scale-105">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Select a file to upload</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      Drag and drop is supported by the browser file input as well.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
                  Supported formats: PDF, DOCX, TXT, and MD
                </div>
              </label>

              {fileName && (
                <div className="animate-halo rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Source ready</p>
                  <p className="mt-2 text-sm font-semibold text-white">{fileName}</p>
                </div>
              )}

              {context && (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Preview</p>
                      <p className="mt-1 text-sm text-zinc-400">A short excerpt from the material currently in context.</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-5 text-sm leading-7 text-zinc-300">
                    {context.slice(0, 500)}
                    {context.length > 500 ? '…' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="surface-card animate-rise delay-100 rounded-[1.75rem] p-6 sm:p-8 md:col-span-5">
            <div className="eyebrow">Quick actions</div>
            <h3 className="brand-section-title mt-4 text-2xl text-white">Start with a structured prompt</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Use a predefined action when you want the assistant to move directly into a common study task.
            </p>

            <div className="mt-6 space-y-3">
              {quickActions.map(({ action, label }) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="group flex w-full items-start gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06] hover:shadow-[0_16px_26px_rgba(0,0,0,0.28)]"
                >
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-white">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{modeDescriptions[action]}</p>
                  </div>
                  <svg className="mt-1 h-4 w-4 text-zinc-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card surface-card--strong animate-rise mt-6 rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow">Conversation workspace</div>
              <h3 className="brand-section-title mt-4 text-3xl text-white">Study assistant</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Ask follow-up questions, generate review material, or switch to voice input without leaving
                the page.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                {selectedModeLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                {voiceLabel}
              </span>
              <span className="rounded-full border border-white bg-white px-3 py-1.5 text-xs font-medium text-black">
                {serviceLabel}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-12">
            <div className="space-y-4 md:col-span-8">
              <div className="flex flex-col gap-3 lg:flex-row">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !loading && sendMessage(input)}
                  placeholder="Ask a question in English or Tagalog."
                  className="glass-input flex-1"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  className="brand-button min-w-36"
                  disabled={loading}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {loading ? 'Sending' : 'Send'}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={startListening}
                  className={`soft-button ${isListening ? 'border-red-500/40 bg-red-500/10 text-red-300 shadow-[0_14px_26px_rgba(127,29,29,0.32)]' : ''}`}
                  disabled={loading}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  {isListening ? 'Listening' : 'Start voice input'}
                </button>
                <select
                  aria-label="Voice language"
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value)}
                  className="glass-input"
                >
                  <option value="tl-PH">Tagalog</option>
                  <option value="en-US">English</option>
                </select>
              </div>

              <div className="min-h-[24rem] max-h-[30rem] space-y-4 overflow-y-auto rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                {messages.length === 0 ? (
                  <div className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 text-center">
                    <div className="brand-panel flex h-10 w-10 items-center justify-center rounded-full text-white">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">Your study session starts here</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        Upload notes or choose a quick action to start a grounded conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`max-w-[85%] rounded-[1.35rem] p-4 shadow-[0_16px_26px_rgba(20,37,61,0.08)] sm:max-w-[70%] ${
                          msg.isUser
                            ? 'ml-auto border border-white/15 bg-white text-black shadow-[0_16px_26px_rgba(0,0,0,0.35)]'
                            : 'mr-auto border border-white/10 bg-[#111111] text-zinc-200 shadow-[0_16px_26px_rgba(0,0,0,0.35)]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-7">{msg.text}</p>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 md:col-span-4 md:pl-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Guidance</p>
                <ul className="mt-4 space-y-3">
                  {guidanceItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-zinc-400">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="brand-panel rounded-[1.5rem] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Session briefing</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Active mode</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{selectedModeLabel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Source state</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {fileName ? `${fileName} is ready for grounded responses.` : 'Upload material to give the assistant stronger context.'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Service mode</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {liteMode
                        ? 'Local fallback is active, so responses are generated without the AI service.'
                        : 'The AI workflow is active for richer contextual responses and study support.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {notification && (
          <div className="fixed bottom-6 left-4 right-4 z-50 flex max-w-md items-center gap-3 rounded-[1.25rem] border border-white/10 bg-[rgba(10,10,10,0.92)] px-4 py-3 shadow-[0_18px_30px_rgba(0,0,0,0.42)] backdrop-blur-md sm:bottom-8 sm:left-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm leading-6 text-zinc-200">{notification}</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 bg-[rgba(3,3,3,0.72)]">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
          <span className="brand-wordmark text-lg text-white">Kaalaman</span>
          <span className="mx-2">|</span>
          Bilingual study intelligence for structured, document-aware learning.
        </div>
      </footer>
    </div>
  );
}
