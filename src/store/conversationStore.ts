import {create} from 'zustand';
import apiService from '@/api/apiService';
import {Conversation, ConversationCreateOrUpdateRequest, Message, SendMessageRequest} from '@/api/type/modelApi';
import {AxiosError} from 'axios';
import {CommonResult} from '@/types';

interface ConversationState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}

interface ConversationStore extends ConversationState {
    fetchConversations: () => Promise<Conversation[]>;
    fetchConversation: (id: number) => Promise<Conversation>;
    createConversation: (title: string) => Promise<Conversation>;
    updateConversation: (id: number, data: Partial<Conversation>) => Promise<Conversation>;
    deleteConversation: (id: number) => Promise<void>;
    sendMessage: (content: string, configId: number) => Promise<Message>;
    renameMessage: (id: number, content: string) => Promise<Message>;
    deleteMessage: (id: number) => Promise<void>;
    setConversations: (conversations: Conversation[]) => void;
}

// Helper function to handle API errors consistently
const handleApiError = (error: unknown, errorMessage: string): never => {
    // Extract meaningful error message if available
    let message = errorMessage;
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as CommonResult<unknown>;
        message = data.msg || errorMessage;
    } else if (error instanceof Error) {
        message = `${errorMessage}: ${error.message}`;
    }
    console.error(message, error);
    throw new Error(message);
};

const useConversationStore = create<ConversationStore>((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        set({isLoading: true, error: null});
        try {
            const conversations = await apiService.conversations.getConversations();
            set({conversations, isLoading: false});
            return conversations;
        } catch (error) {
            const errorMsg = 'Failed to fetch conversations';
            set({error: errorMsg, isLoading: false});
            console.error(errorMsg, error);
            return [];
        }
    },

    fetchConversation: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            // Get conversation and messages concurrently
            const [conversation, messages] = await Promise.all([
                apiService.conversations.getConversation(id),
                apiService.messages.getMessages(id)
            ]);

            set({currentConversation: conversation, messages, isLoading: false});
            return conversation;
        } catch (error) {
            const errorMsg = `Failed to fetch conversation #${id}`;
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
        }
    },

    createConversation: async (title: string) => {
        set({isLoading: true, error: null});
        try {
            const request: ConversationCreateOrUpdateRequest = {title};
            const newConversation = await apiService.conversations.createConversation(request);

            // Update the store with the new conversation
            // Id is unique, so we can assume it's the last one
            set(state => ({
                conversations: [newConversation, ...state.conversations],
                currentConversation: newConversation,
                isLoading: false
            }));

            return newConversation;
        } catch (error) {
            const errorMsg = 'Failed to create conversation';
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
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
            const errorMsg = `Failed to update conversation #${id}`;
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
        }
    },

    deleteConversation: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const success = await apiService.conversations.deleteConversation(id);

            if (success) {
                set(state => ({
                    conversations: state.conversations.filter(c => c.id !== id),
                    currentConversation: state.currentConversation?.id === id ? null : state.currentConversation,
                    messages: state.currentConversation?.id === id ? [] : state.messages,
                    isLoading: false
                }));
            } else {
                throw new Error(`Delete operation did not return success`);
            }
        } catch (error) {
            const errorMsg = `Failed to delete conversation #${id}`;
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
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
            const errorMsg = 'Failed to send message';
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
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
            const errorMsg = `Failed to rename message #${id}`;
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
        }
    },

    deleteMessage: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            const success = await apiService.messages.deleteMessage(id);

            if (success) {
                set(state => ({
                    messages: state.messages.filter(m => m.id !== id),
                    isLoading: false
                }));
            } else {
                throw new Error(`Delete operation did not return success`);
            }
        } catch (error) {
            const errorMsg = `Failed to delete message #${id}`;
            set({error: errorMsg, isLoading: false});
            return handleApiError(error, errorMsg);
        }
    },

    setConversations: (conversations: Conversation[]) => {
        set({conversations});
    }
}));

export default useConversationStore; 