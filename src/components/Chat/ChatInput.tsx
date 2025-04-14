import React, { useState, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiSend, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { colorTransition, ripple, spinner } from '@/styles/animations';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isRippling, setIsRippling] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      // Start ripple animation
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500);
      
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  return (
    <InputContainer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <InputForm
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
      >
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={t('type_message')}
          rows={1}
          disabled={isLoading}
        />
        <SendButton 
          onClick={handleSubmit} 
          disabled={!message.trim() || isLoading}
          title={t('send_message')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <LoadingIcon>
              <FiLoader size={16} />
            </LoadingIcon>
          ) : (
            <FiSend size={16} />
          )}
          {isRippling && <RippleEffect />}
        </SendButton>
      </InputForm>
      <HelpText>{t('enter_to_send')}</HelpText>
    </InputContainer>
  );
};

const InputContainer = styled(motion.div)`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.card};
`;

const InputForm = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${colorTransition};
`;

const TextArea = styled.textarea`
  flex: 1;
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius};
  padding: 12px 44px 12px 12px;
  resize: none;
  min-height: 48px;
  max-height: 500px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: ${colorTransition};

  &:focus {
    outline: none;
    border-color: ${({theme}) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({theme}) => theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SendButton = styled(motion.button)`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.buttonText};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: ${colorTransition};
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const RippleEffect = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: ${ripple} 0.6s linear;
`;

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${spinner} 1s linear infinite;
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  margin-top: 6px;
  text-align: right;
  opacity: 0.6;
`;

export default ChatInput; 