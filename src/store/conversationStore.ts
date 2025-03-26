import {create} from 'zustand';
import {Conversation, Message} from '@/types';

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 1
    },
    {
        id: 2, 
        title: 'Technical discussion', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 1
    }
];

const demoMessages: Record<number, Message[]> = {
    1: [
        {
            id: 1,
            conversationId: 1,
            role: 'system',
            content: 'You are a helpful AI assistant that discusses technology and ethics topics.',
            thinkingText: null,
            createdAt: new Date(Date.now() - 100000).toISOString()
        },
        {
            id: 2,
            conversationId: 1,
            role: 'user',
            content: 'What are the main ethical concerns with AI development?',
            thinkingText: null,
            createdAt: new Date(Date.now() - 80000).toISOString()
        },
        {
            id: 3,
            conversationId: 1,
            role: 'assistant',
            content: 'The main ethical concerns with AI development include:\n\n1. **Privacy and surveillance** - AI systems can monitor and collect vast amounts of personal data\n\n2. **Bias and discrimination** - AI can perpetuate or amplify existing societal biases\n\n3. **Autonomy and decision-making** - Questions around AI making important decisions affecting humans\n\n4. **Transparency and explainability** - Many AI systems function as "black boxes"\n\n5. **Job displacement** - Automation potentially replacing human workers\n\n6. **Security risks** - AI systems could be vulnerable to attacks or misuse\n\n7. **Accountability** - Determining responsibility when AI systems cause harm\n\nAddressing these concerns requires interdisciplinary collaboration between technologists, ethicists, policymakers, and the public.',
            thinkingText: 'I need to provide a comprehensive but organized response to this question about AI ethics. I should cover the major areas of concern that ethicists, researchers and policymakers frequently discuss.\n\nLet me think about the key categories of ethical issues:\n- Privacy concerns\n- Bias and fairness problems\n- Questions about autonomy\n- Explainability challenges\n- Economic impacts like job displacement\n- Security considerations\n- Accountability frameworks\n\nI should present these in a structured format with brief explanations of each, while keeping my tone informative but accessible.',
            createdAt: new Date(Date.now() - 60000).toISOString()
        }
    ],
    2: [
        {
            id: 4,
            conversationId: 2,
            role: 'system',
            content: 'You are a helpful AI assistant that provides technical explanations.',
            thinkingText: null,
            createdAt: new Date(Date.now() - 50000).toISOString()
        },
        {
            id: 5,
            conversationId: 2,
            role: 'user',
            content: 'Can you explain how transformers work in machine learning?',
            thinkingText: null,
            createdAt: new Date(Date.now() - 30000).toISOString()
        },
        {
            id: 6,
            conversationId: 2,
            role: 'assistant',
            content: 'Transformers are a type of neural network architecture introduced in the 2017 paper "Attention Is All You Need." They revolutionized natural language processing and have become the foundation for models like GPT, BERT, and T5.\n\nKey components of transformers include:\n\n1. **Self-Attention Mechanism**: Allows the model to weigh the importance of different words in a sequence when processing a specific word, capturing contextual relationships regardless of position.\n\n2. **Positional Encoding**: Since transformers process all words simultaneously (not sequentially like RNNs), positional encodings add information about word position in the sequence.\n\n3. **Encoder-Decoder Structure**: Original transformers had encoders to process input and decoders to generate output, though many modern models use only one of these components.\n\n4. **Multi-Head Attention**: Multiple attention mechanisms run in parallel, allowing the model to focus on different aspects of the input simultaneously.\n\n5. **Feed-Forward Networks**: After attention layers, each token is processed independently through feed-forward neural networks.\n\nTransformers can efficiently process sequences in parallel (unlike RNNs which are sequential), allowing for better scaling to larger datasets and models. This parallelization enables the pre-training of massive models on vast amounts of data, which can then be fine-tuned for specific tasks.',
            thinkingText: 'This is a technical question about transformer architecture in machine learning. I should provide a clear, structured explanation that covers the key components while being accessible.\n\nI\'ll start by explaining what transformers are and their significance, then break down the key components:\n\n1. Self-attention mechanism - the core innovation\n2. Positional encoding - how sequence order is maintained\n3. The overall encoder-decoder structure\n4. Multi-head attention - how multiple perspectives are captured\n5. Feed-forward networks - the processing after attention\n\nI should also mention why transformers were revolutionary - mainly their parallelization capabilities compared to previous sequential models like RNNs/LSTMs, and how this enabled scaling to much larger models and datasets.',
            createdAt: new Date(Date.now() - 10000).toISOString()
        }
    ]
};

const useConversationStore = create<ConversationState>((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        set({isLoading: true, error: null});
        try {
            // Mock API call - replace with actual API call when backend is ready
            // const response = await axios.get('/api/conversations');
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const conversations = demoConversations;

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
            // Mock API call - replace with actual API call when backend is ready
            // const response = await axios.get(`/api/conversations/${id}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            const conversation = demoConversations.find(c => c.id === id) || null;
            const messages = demoMessages[id] || [];

            if (!conversation) {
                throw new Error('Conversation not found');
            }

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
            // Mock API call - replace with actual API call when backend is ready
            // const response = await axios.post('/api/conversations', { title });
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            const newId = Math.max(0, ...demoConversations.map(c => c.id)) + 1;
            const newConversation: Conversation = {
                id: newId,
                title,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: 1, // Assuming current user id is 1
            };

            demoConversations.push(newConversation);
            demoMessages[newId] = [
                {
                    id: Math.max(0, ...Object.values(demoMessages).flat().map(m => m.id)) + 1,
                    conversationId: newId,
                    role: 'system',
                    content: 'You are a helpful AI assistant.',
                    thinkingText: null,
                    createdAt: new Date().toISOString()
                }
            ];

            set(state => ({
                conversations: [...state.conversations, newConversation],
                currentConversation: newConversation,
                messages: demoMessages[newId],
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
            // Mock API call - replace with actual API call when backend is ready
            // const response = await axios.put(`/api/conversations/${id}`, data);
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            const conversationIndex = demoConversations.findIndex(c => c.id === id);
            if (conversationIndex === -1) {
                throw new Error('Conversation not found');
            }

            demoConversations[conversationIndex] = {
                ...demoConversations[conversationIndex],
                ...data,
            };

            set(state => ({
                conversations: state.conversations.map(c => c.id === id ? {...c, ...data} : c),
                currentConversation: state.currentConversation?.id === id
                    ? {...state.currentConversation, ...data}
                    : state.currentConversation,
                isLoading: false
            }));

            return demoConversations[conversationIndex];
        } catch (error) {
            console.error('Failed to update conversation:', error);
            set({error: 'Failed to update conversation', isLoading: false});
            throw error;
        }
    },

    deleteConversation: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            // Mock API call - replace with actual API call when backend is ready
            // await axios.delete(`/api/conversations/${id}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            const index = demoConversations.findIndex(c => c.id === id);
            if (index === -1) {
                throw new Error('Conversation not found');
            }

            demoConversations.splice(index, 1);
            delete demoMessages[id];

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

            // Add user message to UI immediately
            const newMessageId = Math.max(0, ...Object.values(demoMessages).flat().map(m => m.id)) + 1;
            const userMessage: Message = {
                id: newMessageId,
                conversationId: currentConversation.id,
                role: 'user',
                content,
                thinkingText: null,
                createdAt: new Date().toISOString()
            };

            demoMessages[currentConversation.id] = [
                ...(demoMessages[currentConversation.id] || []),
                userMessage
            ];

            set(state => ({
                messages: [...state.messages, userMessage]
            }));

            // Mock API call to AI service - replace with actual API call when backend is ready
            // const response = await axios.post(`/api/conversations/${currentConversation.id}/messages`, {
            //   content,
            //   configId
            // });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

            // Simulate AI response
            const aiMessageId = newMessageId + 1;
            const aiMessage: Message = {
                id: aiMessageId,
                conversationId: currentConversation.id,
                role: 'assistant',
                content: `Thank you for your message: "${content}"\n\nThis is a simulated response since we're in development. In a real deployment, this would come from the configured AI service with ID ${configId}.`,
                thinkingText: 'This is a simulated thinking process.\n\nIn a real deployment, this would come from the AI service if it supports exposing reasoning steps.\n\nThe thinking text feature helps users understand the AI\'s reasoning process.',
                createdAt: new Date().toISOString()
            };

            demoMessages[currentConversation.id].push(aiMessage);

            set(state => ({
                messages: [...state.messages, aiMessage],
                isLoading: false
            }));

            return aiMessage;
        } catch (error) {
            console.error('Failed to send message:', error);
            set({error: 'Failed to send message', isLoading: false});
            throw error;
        }
    },

    renameMessage: async (id: number, content: string) => {
        set({isLoading: true, error: null});
        try {
            // Mock API call - replace with actual API call when backend is ready
            // const response = await axios.put(`/api/messages/${id}`, { content });
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            // Find the message in the demo data
            let updatedMessage: Message | null = null;
            let truncationPerformed = false;

            for (const convId in demoMessages) {
                const messageIndex = demoMessages[convId].findIndex(m => m.id === id);
                if (messageIndex !== -1) {
                    // Update the message content
                    demoMessages[convId][messageIndex] = {
                        ...demoMessages[convId][messageIndex],
                        content
                    };
                    updatedMessage = demoMessages[convId][messageIndex];
                    
                    // If it's a user message and there are messages after it, truncate them
                    if (updatedMessage.role === 'user' && messageIndex < demoMessages[convId].length - 1) {
                        // Remove all subsequent messages
                        demoMessages[convId] = demoMessages[convId].slice(0, messageIndex + 1);
                        truncationPerformed = true;
                    }
                    
                    break;
                }
            }

            if (!updatedMessage) {
                throw new Error('Message not found');
            }

            set(state => {
                let newMessages = state.messages.map(m => m.id === id ? {...m, content} : m);
                
                // If we should truncate, find the index and truncate the messages array
                if (truncationPerformed) {
                    const editedIndex = newMessages.findIndex(m => m.id === id);
                    if (editedIndex !== -1) {
                        newMessages = newMessages.slice(0, editedIndex + 1);
                    }
                }
                
                return {
                    messages: newMessages,
                    isLoading: false
                };
            });

            return updatedMessage;
        } catch (error) {
            console.error('Failed to rename message:', error);
            set({error: 'Failed to rename message', isLoading: false});
            throw error;
        }
    },

    deleteMessage: async (id: number) => {
        set({isLoading: true, error: null});
        try {
            // Mock API call - replace with actual API call when backend is ready
            // await axios.delete(`/api/messages/${id}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            // Find and remove the message from demo data
            for (const convId in demoMessages) {
                const messageIndex = demoMessages[convId].findIndex(m => m.id === id);
                if (messageIndex !== -1) {
                    demoMessages[convId].splice(messageIndex, 1);
                    break;
                }
            }

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