import apiClient from '../apiClient';
import {CommonResult} from '@/types';

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
    searchText?: string;
}

export interface PageResult<T> {
    list: T[];
    total: number;
}

// Message Types
export interface Message {
    id: number;
    conversationId: number;
    configId?: number;
    configName?: string;
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
    configId?: number;
    role: string;
    content: string;
    thinkingText?: string;
}

export interface ConversationService {
    getConversations: () => Promise<Conversation[]>;
    getConversationPage: (params: ConversationPageRequest) => Promise<PageResult<Conversation>>;
    getConversation: (id: number) => Promise<Conversation>;
    createConversation: (data: ConversationCreateOrUpdateRequest) => Promise<Conversation>;
    updateConversation: (id: number, data: ConversationCreateOrUpdateRequest) => Promise<Conversation>;
    deleteConversation: (id: number) => Promise<boolean>;
}

export interface MessageService {
    getMessages: (conversationId: number) => Promise<Message[]>;
    getMessage: (id: number) => Promise<Message>;
    renameMessage: (id: number, content: string) => Promise<Message>;
    sendMessage: (data: SendMessageRequest) => Promise<Message>;
    deleteMessage: (id: number) => Promise<boolean>;
    deleteConversationMessages: (conversationId: number) => Promise<boolean>;
}

// Conversation Implementation
export const conversationService: ConversationService = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await apiClient.get<CommonResult<Conversation[]>>('/conversation/getConversations');
        return response.data.data;
    },

    getConversationPage: async (params: ConversationPageRequest): Promise<PageResult<Conversation>> => {
        const response = await apiClient.get<CommonResult<PageResult<Conversation>>>('/conversation/page', {params});
        return response.data.data;
    },

    getConversation: async (id: number): Promise<Conversation> => {
        const response = await apiClient.get<CommonResult<Conversation>>(`/conversation/${id}`);
        return response.data.data;
    },

    createConversation: async (data: ConversationCreateOrUpdateRequest): Promise<Conversation> => {
        const response = await apiClient.post<CommonResult<Conversation>>('/conversation/createConversation', data);
        return response.data.data;
    },

    updateConversation: async (id: number, data: ConversationCreateOrUpdateRequest): Promise<Conversation> => {
        const response = await apiClient.put<CommonResult<Conversation>>(`/conversation/updateConversation/${id}`, data);
        return response.data.data;
    },

    deleteConversation: async (id: number): Promise<boolean> => {
        const response = await apiClient.delete<CommonResult<boolean>>(`/conversation/conversations/${id}`);
        return response.data.data;
    }
};

// Message Implementation
export const messageService: MessageService = {
    getMessages: async (conversationId: number): Promise<Message[]> => {
        const response = await apiClient.get<CommonResult<Message[]>>('/conversation/message/getMessages', {
            params: {conversationId}
        });
        return response.data.data;
    },

    getMessage: async (id: number): Promise<Message> => {
        const response = await apiClient.get<CommonResult<Message>>(`/conversation/message/${id}`);
        return response.data.data;
    },

    renameMessage: async (id: number, content: string): Promise<Message> => {
        const response = await apiClient.post<CommonResult<Message>>('/conversation/message/renameMessage', {
            id,
            content
        });
        return response.data.data;
    },

    sendMessage: async (data: SendMessageRequest): Promise<Message> => {
        const response = await apiClient.post<CommonResult<Message>>('/conversation/message/sendMessage', data);
        return response.data.data;
    },

    deleteMessage: async (id: number): Promise<boolean> => {
        const response = await apiClient.delete<CommonResult<boolean>>(`/conversation/message/${id}`);
        return response.data.data;
    },

    deleteConversationMessages: async (conversationId: number): Promise<boolean> => {
        const response = await apiClient.delete<CommonResult<boolean>>(`/conversation/message/conversation/${conversationId}`);
        return response.data.data;
    }
};
