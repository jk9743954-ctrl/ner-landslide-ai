import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { queryAIAssistant, ChatMessage } from '../../services/aiAssistantService';

export const AIAssistant: React.FC = () => {
  const {
    activeZone,
    simulatedRainfall,
    dynamicRiskScore,
    dynamicRiskLevel,
    navigateTo,
  } = useSimulation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text:
        `Hello! I am the **NER Landslide AI Assistant**.\n\n` +
        `I analyze geomechanical stability, simulated precipitation, and displacement sensor telemetry across the North Eastern Region of India.\n\n` +
        `Currently monitoring: **${activeZone.name}** (${dynamicRiskLevel} Risk • Score ${dynamicRiskScore}/100).\n\n` +
        `How can I assist your disaster preparedness today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why is my area at high risk?',
    'Which areas are currently critical?',
    'What factors are increasing the risk?',
    'What should I do during a high-risk warning?',
    'Show me the most dangerous monitoring zones.',
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI inference latency
    setTimeout(() => {
      const reply = queryAIAssistant(
        query,
        activeZone,
        simulatedRainfall,
        dynamicRiskScore,
        dynamicRiskLevel
      );

      const aiMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 bg-[#0B132B] text-slate-100 flex flex-col">
      <div className="mx-auto w-full max-w-4xl px-3 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => navigateTo('/')}>
                Home
              </span>
              <span>/</span>
              <span className="text-slate-400">AI Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>🤖</span> NER AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Ask about current landslide risk, geotechnical factors, and emergency guidance.
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-700/50 text-[11px] font-mono text-indigo-300">
              Active Context: {activeZone.name.split(' (')[0]}
            </span>
          </div>
        </div>

        {/* Prototype Disclaimer Alert */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 mb-3 text-xs text-slate-400 flex items-center gap-2">
          <span className="text-amber-400">ℹ️</span>
          <span>
            <strong>Prototype Data Notice:</strong> AI responses are synthesized exclusively from
            simulated telemetry and GSI risk models stored within the prototype.
          </span>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 min-h-[380px] max-h-[58vh]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-8 w-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-sm shrink-0">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <span className="block mt-2 text-[10px] text-right opacity-60 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="h-8 w-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-sm shrink-0">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce delay-100" />
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce delay-200" />
              <span className="font-mono text-[11px]">Analyzing sensor telemetry...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask NER AI about ${activeZone.name.split(' (')[0]}...`}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
