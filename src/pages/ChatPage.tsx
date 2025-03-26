import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { ChatMessage, ChatInput } from '@/components/Chat';
import useConversationStore from '@/store/conversationStore';
import useConfigStore from '@/store/configStore';
import usePreferencesStore from '@/store/preferencesStore';
import { FiSettings, FiEye, FiEyeOff } from 'react-icons/fi';
import { fadeIn, slideUp } from '@/styles/animations';

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    fetchConversation, 
    currentConversation, 
    messages,
    sendMessage,
    renameMessage,
    isLoading,
    error 
  } = useConversationStore();
  
  const { currentConfig, fetchConfigs } = useConfigStore();
  const { preferences, toggleShowThinking } = usePreferencesStore();
  
  useEffect(() => {
    // Fetch configs first to ensure we have one selected
    fetchConfigs();
  }, [fetchConfigs]);
  
  useEffect(() => {
    if (id) {
      fetchConversation(Number(id));
    }
  }, [id, fetchConversation]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (content: string) => {
    if (!currentConfig) {
      alert(t('configure_api_first'));
      navigate('/config');
      return;
    }
    
    sendMessage(content, currentConfig.id);
  };
  
  const handleRenameMessage = async (id: number, content: string) => {
    try {
      await renameMessage(id, content);
    } catch (error) {
      console.error('Failed to rename message:', error);
    }
  };
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  if (!currentConversation && !isLoading) {
    return (
      <Layout>
        <EmptyState>
          <EmptyStateIcon 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('no_conversation_selected')}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {t('select_conversation')}
          </motion.p>
        </EmptyState>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ChatContainer 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ChatHeader>
          <ConversationTitle>
            {currentConversation?.title || 'Loading...'}
          </ConversationTitle>
          <ChatControls>
            <ControlButton 
              onClick={() => toggleShowThinking()}
              title={preferences.showThinking ? t('hide_thinking_process') : t('show_thinking_process')}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.95 }}
            >
              {preferences.showThinking ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </ControlButton>
            <ControlButton 
              onClick={() => navigate('/config')}
              title={t('api_configuration')}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSettings size={18} />
            </ControlButton>
          </ChatControls>
        </ChatHeader>
        
        <MessagesContainer>
          <AnimatePresence mode="wait">
            {messages.length > 0 ? (
              <MessagesList
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    showThinking={preferences.showThinking}
                    onRename={message.role === 'user' ? handleRenameMessage : undefined}
                  />
                ))}
                <div ref={messagesEndRef} />
              </MessagesList>
            ) : (
              <EmptyMessages
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t('no_messages')}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.4 }}
                >
                  {t('start_conversation')}
                </motion.p>
              </EmptyMessages>
            )}
          </AnimatePresence>
          
          {error && (
            <ErrorMessage 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {error}
            </ErrorMessage>
          )}
        </MessagesContainer>
        
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </ChatContainer>
    </Layout>
  );
};

const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
  z-index: 1;
`;

const ConversationTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  animation: ${fadeIn} 0.5s ease;
`;

const ChatControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(24, 144, 255, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const MessagesList = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const EmptyMessages = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 0.7;
  text-align: center;
  padding: 40px 0;
  
  h3 {
    margin-bottom: 8px;
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
  text-align: center;
  padding: 0 20px;
  
  h2 {
    margin-bottom: 16px;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    opacity: 0.7;
    max-width: 500px;
    line-height: 1.6;
  }
`;

const EmptyStateIcon = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.border};
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8zm0 14h-.333L9 18v-2.417l-.641-.247C5.67 14.301 4 12.256 4 10c0-3.309 3.589-6 8-6s8 2.691 8 6-3.589 6-8 6z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
`;

const ErrorMessage = styled(motion.div)`
  background-color: #ffdede;
  color: #d33;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin: 16px 0;
  text-align: center;
  animation: ${slideUp} 0.3s ease;
`;

export default ChatPage; 