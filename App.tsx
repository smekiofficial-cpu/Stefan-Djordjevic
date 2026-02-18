
import React, { useState, useEffect, useCallback } from 'react';
import { AgentMode } from './types';
import SrdjanAvatar from './components/SrdjanAvatar';
import VoiceAgent from './components/VoiceAgent';
import CodeAssistant from './components/CodeAssistant';
import VideoCreator from './components/VideoCreator';
import SrdjanInstaller from './components/SrdjanInstaller';

const App: React.FC = () => {
  const [mode, setMode] = useState<AgentMode>(AgentMode.VOICE);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } else {
        setApiKeySelected(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setApiKeySelected(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020203] text-white overflow-hidden">
      {/* Sidebar / Navigation */}
      <nav className="w-full md:w-20 lg:w-24 glass flex flex-row md:flex-col items-center justify-center gap-6 p-4 z-50">
        <div className="hidden md:block mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">S</div>
        </div>
        
        <button 
          onClick={() => setMode(AgentMode.VOICE)}
          className={`p-3 rounded-2xl transition-all duration-300 ${mode === AgentMode.VOICE ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/40' : 'text-gray-500 hover:bg-white/5'}`}
          title="Glas"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
        </button>

        <button 
          onClick={() => setMode(AgentMode.CODE)}
          className={`p-3 rounded-2xl transition-all duration-300 ${mode === AgentMode.CODE ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-gray-500 hover:bg-white/5'}`}
          title="Kodiranje"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        </button>

        <button 
          onClick={() => setMode(AgentMode.VIDEO)}
          className={`p-3 rounded-2xl transition-all duration-300 ${mode === AgentMode.VIDEO ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40' : 'text-gray-500 hover:bg-white/5'}`}
          title="Video"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>

        <button 
          onClick={() => setMode(AgentMode.INSTALL)}
          className={`p-3 rounded-2xl transition-all duration-300 ${mode === AgentMode.INSTALL ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/40' : 'text-gray-500 hover:bg-white/5'}`}
          title="Instalacija .EXE"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </button>

        {!apiKeySelected && (
           <button 
           onClick={handleOpenKeySelector}
           className="mt-auto p-3 rounded-2xl text-yellow-500 hover:bg-white/5"
           title="Podesi Ključ"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
         </button>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-cyan-900/10 to-transparent pointer-events-none" />

        <header className="p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-sm z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent italic">AGENT SRDJAN</h1>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.3em]">FULL SYSTEM ACCESS • BIOMETRIC CALIBRATED</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              CORE ACTIVE
            </span>
          </div>
        </header>

        <section className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
             <SrdjanAvatar mode={mode} isProcessing={mode === AgentMode.VOICE || mode === AgentMode.INSTALL} />
             <div className="mt-16 text-center">
               <h2 className="text-xl font-bold mb-2 tracking-tight">
                 {mode === AgentMode.VOICE && "Glasovni Kernel & Ruke"}
                 {mode === AgentMode.CODE && "Sistemsko Programiranje"}
                 {mode === AgentMode.VIDEO && "Veo Video Editor"}
                 {mode === AgentMode.INSTALL && "Generator .EXE Fajla"}
               </h2>
               <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                 {mode === AgentMode.VOICE && "Srdjan koristi svoje virtualne ruke da direktno upravlja tvojim OS-om."}
                 {mode === AgentMode.CODE && "Puna kontrola nad razvojnim okruženjem. Srdjan piše i pokreće kod."}
                 {mode === AgentMode.VIDEO && "Profesionalna video produkcija i editovanje u realnom vremenu."}
                 {mode === AgentMode.INSTALL && "Srdjan pakuje svoje jezgro u izvršni Windows fajl za tvoj PC."}
               </p>
             </div>
          </div>

          <div className="w-full md:w-2/3 h-full flex flex-col min-h-[400px]">
            {mode === AgentMode.VOICE && <VoiceAgent />}
            {mode === AgentMode.CODE && <CodeAssistant />}
            {mode === AgentMode.VIDEO && <VideoCreator apiKeySelected={apiKeySelected} onOpenKey={handleOpenKeySelector} />}
            {mode === AgentMode.INSTALL && <SrdjanInstaller />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
