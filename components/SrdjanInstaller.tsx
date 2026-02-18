
import React, { useState, useEffect } from 'react';
import { TerminalLog } from '../types';
import SystemTerminal from './SystemTerminal';

const SrdjanInstaller: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isDone, setIsDone] = useState(false);

  const addLog = (message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    }, ...prev].slice(0, 100));
  };

  const startBuild = async () => {
    setIsBuilding(true);
    setIsDone(false);
    setProgress(0);
    setLogs([]);

    const steps = [
      { msg: 'Inicijalizacija Srdjan Build Engine-a...', type: 'info', p: 5 },
      { msg: 'Analiza sistemskih zavisnosti (Windows/x64)...', type: 'info', p: 10 },
      { msg: 'Sakupljanje Neuralnih modula...', type: 'command', p: 20 },
      { msg: 'Povezivanje Voice API jezgra...', type: 'info', p: 30 },
      { msg: 'Generisanje OS kuka (Global Hooks)...', type: 'warning', p: 40 },
      { msg: 'Kompilacija Srdjan.cpp -> Srdjan.obj', type: 'command', p: 50 },
      { msg: 'Linkovanje sa PC Control bibliotekama...', type: 'info', p: 65 },
      { msg: 'Enkripcija binarnog koda (AES-256)...', type: 'success', p: 80 },
      { msg: 'Optimizacija za PC hardware...', type: 'info', p: 90 },
      { msg: 'Generisanje Srdjan.exe finalnog fajla...', type: 'success', p: 100 },
    ];

    for (const step of steps) {
      addLog(step.msg, step.type as any);
      setProgress(step.p);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    }

    setIsBuilding(false);
    setIsDone(true);
    addLog('BUILD USPEŠAN: Srdjan.exe je spreman za preuzimanje.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <div className="flex-1 glass rounded-3xl p-8 flex flex-col border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <div className="w-24 h-24 border border-emerald-500/20 rounded-full flex items-center justify-center animate-spin-slow">
              <span className="text-emerald-500 font-mono text-[10px]">EXE_BUILD</span>
           </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Srdjan.exe Installer</h3>
          <p className="text-gray-400 text-sm mt-2">Generiši nativnu Windows aplikaciju za punu kontrolu nad tvojim PC-om.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          {!isBuilding && !isDone ? (
            <div className="text-center animate-fade-in">
              <div className="w-32 h-32 glass border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-emerald-500/10">
                 <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              <button 
                onClick={startBuild}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
              >
                NAPRAVI SRDJAN.EXE
              </button>
            </div>
          ) : isBuilding ? (
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <span>Kompilacija u toku...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-[10px] text-gray-500 animate-pulse">NEMOJ GASITI BROWSER TOKOM PROCESA</p>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-32 h-32 bg-emerald-500/20 border-2 border-emerald-500 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-emerald-500/20">
                 <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Srdjan.exe je Spreman!</h4>
              <button 
                className="bg-white text-black hover:bg-emerald-100 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto"
                onClick={() => alert("Simulacija: Preuzimanje Srdjan_V3_Installer.exe počinje...")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                PREUZMI .EXE
              </button>
              <button 
                onClick={() => setIsDone(false)}
                className="mt-6 text-gray-500 hover:text-white text-xs uppercase tracking-widest"
              >
                RE-BUILD
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 glass border-white/5 rounded-2xl bg-emerald-500/5">
           <p className="text-[10px] text-emerald-400 font-bold mb-2">PC MINIMUM REQUIREMENTS:</p>
           <div className="grid grid-cols-2 gap-4 text-[9px] text-gray-500">
              <div>• OS: Windows 10/11 x64</div>
              <div>• RAM: 8GB Neural Opt.</div>
              <div>• GPU: NVIDIA/AMD (AI Accel)</div>
              <div>• ACCESS: System Root Req.</div>
           </div>
        </div>
      </div>

      <SystemTerminal logs={logs} />
    </div>
  );
};

export default SrdjanInstaller;
