
export enum AgentMode {
  VOICE = 'VOICE',
  CODE = 'CODE',
  VIDEO = 'VIDEO',
  INSTALL = 'INSTALL'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  code?: string;
  timestamp: number;
}

export interface VideoGenerationState {
  status: 'idle' | 'generating' | 'completed' | 'error';
  url?: string;
  error?: string;
  progressMessage?: string;
}

export interface TerminalLog {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  message: string;
  timestamp: number;
}
