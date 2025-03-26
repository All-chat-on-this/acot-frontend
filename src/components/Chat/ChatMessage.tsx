import React, {useState} from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import {Message} from '@/types';
import {FiCheck, FiEdit2, FiEye, FiEyeOff, FiX} from 'react-icons/fi';
import {colorTransition} from '@/styles/animations';

interface ChatMessageProps {
    message: Message;
    showThinking: boolean;
    onRename?: (id: number, newTitle: string) => Promise<void>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({message, showThinking, onRename}) => {
    const {t} = useTranslation();
    const [showThinkingText, setShowThinkingText] = useState(showThinking);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const toggleThinkingText = () => {
        setShowThinkingText(!showThinkingText);
    };

    const startEditing = () => {
        setEditValue(message.content);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const saveEditing = async () => {
        if (onRename && editValue.trim() !== message.content) {
            try {
                await onRename(message.id, editValue.trim());
            } catch (error) {
                console.error('Failed to rename message:', error);
            }
        }
        setIsEditing(false);
    };

    const isUser = message.role === 'user';
    const isAssistant = message.role === 'assistant';
    const isSystem = message.role === 'system';

    const hasThinkingText = isAssistant && message.thinkingText;

    // Animation variants
    const messageVariants = {
        initial: {
            opacity: 0,
            x: isUser ? 20 : isAssistant ? -20 : 0,
            y: isSystem ? 10 : 0
        },
        animate: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        hover: {
            scale: 1.01,
            transition: {duration: 0.15}
        }
    };

    return (
        <MessageContainer className={`role-${message.role} ${isEditing ? 'editing' : ''}`}>
            <motion.div
                variants={messageVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                style={{
                    width: isUser ? (isEditing ? '100%' : 'auto') : isSystem ? '100%' : 'auto',
                    marginLeft: isUser ? (isEditing ? '0' : 'auto') : 'initial',
                    marginRight: isUser ? '0' : 'initial'
                }}
            >
                <MessageContent
                    className={`
            ${isUser ? 'user' : ''} 
            ${isAssistant ? 'assistant' : ''} 
            ${isSystem ? 'system' : ''}
            ${isEditing ? 'editing' : ''}
          `}
                >
                    {isAssistant && (
                        <MessageHeader>
                            <MessageRole>{t('ai_assistant')}</MessageRole>
                            {hasThinkingText && (
                                <ThinkingToggle
                                    onClick={toggleThinkingText}
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    {showThinkingText ? <FiEyeOff size={14}/> : <FiEye size={14}/>}
                                    <span>{showThinkingText ? t('hide_thinking') : t('show_thinking')}</span>
                                </ThinkingToggle>
                            )}
                        </MessageHeader>
                    )}

                    {isUser && (
                        <MessageHeader>
                            <MessageRole>{t('you')}</MessageRole>
                            {onRename && !isEditing && (
                                <EditButton
                                    onClick={startEditing}
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <FiEdit2 size={14}/>
                                    <span>Edit</span>
                                </EditButton>
                            )}
                        </MessageHeader>
                    )}

                    {isSystem && <MessageRole>{t('system')}</MessageRole>}

                    <MessageText>
                        {isEditing ? (
                            <EditContainer>
                                <EditTextarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    autoFocus
                                />
                                <EditActions>
                                    <EditActionButton
                                        onClick={cancelEditing}
                                        className="cancel"
                                        whileHover={{opacity: 0.8}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <FiX size={14} style={{marginRight: '4px'}}/>
                                        {t('cancel')}
                                    </EditActionButton>
                                    <EditActionButton
                                        onClick={saveEditing}
                                        className="save"
                                        whileHover={{opacity: 0.8}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        <FiCheck size={14} style={{marginRight: '4px'}}/>
                                        {t('save')}
                                    </EditActionButton>
                                </EditActions>
                            </EditContainer>
                        ) : (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        )}
                    </MessageText>

                    <AnimatePresence>
                        {hasThinkingText && showThinkingText && (
                            <ThinkingText
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: 'auto'}}
                                exit={{opacity: 0, height: 0}}
                                transition={{duration: 0.3}}
                            >
                                <ThinkingTitle>{t('ai_thinking_process')}</ThinkingTitle>
                                <ReactMarkdown>{message.thinkingText || ''}</ReactMarkdown>
                            </ThinkingText>
                        )}
                    </AnimatePresence>

                    <MessageTime>
                        {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </MessageTime>
                </MessageContent>
            </motion.div>
        </MessageContainer>
    );
};

const MessageContainer = styled.div`
    margin: 16px 0;
    display: flex;

    &.role-user {
        justify-content: flex-end;

        &.editing {
            justify-content: center;
        }
    }

    &.role-assistant, &.role-system {
        justify-content: flex-start;
    }
`;

const MessageContent = styled.div`
    max-width: 80%;
    padding: 12px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    position: relative;
    transition: ${colorTransition};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &.user {
        background-color: ${({theme}) => theme.colors.userBubble};
        color: ${({theme}) => theme.colors.userBubbleText};
        border-top-right-radius: 4px;
        margin-left: auto;

        &.editing {
            max-width: 90%;
            margin-left: 0;
            margin-right: 0;
        }
    }

    &.assistant {
        background-color: ${({theme}) => theme.colors.assistantBubble};
        color: ${({theme}) => theme.colors.assistantBubbleText};
        border-top-left-radius: 4px;
        margin-right: auto;
    }

    &.system {
        background-color: ${({theme}) => theme.colors.systemBubble};
        color: ${({theme}) => theme.colors.systemBubbleText};
        width: 90%;
        margin: 0 auto;
        text-align: center;
    }

    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const MessageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
`;

const MessageRole = styled.div`
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 4px;
`;

const ThinkingToggle = styled(motion.button)`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    font-size: 0.75rem;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    padding: 0;
    transition: ${colorTransition};

    &:hover {
        opacity: 1;
    }

    span {
        margin-left: 4px;
    }
`;

const EditButton = styled(motion.button)`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    font-size: 0.75rem;
    color: inherit;
    opacity: 0;
    cursor: pointer;
    padding: 0;
    transition: ${colorTransition};

    span {
        margin-left: 4px;
    }

    ${MessageContent}:hover & {
        opacity: 0.7;

        &:hover {
            opacity: 1;
        }
    }
`;

const MessageText = styled.div`
    line-height: 1.5;
    padding: 0 4px;

    p {
        margin: 0 0 12px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    pre {
        overflow-x: auto;
        background-color: rgba(0, 0, 0, 0.05);
        padding: 8px;
        border-radius: 4px;
    }

    code {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 2px 4px;
        border-radius: 3px;
    }
`;

const ThinkingText = styled(motion.div)`
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    font-size: 0.9rem;
    opacity: 0.8;
    overflow: hidden;
`;

const ThinkingTitle = styled.div`
    font-weight: 600;
    margin-bottom: 6px;
    font-style: italic;
`;

const MessageTime = styled.div`
    font-size: 0.7rem;
    opacity: 0.6;
    text-align: right;
    margin-top: 4px;
`;

const EditContainer = styled.div`
    position: relative;
    width: 100%;
`;

const EditTextarea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 14px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
    background-color: ${({theme}) => theme.colors.input};
    color: ${({theme}) => theme.colors.text};
    resize: both;
    margin-bottom: 40px;
    max-width: 100%;
    overflow: auto;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary};
    }
`;

const EditActions = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 8px;
`;

const EditActionButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: none;
    border: none;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: ${colorTransition};
    white-space: nowrap;

    &.cancel {
        color: ${({theme}) => theme.colors.text};
        opacity: 0.7;
    }

    &.save {
        color: ${({theme}) => theme.colors.primary};
        font-weight: 500;
    }
`;

export default ChatMessage; 