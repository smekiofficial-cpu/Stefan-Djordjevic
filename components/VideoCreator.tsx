
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VideoGenerationState } from '../types';

interface VideoCreatorProps {
  apiKeySelected: boolean;
  onOpenKey: () => void;
}

const VideoCreator: React.FC<VideoCreatorProps> = ({ apiKeySelected, onOpenKey }) => {
  const [prompt, setPrompt] = useState('');
  const [videoState, setVideoState] = useState<VideoGenerationState>({ status: 'idle' });

  const handleGenerate = async () => {
    if (!prompt.trim() || videoState.status === 'generating') return;
    
    if (!apiKeySelected) {
      onOpenKey();
      return;
    }

    setVideoState({ status: 'generating', progressMessage: 'Srdjan inicijalizuje Veo engine...' });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setVideoState({ status: 'generating', progressMessage: 'Rendering u toku (ovo može potrajati par minuta)...' });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoState({ status: 'completed', url: videoUrl });
      } else {
        throw new Error("Link za video nije generisan.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
          onOpenKey();
      }
      setVideoState({ status: 'error', error: "Srdjan nije uspeo da generiše video. Pokušaj ponovo." });
    }
  };

  return (
    <div className="flex-1 flex flex-col glass rounded-3xl p-8 border-white/10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Video Kreator</h3>
        <p className="text-gray-400 text-sm">Opiši scenu, a Srdjan će je pretvoriti u kinematografski video.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Npr. 'Futuristički grad u sumrak sa letećim automobilima, neon stil, 4k...'"
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-purple-500 resize-none transition-all"
        />

        <button 
          onClick={handleGenerate}
          disabled={videoState.status === 'generating' || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {videoState.status === 'generating' ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {videoState.progressMessage}
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Generiši Video
            </>
          )}
        </button>

        {videoState.status === 'completed' && videoState.url && (
          <div className="mt-4 animate-fade-in">
            <video 
              src={videoState.url} 
              controls 
              className="w-full rounded-2xl border border-white/10 shadow-2xl"
              autoPlay
              loop
            />
            <a 
              href={videoState.url} 
              download="SrdjanVideo.mp4"
              className="mt-4 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Sačuvaj Video
            </a>
          </div>
        )}

        {videoState.status === 'error' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center text-sm">
            {videoState.error}
          </div>
        )}
      </div>

      <div className="mt-auto pt-6 text-[10px] text-gray-500 uppercase tracking-widest text-center">
        Powered by VEO 3.1 & Gemini
      </div>
    </div>
  );
};

export default VideoCreator;
