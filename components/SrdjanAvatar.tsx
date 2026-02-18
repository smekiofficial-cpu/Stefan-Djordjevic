
import React from 'react';
import { AgentMode } from '../types';

interface SrdjanAvatarProps {
  mode: AgentMode;
  isProcessing?: boolean;
}

const SrdjanAvatar: React.FC<SrdjanAvatarProps> = ({ mode, isProcessing = false }) => {
  const getColors = () => {
    switch (mode) {
      case AgentMode.VOICE: return 'from-cyan-500 via-blue-600 to-indigo-700 shadow-cyan-500/40';
      case AgentMode.CODE: return 'from-emerald-500 via-teal-600 to-blue-700 shadow-emerald-500/40';
      case AgentMode.VIDEO: return 'from-fuchsia-500 via-purple-600 to-indigo-700 shadow-fuchsia-500/40';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className="relative group perspective-1000 w-full flex flex-col items-center">
      {/* Background kinetic energy */}
      <div className={`absolute inset-0 rounded-full blur-[100px] opacity-10 bg-gradient-to-br ${getColors()} animate-pulse`}></div>
      
      {/* Rotating orbit rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/5 animate-[spin_15s_linear_infinite] opacity-30"></div>
      
      {/* Cybernetic Hands (Holographic) */}
      <div className={`absolute w-full h-full z-20 pointer-events-none transition-all duration-700 ${isProcessing ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-10 scale-90'}`}>
        {/* Left Hand */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 animate-bounce" style={{ animationDuration: '3s' }}>
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <path d="M10 50C10 30 20 20 40 20M40 20L50 10M40 20L60 25M40 20L65 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-400" />
            <rect x="35" y="15" width="10" height="10" rx="2" fill="currentColor" className="text-blue-400 animate-pulse" />
            <circle cx="10" cy="50" r="3" fill="currentColor" className="text-cyan-400" />
          </svg>
        </div>
        {/* Right Hand */}
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-x-[-1]">
            <path d="M10 50C10 30 20 20 40 20M40 20L50 10M40 20L60 25M40 20L65 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-400" />
            <rect x="35" y="15" width="10" height="10" rx="2" fill="currentColor" className="text-blue-400 animate-pulse" />
            <circle cx="10" cy="50" r="3" fill="currentColor" className="text-cyan-400" />
          </svg>
        </div>
        
        {/* Holographic Keyboard / Interface Interaction */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 glass border-t-2 border-blue-500/30 rounded-t-3xl overflow-hidden flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1 p-2 opacity-20">
                {Array.from({length: 24}).map((_, i) => (
                    <div key={i} className="w-6 h-4 bg-blue-500/50 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}></div>
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
        </div>
      </div>
      
      {/* Main Avatar Orb */}
      <div className={`w-56 h-56 md:w-72 md:h-72 rounded-full glass srdjan-glow flex items-center justify-center p-6 relative overflow-hidden transition-all duration-1000 transform group-hover:scale-105 z-10`}>
        {/* Dynamic fluid background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getColors()} opacity-20 animate-pulse-slow`}></div>
        
        {/* Energy core */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full glass border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all ${isProcessing ? 'scale-110 rotate-12' : 'scale-100'}`}>
            {/* Pulsing neural nodes */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
               <div className={`w-full h-1 bg-white/20 absolute rotate-45 animate-pulse`}></div>
               <div className={`w-full h-1 bg-white/20 absolute -rotate-45 animate-pulse`}></div>
            </div>

            {/* Audio spectrum / wave effect */}
            <div className="flex gap-1.5 items-end justify-center h-16 z-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full bg-white/90 transition-all duration-300 ${isProcessing ? 'animate-bounce' : 'animate-pulse'}`} 
                  style={{ 
                    height: isProcessing ? `${Math.random() * 80 + 20}%` : `${10 + (i % 3) * 10}%`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: isProcessing ? 1 : 0.6
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Ambient light flares */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
      </div>

      {/* Futuristic status label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
        <div className="glass px-6 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase">
            {isProcessing ? 'Srdjan Upravlja Sistemom' : 'Srdjan u Pripravnosti'}
          </span>
        </div>
        <div className="mt-2 w-1 h-8 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default SrdjanAvatar;
