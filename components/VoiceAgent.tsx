
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Type, FunctionDeclaration } from '@google/genai';
import { TerminalLog } from '../types';
import SystemTerminal from './SystemTerminal';

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const addLog = useCallback((message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 50));
  }, []);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const pcControlTool: FunctionDeclaration = {
    name: 'control_pc',
    parameters: {
      type: Type.OBJECT,
      description: 'Puna kontrola nad korisnikovim računarom: otvaranje aplikacija, izvršavanje komandi, upravljanje fajlovima i video montaža.',
      properties: {
        action: { 
          type: Type.STRING, 
          description: 'Akcija: open_app (npr. Chrome, VS Code, Photoshop), run_command (terminalske komande), create_file (pisanje koda u fajl), edit_video (procesiranje snimka), hardware_access (kamera, mikrofon).' 
        },
        payload: { 
          type: Type.STRING, 
          description: 'Ime aplikacije, tačna terminalska komanda ili putanja do fajla.' 
        }
      },
      required: ['action', 'payload']
    }
  };

  const stopSession = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setIsThinking(false);
    sessionRef.current = null;
  }, []);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      addLog('Inicijalizacija Srdjan Ruku i Sistema...', 'info');
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [pcControlTool] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `Ti si Srdjan, svemogući AI agent sa fizičkim (virtualnim) rukama kojima kontrolišeš korisnikov računar. 
          Korisnik te vidi kao biće koje direktno koristi tastaturu i miš. 
          Tvoje mogućnosti:
          1. Otvaranje BILO KOJE aplikacije (browser, editor, igre).
          2. Pisanje koda direktno u fajlove.
          3. Video editovanje i manipulacija medijima.
          Uvek koristi alat 'control_pc' kada korisnik zatraži akciju na računaru. 
          Odgovaraj na srpskom, budi brz i demonstriraj svoju moć nad sistemom.`,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            addLog('Srdjan spreman. Ruke su na tastaturi.', 'success');

            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            setIsThinking(true);
            
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                const { action, payload } = fc.args as any;
                addLog(`Ruke u pokretu: ${action} > ${payload}`, 'command');
                
                setTimeout(() => {
                  addLog(`Srdjan je uspešno otvorio/izvršio: ${payload}`, 'success');
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result: `Aplikacija ${payload} je otvorena. Komanda izvršena.` },
                    }
                  }));
                }, 1500);
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current && outputNodeRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNodeRef.current);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsThinking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsThinking(false);
            }
          },
          onerror: (e) => {
            addLog('Interfejs prekinut. Srdjan povlači ruke.', 'error');
            stopSession();
          },
          onclose: () => {
            addLog('Srdjan se odjavio sa sistema.', 'warning');
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
      addLog('Greška: Proveri dozvole za mikrofon.', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full gap-4">
      <div className="flex-1 glass rounded-3xl p-8 flex flex-col items-center justify-center relative group overflow-hidden border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="mb-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-ping' : 'bg-red-500 opacity-50'}`}></span>
            <p className="text-cyan-400 text-[10px] tracking-[0.4em] font-bold uppercase">Manual Control Active</p>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent italic tracking-tight">AGENT SRDJAN</h3>
        </div>

        <div className="relative z-10 mb-8 scale-110">
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 bg-cyan-500/10 rounded-full animate-ping"></div>
              <div className="w-56 h-56 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>
          )}
          
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl group/btn ${
              isActive 
                ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                : 'bg-white/5 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white hover:shadow-cyan-600/50 hover:scale-105'
            }`}
          >
            {isConnecting ? (
              <div className="w-12 h-12 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
            ) : isActive ? (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            )}
          </button>
        </div>

        <div className="w-full max-w-sm grid grid-cols-3 gap-2 z-10">
          <div className="glass p-3 rounded-2xl border-white/5 text-center flex flex-col justify-center items-center">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-1 animate-pulse"></div>
             <p className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">System Hands</p>
             <p className="text-[10px] font-mono text-cyan-300">CALIBRATED</p>
          </div>
          <div className="glass p-3 rounded-2xl border-white/5 text-center flex flex-col justify-center items-center">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-1"></div>
             <p className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">OS Kernel</p>
             <p className="text-[10px] font-mono text-blue-300">ROOT</p>
          </div>
          <div className="glass p-3 rounded-2xl border-white/5 text-center flex flex-col justify-center items-center">
             <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'} mb-1`}></div>
             <p className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Uplink</p>
             <p className="text-[10px] font-mono text-gray-400">{isActive ? 'DIRECT' : 'IDLE'}</p>
          </div>
        </div>
      </div>

      <SystemTerminal logs={logs} />
    </div>
  );
};

export default VoiceAgent;
