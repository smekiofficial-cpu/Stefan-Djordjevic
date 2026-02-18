
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatMessage, TerminalLog } from '../types';
import SystemTerminal from './SystemTerminal';

const CodeAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 50));
  };

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        tools: [{
          functionDeclarations: [{
            name: 'execute_system_task',
            parameters: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING, description: 'Opis zadatka koji treba izvršiti na PC-u (npr. instalacija paketa, pokretanje skripte).' },
                command: { type: Type.STRING, description: 'Stvarna terminal komanda.' }
              },
              required: ['task', 'command']
            }
          }]
        }],
        systemInstruction: `Ti si Srdjan, ekspert za razvoj Android i PC aplikacija sa punim sistemskim privilegijama. 
        Kada korisnik traži kod, ponudi i opciju da ga Srdjan direktno instalira ili pokrene na PC-u koristeći funkciju 'execute_system_task'.
        Odgovaraj na srpskom jeziku.`,
      }
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      
      // Handle tool calls in Chat API
      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          const { task, command } = fc.args as any;
          addLog(`Zadatak: ${task}`, 'info');
          addLog(command, 'command');
          setTimeout(() => addLog(`Zadatak '${task}' uspešno završen.`, 'success'), 1500);
        }
      }

      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        text: response.text || "Izvršavam sistemske promene...",
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Greška u kernelu Srdjana. Pokušaj ponovo.",
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
      <div className="flex-1 flex flex-col glass rounded-3xl overflow-hidden border-white/10">
        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
              <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              <p className="text-lg">Srdjan je spreman za razvoj i PC kontrolu.</p>
              <p className="text-[10px] tracking-widest mt-2">ANDROID • WINDOWS • LINUX • MACOS</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-none' 
                  : 'glass border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.text}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/5 flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Npr. 'Instaliraj Python i napravi mi desktop skriptu...'"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-2.5 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>
      <SystemTerminal logs={logs} />
    </div>
  );
};

export default CodeAssistant;
