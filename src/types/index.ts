// User related types
export interface User {
  id: number;
  username: string;
  nickname: string;
  loginType?: number;
  token?: string;
  expiresIn?: number;
  isNewUser?: boolean;
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
    createTime: string;
    updateTime?: string;
    isDeleted?: boolean;
}

export interface Message {
  id: number;
  conversationId: number;
    role: 'system' | 'assistant' | 'user' | string;
  content: string;
  thinkingText: string | null;
    createTime: string;
    updateTime?: string;
    isDeleted?: boolean;
}

// Configuration related types
export interface ApiConfig {
  id: number;
  userId: number;
  name: string;
  apiUrl: string;
  apiKey: string;
  isAvailable: boolean;
  apiKeyPlacement: 'header' | 'body' | 'custom_header';
  apiKeyHeader?: string;
  apiKeyBodyPath?: string;
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