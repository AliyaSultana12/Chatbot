/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, CornerDownLeft, Sparkles, Volume2, 
  VolumeX, Mic, MicOff, AlertCircle, RefreshCw, Layers,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import { ChatMessage, MapCoordinates } from '../types';

interface ChatbotPanelProps {
  studentId: string | null;
  onReceiveCoordinates: (coords: MapCoordinates | undefined) => void;
  onLoginRequest: () => void;
  onApplicationShorthand: (data: any) => void;
  externalPromptText?: string;
  college?: 'ZIT' | 'SVYASA';
}

export default function ChatbotPanel({
  studentId,
  onReceiveCoordinates,
  onLoginRequest,
  onApplicationShorthand,
  externalPromptText,
  college = 'ZIT'
}: ChatbotPanelProps) {
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Sync welcome messages when college shifts
  useEffect(() => {
    if (college === 'SVYASA') {
      setMessages([
        {
          id: 'welcome-svyasa',
          sender: 'bot',
          text: "Pranam! Welcome to Swami Vivekananda Yoga Anusandhana Samsthana (S-VYASA) University! 🧘‍♂️🌸\n\nI am **Saraswati**, your holistic academic advisor in Gurukula. I can guide you through our Naturopathy (BNYS), Yoga Therapy (M.Sc), and Yoga Science (B.Sc) programs, our renowned Arogyadhama Holistic Hospital, scholarship guidelines, and finding places in Prashanti Kutiram!\n\nHow can I support your journey of spiritual and scientific wellness today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            studentId ? "My Yoga Therapy Grades" : "View Yoga & Wellness Programs",
            "Explain Vivekananda Scholarship Eligibility",
            "Where is Arogyadhama Hospital?",
            "What is a Sattvic Ayurvedic Diet?"
          ]
        }
      ]);
    } else {
      setMessages([
        {
          id: 'welcome-zit',
          sender: 'bot',
          text: "Hello and welcome to Zenith Institute of Technology! 🎓\n\nI am **Zenia**, your smart campus chatbot and admissions assistant. I can help you with engineering programs, fee payment settlements, hostel allocations, scholarships, and campus landmark locations!\n\nHow can I guide your higher learning goals today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            studentId ? "Check my academic charts" : "View computing programs Offered",
            "Explain ZIT 100% Scholarship Rules",
            "Where is the Innovation Lab?",
            studentId ? "Settle outstanding fee" : "Take Virtual Campus Tour"
          ]
        }
      ]);
    }
  }, [college, studentId]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync external prompt when clicking on map pins
  useEffect(() => {
    if (externalPromptText) {
      setInputVal(`Tell me about ${externalPromptText}`);
      // Find the input element and focus it
      const inputEl = document.getElementById("chat-input-field");
      if (inputEl) inputEl.focus();
    }
  }, [externalPromptText]);

  // Scroll to bottom helper
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputVal(transcript);
        }
      };
      setRecognition(rec);
    }
  }, []);

  const handleMicToggle = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in your current browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Clean up markdown formatting so speech reads cleanly
      const cleanString = text
        .replace(/\*\*|__/g, '')
        .replace(/\* /g, '')
        .replace(/#+ /g, '')
        .replace(/`[^`]+`/g, 'codes');
      
      const utterance = new SpeechSynthesisUtterance(cleanString);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed or is blocked by iframe security configurations.", e);
    }
  };

  // Chat message submit logic
  const handleSendMessage = async (customText?: string) => {
    const queryText = (customText || inputVal).trim();
    if (!queryText) return;

    // Reset input
    if (!customText) setInputVal('');

    const userMessage: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const payload: any = {
        message: queryText,
        chatHistory: messages.slice(-10), // Send last 10 messages for conversation context
        studentId: studentId,
        college: college
      };

      // If user asks for eligibility recommendations, guide custom payload
      if (queryText.toLowerCase().includes("apply") || queryText.toLowerCase().includes("eligible")) {
        payload.isAdmissionMode = true;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with the ZIT servers.");
      }

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || [],
        interactiveMap: data.interactiveMap
      };

      setMessages(prev => [...prev, botMessage]);

      // If coordinate pinpoint attached, notify parent map context
      if (data.interactiveMap) {
        onReceiveCoordinates(data.interactiveMap);
      }

      // Read text if speech enabled
      if (speechEnabled) {
        speakText(data.reply);
      }

    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: "err-" + Date.now(),
        sender: 'bot',
        text: "⚠️ **System Communication Error**: Connection to the administrative servers was delayed. Please ensure Server-Side APIs and the dev server are started properly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Retry connection", "Help guidelines"],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleRateMessage = async (messageId: string, rating: 'up' | 'down') => {
    // Find the message text for recording on the backend
    const targetMsg = messages.find(m => m.id === messageId);
    if (!targetMsg) return;

    // Toggle logic: if user clicks the active one again, clear it.
    const finalRating = targetMsg.rating === rating ? undefined : rating;

    // Optimistically update the message locally
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, rating: finalRating };
      }
      return m;
    }));

    if (finalRating) {
      try {
        await fetch("/api/chat/rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId,
            text: targetMsg.text,
            rating: finalRating,
            studentId
          })
        });
      } catch (err) {
        console.warn("Failed to update message feedback to the system tracker.", err);
      }
    }
  };

  const isSvyasa = college === 'SVYASA';
  const botName = isSvyasa ? "Saraswati Assistant" : "Zenia Assistant";
  
  const primaryBg = isSvyasa ? 'bg-orange-600' : 'bg-blue-600';
  const primaryBgHover = isSvyasa ? 'hover:bg-orange-700' : 'hover:bg-blue-700';
  const primaryText = isSvyasa ? 'text-orange-600' : 'text-blue-600';
  const lightBg = isSvyasa ? 'bg-orange-50' : 'bg-blue-50';
  const lightBorder = isSvyasa ? 'border-orange-100' : 'border-blue-100';
  const focusRing = isSvyasa ? 'focus:ring-orange-500' : 'focus:ring-blue-505';
  const hoverOutline = isSvyasa ? 'hover:text-orange-600 hover:border-orange-500/30 hover:bg-orange-50/40' : 'hover:text-blue-600 hover:border-blue-500/30 hover:bg-blue-50/40';
  const speechToggleActive = isSvyasa ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm';

  return (
    <div id="enquiry-chatbot-panel" className="bg-white border border-slate-200 rounded-3xl flex flex-col shadow-sm overflow-hidden h-full min-h-[500px]">
      
      {/* Bot Panel Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${lightBg} border ${lightBorder} rounded-xl relative`}>
            <Bot className={`w-5 h-5 ${primaryText}`} />
            <span className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${primaryBg} ring-2 ring-white`}></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-slate-800 font-sans tracking-tight">{botName}</h3>
              <Sparkles className={`w-3 h-3 ${primaryText} animate-pulse`} />
            </div>
            <p className="text-[11px] text-slate-505 flex items-center gap-1 font-mono">
              {studentId ? `Advising Student ID: ${studentId}` : (isSvyasa ? "Gurukula Support Bot" : "Prospective Support Bot")}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Audio Output reader Toggle */}
          <button
            id="btn-voice-toggle"
            onClick={() => {
              setSpeechEnabled(!speechEnabled);
              if (speechEnabled) {
                window.speechSynthesis.cancel();
              }
            }}
            title={speechEnabled ? "Mute answers" : "Speak answers"}
            className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              speechEnabled 
                ? speechToggleActive 
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Guest clear console */}
          <button
            id="clear-chatbot-logs"
            onClick={() => {
              setMessages([messages[0]]);
              onReceiveCoordinates(undefined);
            }}
            title="Clear current stream"
            className="p-2 rounded-lg bg-white text-slate-500 border border-slate-200 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages area with scrollbar */}
      <div 
        ref={scrollRef}
        id="chat-scroller-viewport"
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-300"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-2.5 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  msg.sender === 'user' 
                    ? `${primaryBg} border-none text-white font-mono text-[10px] font-bold` 
                    : `bg-slate-100 border-slate-200 ${primaryText}`
                }`}>
                  {msg.sender === 'user' ? 'U' : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble bubble content */}
                <div className="flex flex-col">
                  <div className={`p-4 rounded-3xl text-xs leading-relaxed select-text ${
                    msg.sender === 'user'
                      ? `${primaryBg} text-white rounded-tr-none shadow-md shadow-slate-100`
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none font-sans shadow-sm'
                  }`}>
                    
                    {/* Multi line check and rendering */}
                    <p className="whitespace-pre-line">
                      {msg.text}
                    </p>

                    {/* Integrated mini directions indicator */}
                    {msg.interactiveMap && (
                      <div className={`mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 ${lightBg}/50 p-2.5 rounded-xl`}>
                        <div className={`flex items-center gap-1.5 text-[10px] ${primaryText} font-mono font-medium`}>
                          <Layers className="w-3.5 h-3.5" />
                          <span>Campus Pin Highlighted: {msg.interactiveMap.buildingName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp code and Support Rating feedback */}
                  {msg.sender === 'user' ? (
                    <span className="text-[9px] text-slate-400 mt-1 font-mono text-right mr-1">
                      {msg.timestamp}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2.5 mt-1 ml-1 select-none font-sans">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {msg.timestamp}
                      </span>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        <button
                          id={`rate-up-${msg.id}`}
                          onClick={() => handleRateMessage(msg.id, 'up')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            msg.rating === 'up'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-110'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 animate-none'
                          }`}
                          title="Rate response as helpful"
                        >
                          <ThumbsUp className="w-2.5 h-2.5" />
                        </button>
                        <button
                          id={`rate-down-${msg.id}`}
                          onClick={() => handleRateMessage(msg.id, 'down')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            msg.rating === 'down'
                              ? 'text-rose-700 bg-rose-50 border border-rose-110'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                          }`}
                          title="Rate response as unhelpful"
                        >
                          <ThumbsDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 items-start">
              <div className={`w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 ${primaryText} flex items-center justify-center`}>
                <Bot className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-3.5 max-w-[200px] shadow-sm">
                <div className="flex space-x-1 items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSvyasa ? 'bg-orange-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSvyasa ? 'bg-orange-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSvyasa ? 'bg-orange-400' : 'bg-blue-500'} animate-bounce`} style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Quick Chips */}
      {messages.length > 0 && messages[messages.length - 1].suggestions && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto select-none shrink-0 no-scrollbar">
          {messages[messages.length - 1].suggestions?.map((chipText, idx) => (
            <button
              key={idx}
              id={`quick-query-chip-${idx}`}
              onClick={() => handleSendMessage(chipText)}
              className={`text-[10px] whitespace-nowrap bg-white border border-slate-200 py-1.5 px-3 rounded-full text-slate-600 transition-all duration-200 cursor-pointer ${hoverOutline}`}
            >
              ✨ {chipText}
            </button>
          ))}
        </div>
      )}

      {/* Input Field Control Panel */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
        {/* Dynamic Voice Recording Toggle Input */}
        <button
          id="btn-voice-input-record"
          onClick={handleMicToggle}
          className={`p-2.5 rounded-xl border shrink-0 transition-all duration-200 cursor-pointer ${
            isListening 
              ? 'bg-rose-600 border-rose-500 text-white animate-pulse' 
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          title={isListening ? "Listening - Click to stop" : "Start speaking question"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input Block */}
        <div className="flex-1 relative flex items-center">
          <input
            id="chat-input-field"
            type="text"
            className={`w-full bg-white text-xs text-slate-800 rounded-xl py-3 pl-4 pr-12 border border-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 ${isSvyasa ? 'focus:ring-orange-550 focus:ring-orange-500' : 'focus:ring-blue-500'}`}
            placeholder={isListening ? "Listening to your voice..." : "Type administrative or course enquiry..."}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <span className="absolute right-3.5 text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-1 pointer-events-none">
            <CornerDownLeft className="w-2.5 h-2.5" /> Enter
          </span>
        </div>

        {/* Send Action Trigger */}
        <button
          id="submit-query-btn"
          onClick={() => handleSendMessage()}
          className={`p-3 rounded-xl text-white ${primaryBg} ${primaryBgHover} hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shrink-0 shadow-sm`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
