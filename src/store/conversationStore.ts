import {create} from 'zustand';
import apiService from '@/api/apiService';
import {Conversation, ConversationCreateOrUpdateRequest, Message, SendMessageRequest} from '@/api/type/modelApi';

interface ConversationState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    fetchConversations: () => Promise<Conversation[]>;
    fetchConversation: (id: number) => Promise<Conversation>;
    createConversation: (title: string) => Promise<Conversation>;
    updateConversation: (id: number, data: Partial<Conversation>) => Promise<Conversation>;
    deleteConversation: (id: number) => Promise<void>;
    sendMessage: (content: string, configId: number) => Promise<Message>;
    renameMessage: (id: number, content: string) => Promise<Message>;
    deleteMessage: (id: number) => Promise<void>;
}

// For development/demo purposes
const demoConversations: Conversation[] = [
    {
        id: 1, 
        title: 'Conversation about AI ethics',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        userId: 1
    },
    {
        id: 2, 
        title: 'Technical discussion',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        userId: 1
    }
];

const useConversationStore = create<ConversationState>((set, get) => ({
    conversations: [...demoConversations],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        set({isLoading: true, error: null});
        try {
            // Use the proper service method from modelApi.ts
            const conversations = await apiService.conversations.getConversations();
            set({conversations, isLoading: false});
            return conversations;
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            set({error: 'Failed to fetch conversations', isLoading: false});
            return [];
        }
    },

    fetchConversation: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            // Get conversation and messages concurrently
            const conversation = await apiService.conversations.getConversation(id);
            const messages = await apiService.messages.getMessages(id);

            set({currentConversation: conversation, messages, isLoading: false});
            return conversation;
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
            set({error: 'Failed to fetch conversation', isLoading: false});
            throw error;
        }
    },

    createConversation: async (title: string) => {
        set({isLoading: true, error: null});
        try {
            const request: ConversationCreateOrUpdateRequest = {title};
            const newConversation = await apiService.conversations.createConversation(request);

            // Update the store with the new conversation
            set(state => ({
                conversations: [...state.conversations, newConversation],
                currentConversation: newConversation,
                isLoading: false
            }));

            return newConversation;
        } catch (error) {
            console.error('Failed to create conversation:', error);
            set({error: 'Failed to create conversation', isLoading: false});
            throw error;
        }
    },

    updateConversation: async (id: number, data: Partial<Conversation>) => {
        set({isLoading: true, error: null});
        try {
            const request: ConversationCreateOrUpdateRequest = {
                title: data.title || ''
            };

            const updatedConversation = await apiService.conversations.updateConversation(id, request);

            set(state => ({
                conversations: state.conversations.map(c =>
                    c.id === id ? updatedConversation : c
                ),
                currentConversation: state.currentConversation?.id === id
                    ? updatedConversation
                    : state.currentConversation,
                isLoading: false
            }));

            return updatedConversation;
        } catch (error) {
            console.error('Failed to update conversation:', error);
            set({error: 'Failed to update conversation', isLoading: false});
            throw error;
        }
    },

    deleteConversation: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            await apiService.conversations.deleteConversation(id);

            set(state => ({
                conversations: state.conversations.filter(c => c.id !== id),
                currentConversation: state.currentConversation?.id === id ? null : state.currentConversation,
                messages: state.currentConversation?.id === id ? [] : state.messages,
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to delete conversation:', error);
            set({error: 'Failed to delete conversation', isLoading: false});
            throw error;
        }
    },

    sendMessage: async (content: string, configId: number) => {
        set({isLoading: true, error: null});
        try {
            const {currentConversation} = get();
            if (!currentConversation) {
                throw new Error('No active conversation');
            }

            const sendMessageRequest: SendMessageRequest = {
                conversationId: currentConversation.id,
                configId,
                message: content
            };

            // Create user message locally first for UI feedback
            const userMessage: Message = {
                id: Date.now(), // Temporary ID
                conversationId: currentConversation.id,
                role: 'user',
                content,
                thinkingText: null,
                createTime: new Date().toISOString()
            };

            set(state => ({
                messages: [...state.messages, userMessage]
            }));

            // Send the message to the backend
            const responseMessage = await apiService.messages.sendMessage(sendMessageRequest);

            set(state => ({
                messages: [...state.messages.filter(m => m.role !== 'user' || m.id !== userMessage.id), responseMessage],
                isLoading: false
            }));

            return responseMessage;
        } catch (error) {
            console.error('Failed to send message:', error);
            set({error: 'Failed to send message', isLoading: false});
            throw error;
        }
    },

    renameMessage: async (id: number, content: string) => {
        set({isLoading: true, error: null});
        try {
            // Get the current message
            const state = get();
            const message = state.messages.find(m => m.id === id);

            if (!message) {
                throw new Error('Message not found');
            }

            // Create updated message request
            const updatedMessage = {
                conversationId: message.conversationId,
                role: message.role,
                content: content,
                thinkingText: message.thinkingText === null ? undefined : message.thinkingText
            };

            // Update the message through API
            const result = await apiService.messages.createMessage(updatedMessage);

            // If it's a user message, we may need to delete subsequent messages
            if (message.role === 'user') {
                // Find this message's index
                const messageIndex = state.messages.findIndex(m => m.id === id);

                // Get messages that came after this one
                const laterMessages = state.messages.slice(messageIndex + 1);

                // Delete those messages
                for (const msg of laterMessages) {
                    try {
                        await apiService.messages.deleteMessage(msg.id);
                    } catch (err) {
                        console.error(`Failed to delete message ${msg.id}`, err);
                    }
                }

                // Update state - keep only messages up to the edited one, plus the edited one
                set(state => ({
                    messages: [...state.messages.slice(0, messageIndex), result],
                    isLoading: false
                }));
            } else {
                // Just update this message
                set(state => ({
                    messages: state.messages.map(m => m.id === id ? result : m),
                    isLoading: false
                }));
            }

            return result;
        } catch (error) {
            console.error('Failed to rename message:', error);
            set({error: 'Failed to rename message', isLoading: false});
            throw error;
        }
    },

    deleteMessage: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            await apiService.messages.deleteMessage(id);

            set(state => ({
                messages: state.messages.filter(m => m.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('Failed to delete message:', error);
            set({error: 'Failed to delete message', isLoading: false});
            throw error;
        }
    }
}));

export default useConversationStore; 