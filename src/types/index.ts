// User related types
export interface User {
  id: number;
  username: string;
  nickname: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Conversation related types
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  role: 'system' | 'assistant' | 'user';
  content: string;
  thinkingText: string | null;
  createdAt: string;
}

// Configuration related types
export interface ApiConfig {
  id: number;
  userId: number;
  name: string;
  apiUrl: string;
  apiKey: string;
  headers: Record<string, string>;
  requestTemplate: any;
  responseTemplate: {
    roleField: string;
    contentField: string;
    thinkingTextField: string | null;
  };
}

// User preferences
export interface UserPreferences {
  theme: string;
  showThinking: boolean;
  saveHistory: boolean;
} 