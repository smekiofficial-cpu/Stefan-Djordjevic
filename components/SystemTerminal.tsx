
import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';

interface SystemTerminalProps {
  logs: TerminalLog[];
}

const SystemTerminal: React.FC<SystemTerminalProps> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // Recent logs at top, or use reverse logic
    }
  }, [logs]);

  return (
    <div className="glass border-white/5 rounded-3xl overflow-hidden flex flex-col h-56 transition-all duration-500 shadow-inner group">
      <div className="bg-black/60 px-6 py-3 border-b border-white/5 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20"></div>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            Srdjan_Sys_V3.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-500 font-mono font-bold animate-pulse tracking-widest">LIVE_KERNEL_LOG</span>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 p-5 font-mono text-[11px] overflow-y-auto custom-scrollbar space-y-2 bg-black/40 backdrop-blur-lg code-font"
      >
        {logs.length === 0 && (
          <div className="text-gray-600 italic animate-pulse flex items-center gap-2">
             <span className="w-1 h-3 bg-blue-500 animate-bounce"></span>
             Čekam sistemski zahtev...
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 group/log animate-fade-in border-l-2 border-transparent hover:border-white/10 pl-2 transition-all">
            <span className="text-gray-600 font-bold shrink-0">
              {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={`break-all ${
              log.type === 'error' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]' :
              log.type === 'success' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' :
              log.type === 'warning' ? 'text-amber-400' :
              log.type === 'command' ? 'text-cyan-400 font-bold' : 'text-blue-200/80'
            }`}>
              {log.type === 'command' && <span className="text-blue-500 mr-1 opacity-50">❯</span>}
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemTerminal;
