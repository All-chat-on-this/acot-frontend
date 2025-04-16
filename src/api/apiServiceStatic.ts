import axios from 'axios';

// Define API endpoints (in a real app, these would be loaded from environment variables)
const API_BASE_URL = '/api';

// Configure axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('acot-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data
const mockUsers = [
  { id: 1, username: 'demo', nickname: 'Demo User', password: 'password' }
];

const mockConversations = [
  { id: 1, userId: 1, title: 'My first conversation', createdAt: '2023-08-10T12:00:00Z', updatedAt: '2023-08-10T12:30:00Z' },
  { id: 2, userId: 1, title: 'Testing ACOT features', createdAt: '2023-08-15T10:00:00Z', updatedAt: '2023-08-15T11:45:00Z' }
];

const mockMessages = [
  { id: 1, conversationId: 1, role: 'user', content: 'Hello, how can you help me?', thinkingText: null, createdAt: '2023-08-10T12:00:00Z' },
  { id: 2, conversationId: 1, role: 'assistant', content: 'Hi there! I\'m an AI assistant. I can help you with various tasks like answering questions, writing content, and more. What would you like help with today?', thinkingText: 'This appears to be a greeting from a human user. I should respond with a friendly introduction explaining my capabilities.', createdAt: '2023-08-10T12:00:05Z' },
  { id: 3, conversationId: 1, role: 'user', content: 'Can you explain what ACOT is?', thinkingText: null, createdAt: '2023-08-10T12:01:00Z' },
  { id: 4, conversationId: 1, role: 'assistant', content: 'ACOT stands for "All Chat On This." It\'s a highly customizable AI API platform that allows you to configure and interact with various AI models through a unified interface. You can set up different API endpoints, customize request/response formats, and even view the AI\'s thinking process when available. It offers features like theme customization, conversation management, and data import/export.', thinkingText: 'I need to explain what ACOT is. ACOT is "All Chat On This," a platform for customizable AI interactions through different APIs. I should cover its key features: API configuration, request/response customization, thought chain visibility, theme options, and data management.', createdAt: '2023-08-10T12:01:10Z' }
];

const mockConfigs = [
  {
    id: 1,
    userId: 1,
    name: 'ChatGPT-like Config',
    apiUrl: 'https://api.example.com/chat/completions',
    apiKey: 'sk-mock12345',
    headers: {
      'Content-Type': 'application/json'
    },
    requestTemplate: {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' }
      ],
      temperature: 0.7
    },
    responseTemplate: {
      roleField: 'choices[0].message.role',
      contentField: 'choices[0].message.content',
      thinkingTextField: null
    }
  },
  {
    id: 2,
    userId: 1,
    name: 'Claude Config with Thinking',
    apiUrl: 'https://api.example.com/claude/chat',
    apiKey: 'sk-claude-mock12345',
    headers: {
      'Content-Type': 'application/json',
      'Anthropic-Version': '2023-06-01'
    },
    requestTemplate: {
      model: 'claude-2',
      messages: [
        { role: 'user', content: '' }
      ],
      max_tokens: 1000,
      temperature: 0.7
    },
    responseTemplate: {
      roleField: 'role',
      contentField: 'content',
      thinkingTextField: 'thinking'
    }
  }
];

// Auth APIs
const authService = {
  login: async (username: string, password: string) => {
    // Mock login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
          // Create a mock token
          const token = `mock-token-${user.id}-${Date.now()}`;
          localStorage.setItem('acot-token', token);
          localStorage.setItem('acot-user', JSON.stringify({ id: user.id, username: user.username, nickname: user.nickname }));
          resolve({ token, user: { id: user.id, username: user.username, nickname: user.nickname } });
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 500);
    });
  },
  
  register: async (username: string, password: string, nickname: string) => {
    // Mock register
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.username === username);
        if (existingUser) {
          reject(new Error('Username already exists'));
        } else {
          const newUser = { id: mockUsers.length + 1, username, password, nickname };
          mockUsers.push(newUser);
          // Create a mock token
          const token = `mock-token-${newUser.id}-${Date.now()}`;
          localStorage.setItem('acot-token', token);
          localStorage.setItem('acot-user', JSON.stringify({ id: newUser.id, username: newUser.username, nickname: newUser.nickname }));
          resolve({ token, user: { id: newUser.id, username: newUser.username, nickname: newUser.nickname } });
        }
      }, 500);
    });
  },
  
  logout: async () => {
    // Mock logout
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('acot-token');
        localStorage.removeItem('acot-user');
        resolve(true);
      }, 200);
    });
  },
  
  getCurrentUser: () => {
    const userJson = localStorage.getItem('acot-user');
    return userJson ? JSON.parse(userJson) : null;
  }
};

// Conversation APIs
const conversationService = {
  getConversations: async () => {
    // Mock get all conversations
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.getCurrentUser();
        if (!user) resolve([]);
        const userConversations = mockConversations.filter(c => c.userId === user.id);
        resolve(userConversations);
      }, 300);
    });
  },
  
  getConversation: async (id: number) => {
    // Mock get conversation by id
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const conversation = mockConversations.find(c => c.id === id);
        if (conversation) {
          resolve(conversation);
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 200);
    });
  },
  
  createConversation: async (title: string) => {
    // Mock create conversation
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.getCurrentUser();
        const newConversation = {
          id: mockConversations.length + 1,
          userId: user.id,
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockConversations.push(newConversation);
        resolve(newConversation);
      }, 300);
    });
  },
  
  updateConversation: async (id: number, title: string) => {
    // Mock update conversation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockConversations.findIndex(c => c.id === id);
        if (index !== -1) {
          mockConversations[index] = {
            ...mockConversations[index],
            title,
            updatedAt: new Date().toISOString()
          };
          resolve(mockConversations[index]);
        } else {
          reject(new Error('Conversation not found'));
        }
      }, 300);
    });
  },
  
  deleteConversation: async (id: number) => {
    // Mock delete conversation
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockConversations.findIndex(c => c.id === id);
        if (index !== -1) {
          mockConversations.splice(index, 1);
        }
        resolve(true);
      }, 300);
    });
  }
};

// Message APIs
const messageService = {
  getMessages: async (conversationId: number) => {
    // Mock get messages for a conversation
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = mockMessages.filter(m => m.conversationId === conversationId);
        resolve(messages);
      }, 300);
    });
  },
  
  sendMessage: async (conversationId: number, content: string, configId: number) => {
    // Mock send message and get AI response
    return new Promise((resolve) => {
      setTimeout(() => {
        // First add the user message
        const userMessage = {
          id: mockMessages.length + 1,
          conversationId,
          role: 'user',
          content,
          thinkingText: null,
          createdAt: new Date().toISOString()
        };
        mockMessages.push(userMessage);
        
        // Then generate an AI response
        const config = mockConfigs.find(c => c.id === configId);
        const showThinking = config?.responseTemplate.thinkingTextField !== null;
        
        // Simple mock response - in a real app, this would call the configured API
        const aiResponse = {
          id: mockMessages.length + 1,
          conversationId,
          role: 'assistant',
          content: `This is a mock response to: "${content}". I'm responding as if I'm the AI model configured in "${config?.name}".`,
          thinkingText: showThinking ? `I'm analyzing the user's message: "${content}". This is a mock thinking text that would normally be generated by the AI model.` : null,
          createdAt: new Date().toISOString()
        };
        
        // Add a delay to simulate AI thinking
        setTimeout(() => {
          mockMessages.push(aiResponse);
          resolve([userMessage, aiResponse]);
        }, 1000);
      }, 300);
    });
  }
};

// Configuration APIs
const configService = {
  getConfigs: async () => {
    // Mock get all configurations
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.getCurrentUser();
        if (!user) resolve([]);
        const userConfigs = mockConfigs.filter(c => c.userId === user.id);
        resolve(userConfigs);
      }, 300);
    });
  },
  
  getConfig: async (id: number) => {
    // Mock get configuration by id
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const config = mockConfigs.find(c => c.id === id);
        if (config) {
          resolve(config);
        } else {
          reject(new Error('Configuration not found'));
        }
      }, 200);
    });
  },
  
  createConfig: async (configData: any) => {
    // Mock create configuration
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = authService.getCurrentUser();
        const newConfig = {
          id: mockConfigs.length + 1,
          userId: user.id,
          ...configData
        };
        mockConfigs.push(newConfig);
        resolve(newConfig);
      }, 300);
    });
  },
  
  updateConfig: async (id: number, configData: any) => {
    // Mock update configuration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockConfigs.findIndex(c => c.id === id);
        if (index !== -1) {
          mockConfigs[index] = {
            ...mockConfigs[index],
            ...configData
          };
          resolve(mockConfigs[index]);
        } else {
          reject(new Error('Configuration not found'));
        }
      }, 300);
    });
  },
  
  deleteConfig: async (id: number) => {
    // Mock delete configuration
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockConfigs.findIndex(c => c.id === id);
        if (index !== -1) {
          mockConfigs.splice(index, 1);
        }
        resolve(true);
      }, 300);
    });
  },
  
  testConfig: async (configData: any) => {
    // Mock test configuration
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock response indicating success or failure
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
          resolve({
            success: true,
            message: 'Connection successful!',
            response: {
              role: 'assistant',
              content: 'Hello! This is a test response from the AI model.',
              thinking: configData.responseTemplate.thinkingTextField ? 'This is a test thinking text.' : null
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Connection failed. Please check your API URL and credentials.',
            error: 'Invalid API key'
          });
        }
      }, 1000);
    });
  },
  
  getModelStatus: async (configId: number) => {
    // Mock getting model status
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          models: [
            {
              id: "gpt-3.5-turbo",
              object: "model",
              created: 1677610602,
              owned_by: "openai",
              permission: [
                {
                  id: "modelperm-7gh4GtM9Gi52bBENz6hOiGkQ",
                  object: "model_permission",
                  created: 1694208232,
                  allow_create_engine: false,
                  allow_sampling: true,
                  allow_logprobs: true,
                  allow_search_indices: false,
                  allow_view: true,
                  allow_fine_tuning: false,
                  organization: "*",
                  group: null,
                  is_blocking: false
                }
              ],
              root: "gpt-3.5-turbo",
              parent: null
            },
            {
              id: "gpt-4",
              object: "model",
              created: 1687882411,
              owned_by: "openai",
              permission: [
                {
                  id: "modelperm-nQn8GQbuBcJr8eAZ9XTJzhEU",
                  object: "model_permission",
                  created: 1694213596,
                  allow_create_engine: false,
                  allow_sampling: true,
                  allow_logprobs: true,
                  allow_search_indices: false,
                  allow_view: true,
                  allow_fine_tuning: false,
                  organization: "*",
                  group: null,
                  is_blocking: false
                }
              ],
              root: "gpt-4",
              parent: null
            }
          ],
          object: "list",
          data: [
            {
              id: "gpt-3.5-turbo",
              object: "model",
              created: 1677610602,
              owned_by: "openai"
            },
            {
              id: "gpt-4",
              object: "model",
              created: 1687882411,
              owned_by: "openai"
            }
          ]
        });
      }, 800);
    });
  }
};

// User preferences and settings
const preferencesService = {
  getPreferences: async () => {
    // Mock get user preferences
    return new Promise((resolve) => {
      setTimeout(() => {
        const theme = localStorage.getItem('acot-theme') || 'dreamlikeColorLight';
        const showThinking = localStorage.getItem('acot-show-thinking') === 'true';
        const saveHistory = localStorage.getItem('acot-save-history') === 'true' || true;
        resolve({ theme, showThinking, saveHistory });
      }, 200);
    });
  },
  
  updatePreferences: async (preferences: any) => {
    // Mock update user preferences
    return new Promise((resolve) => {
      setTimeout(() => {
        if (preferences.theme) {
          localStorage.setItem('acot-theme', preferences.theme);
        }
        if (preferences.showThinking !== undefined) {
          localStorage.setItem('acot-show-thinking', preferences.showThinking.toString());
        }
        if (preferences.saveHistory !== undefined) {
          localStorage.setItem('acot-save-history', preferences.saveHistory.toString());
        }
        resolve(preferences);
      }, 200);
    });
  }
};

// Export all services
const apiService = {
  auth: authService,
  conversations: conversationService,
  messages: messageService,
  configs: configService,
  preferences: preferencesService
};

export default apiService; 