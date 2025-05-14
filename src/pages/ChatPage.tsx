import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import {Layout} from '@/components/Layout';
import {ChatInput, ChatMessage} from '@/components/Chat';
import useConversationStore from '@/store/conversationStore';
import useConfigStore from '@/store/configStore';
import usePreferenceStore from '@/store/preferenceStore.ts';
import {slideUp} from '@/styles/animations';
import useEncryption from '@/hooks/useEncryption';

const ChatPage: React.FC = () => {
    const {t} = useTranslation();
    const {id} = useParams<{ id: string }>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const {
        fetchConversation,
        currentConversation,
        messages,
        sendMessage,
        renameMessage,
        isLoading,
        error
    } = useConversationStore();

    const {currentConfig} = useConfigStore();
    const {preference} = usePreferenceStore();
    const {getOrCreateSecretKey} = useEncryption();

    useEffect(() => {
        if (id) {
            fetchConversation(Number(id)).catch(err => {
                console.error('Failed to fetch conversation:', err);
                setLocalError(err.message || t('conversation_fetch_error'));
            });
        }
    }, [id, fetchConversation, t]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!currentConfig) {
            setLocalError(t('configure_api_first'));
            return;
        }

        if (!currentConversation) {
            setLocalError(t('no_conversation_selected'));
            return;
        }

        try {
            setLocalError(null); // Clear any previous errors on success

            // Get the secret key if the API key is encrypted
            const secretKey = await getOrCreateSecretKey(currentConfig.id, currentConfig.name);

            // Send message with content and secretKey (if needed)
            await sendMessage(content, currentConfig.id, secretKey);
        } catch (err) {
            console.error('Send message error:', err);
            setLocalError(err instanceof Error ? err.message : t('message_send_error'));
        }
    };

    const handleRenameMessage = async (id: number, content: string) => {
        if (!currentConversation) {
            setLocalError(t('no_conversation_selected'));
            return;
        }

        try {
            // The UI will show a temporary message immediately
            // The actual update is handled by the store
            await renameMessage(id, content);
            setLocalError(null); // Clear any previous errors on success
        } catch (err) {
            console.error('Failed to rename message:', err);
            setLocalError(err instanceof Error ? err.message : t('message_rename_error'));
            throw err; // Propagate error back to component for UI handling
        }
    };

    // Animation variants
    const pageVariants = {
        initial: {opacity: 0},
        animate: {opacity: 1, transition: {duration: 0.3}},
        exit: {opacity: 0, transition: {duration: 0.2}}
    };

    if (!currentConversation && !isLoading) {
        return (
            <Layout>
                <EmptyState>
                    <motion.h2
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.2, duration: 0.5}}
                    >
                        {t('no_conversation_selected')}
                    </motion.h2>
                    <motion.p
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 0.8}}
                        transition={{delay: 0.3, duration: 0.5}}
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

                <MessagesContainer>
                    <AnimatePresence mode="wait">
                        {messages.length > 0 ? (
                            <MessagesList
                                key="messages"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.3}}
                            >
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        showThinking={preference.showThinking}
                                        onRename={message.role === 'user' ? handleRenameMessage : undefined}
                                    />
                                ))}
                                <div ref={messagesEndRef}/>
                            </MessagesList>
                        ) : (
                            <EmptyMessages
                                key="empty"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5}}
                            >
                                <motion.h3
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.2}}
                                >
                                    {t('no_messages')}
                                </motion.h3>
                                <motion.p
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.7}}
                                    transition={{delay: 0.4}}
                                >
                                    {t('start_conversation')}
                                </motion.p>
                            </EmptyMessages>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {(error || localError) && (
                            <ErrorMessage
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                            >
                                {error || localError}
                            </ErrorMessage>
                        )}
                    </AnimatePresence>
                </MessagesContainer>

                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading}/>
            </ChatContainer>
        </Layout>
    );
};

const ChatContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background-color: ${({theme}) => theme.colors.background};

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
        color: ${({theme}) => theme.colors.primary};
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
        color: ${({theme}) => theme.colors.primary};
    }

    p {
        opacity: 0.7;
        max-width: 500px;
        line-height: 1.6;
    }
`;

const ErrorMessage = styled(motion.div)`
    background-color: #ffdede;
    color: #d33;
    padding: 12px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    margin: 16px 0;
    text-align: center;
    animation: ${slideUp} 0.3s ease;
`;

export default ChatPage; 