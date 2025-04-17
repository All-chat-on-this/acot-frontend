import apiClient from '../apiClient';

// Conversation Types
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createTime?: string;
  updateTime?: string;
}

export interface ConversationService {
  getConversations(): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation>;
  createConversation(title: string): Promise<Conversation>;
  updateConversation(id: number, title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<boolean>;
}

// Message Types
export interface Message {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant' | 'system' | string;
  content: string;
  thinkingText: string | null;
  createTime?: string;
  updateTime?: string;
  isDeleted?: boolean;
}

export interface MessageService {
  getMessages(conversationId: number): Promise<Message[]>;
  sendMessage(conversationId: number, content: string, configId: number): Promise<Message[]>;
}

// Conversation Implementation
export const conversationService: ConversationService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/conversations');
    return response.data;
  },
  
  getConversation: async (id: number): Promise<Conversation> => {
    const response = await apiClient.get(`/conversations/${id}`);
    return response.data;
  },
  
  createConversation: async (title: string): Promise<Conversation> => {
    const response = await apiClient.post('/conversations', { title });
    return response.data;
  },
  
  updateConversation: async (id: number, title: string): Promise<Conversation> => {
    const response = await apiClient.put(`/conversations/${id}`, { title });
    return response.data;
  },
  
  deleteConversation: async (id: number): Promise<boolean> => {
    await apiClient.delete(`/conversations/${id}`);
    return true;
  }
};

// Message Implementation
export const messageService: MessageService = {
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },
  
  sendMessage: async (conversationId: number, content: string, configId: number): Promise<Message[]> => {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, { 
      content, 
      configId 
    });
    return response.data;
  }
};
