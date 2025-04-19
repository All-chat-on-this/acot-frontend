import apiClient from '../apiClient';

// Conversation Types
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createTime?: string;
  updateTime?: string;
}

export interface ConversationCreateOrUpdateRequest {
  title: string;
}

export interface ConversationPageRequest {
  pageNo: number;
  pageSize: number;
  title?: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
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
}

export interface SendMessageRequest {
  conversationId: number;
  configId: number;
  message: string;
}

export interface MessageCreateRequest {
  conversationId: number;
  role: string;
  content: string;
  thinkingText?: string;
}

// Conversation Implementation
export const conversationService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/conversation/getConversations');
    return response.data.data;
  },

  getConversationPage: async (params: ConversationPageRequest): Promise<PageResult<Conversation>> => {
    const response = await apiClient.get('/conversation/page', {params});
    return response.data.data;
  },
  
  getConversation: async (id: number): Promise<Conversation> => {
    const response = await apiClient.get(`/conversation/${id}`);
    return response.data.data;
  },

  createConversation: async (data: ConversationCreateOrUpdateRequest): Promise<Conversation> => {
    const response = await apiClient.post('/conversation/createConversation', data);
    return response.data.data;
  },

  updateConversation: async (id: number, data: ConversationCreateOrUpdateRequest): Promise<Conversation> => {
    const response = await apiClient.put(`/conversation/updateConversation/${id}`, data);
    return response.data.data;
  },
  
  deleteConversation: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(`/conversation/conversations/${id}`);
    return response.data.data;
  }
};

// Message Implementation
export const messageService = {
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await apiClient.get('/conversation/message/getMessages', {
      params: {conversationId}
    });
    return response.data.data;
  },

  getMessage: async (id: number): Promise<Message> => {
    const response = await apiClient.get(`/conversation/message/${id}`);
    return response.data.data;
  },

  createMessage: async (data: MessageCreateRequest): Promise<Message> => {
    const response = await apiClient.post('/conversation/message/createMessage', data);
    return response.data.data;
  },

  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post('/conversation/message/sendMessage', data);
    return response.data.data;
  },

  deleteMessage: async (id: number): Promise<boolean> => {
    const response = await apiClient.delete(`/conversation/message/${id}`);
    return response.data.data;
  },

  deleteConversationMessages: async (conversationId: number): Promise<boolean> => {
    const response = await apiClient.delete(`/conversation/message/conversation/${conversationId}`);
    return response.data.data;
  }
};
