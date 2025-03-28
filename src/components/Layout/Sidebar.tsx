import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import {NavLink, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import {FiMessageSquare, FiPlus, FiSearch, FiSettings, FiX, FiEdit2, FiCheck} from 'react-icons/fi';
import useConversationStore from '@/store/conversationStore';
import usePreferencesStore from '@/store/preferencesStore';
import {colorTransition, fadeIn, slideUp} from '@/styles/animations';

interface SidebarProps {
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({isMobileOpen, onMobileClose}) => {
    const {t} = useTranslation();
    const {conversations, fetchConversations, createConversation, updateConversation} = useConversationStore();
    const {preferences} = usePreferencesStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingConversationId, setEditingConversationId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const isGlassEffect = preferences.theme === 'dreamlikeColorLight' || preferences.theme === 'dreamlikeColorDark';
    const isOpen = isMobileOpen !== undefined ? isMobileOpen : true;

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Setup click outside handler to cancel editing
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (editingConversationId && formRef.current && !formRef.current.contains(event.target as Node)) {
                setEditingConversationId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingConversationId]);

    const handleNewConversation = async () => {
        try {
            const newConversation = await createConversation('New Conversation');
            navigate(`/chat/${newConversation.id}`);
        } catch (error) {
            console.error('Failed to create new conversation:', error);
        }
    };

    const handleEditConversation = (conversationId: number, title: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingConversationId(conversationId);
        setEditTitle(title);
        setTimeout(() => {
            editInputRef.current?.focus();
            editInputRef.current?.select();
        }, 10);
    };

    const handleSaveTitle = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingConversationId && editTitle.trim()) {
            try {
                await updateConversation(editingConversationId, { title: editTitle.trim() });
                setEditingConversationId(null);
            } catch (error) {
                console.error('Failed to update conversation title:', error);
            }
        }
    };

    const handleNavigation = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Animation variants
    const sidebarVariants = {
        hidden: {
            x: '-100%',
            opacity: 0
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            x: '-100%',
            opacity: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, x: -20},
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        })
    };

    return (
        <>
            <SidebarOverlay
                className={isMobileOpen ? 'active' : ''}
                onClick={onMobileClose}
                initial={{opacity: 0}}
                animate={isMobileOpen ? {opacity: 1} : {opacity: 0}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
            />

            <AnimatePresence mode="wait">
                {(isMobileOpen || window.innerWidth >= 992) && (
                    <SidebarContainer
                        className={isGlassEffect ? 'glass-effect' : ''}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={sidebarVariants}
                    >
                        <SidebarHeader>
                            <SearchContainer>
                                <SearchInput
                                    type="text"
                                    placeholder={t('search_conversations')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <SearchIcon>
                                    <FiSearch/>
                                </SearchIcon>
                            </SearchContainer>
                            {onMobileClose && (
                                <CloseButton onClick={onMobileClose}>
                                    <FiX size={24}/>
                                </CloseButton>
                            )}
                        </SidebarHeader>

                        <NewConversationButton
                            onClick={handleNewConversation}
                            whileHover={{scale: 1.03}}
                            whileTap={{scale: 0.97}}
                        >
                            <FiPlus size={18}/>
                            <span>{t('new_conversation')}</span>
                        </NewConversationButton>

                        <NavSection>
                            <NavSectionTitle>{t('conversations')}</NavSectionTitle>
                            <ConversationList>
                                {filteredConversations.length > 0 ? (
                                    filteredConversations.map((conversation, index) => (
                                        <div key={conversation.id}>
                                            {editingConversationId === conversation.id ? (
                                                <ConversationEditForm 
                                                    onSubmit={handleSaveTitle} 
                                                    ref={formRef}
                                                >
                                                    <ConversationEditInput
                                                        ref={editInputRef}
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                    />
                                                    <ConversationEditActions>
                                                        <EditActionButton 
                                                            type="submit"
                                                            className="save"
                                                        >
                                                            <FiCheck size={14} />
                                                        </EditActionButton>
                                                    </ConversationEditActions>
                                                </ConversationEditForm>
                                            ) : (
                                                <ConversationItem
                                                    to={`/chat/${conversation.id}`}
                                                    onClick={handleNavigation}
                                                    custom={index}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={({isActive}) => isActive ? 'active' : ''}
                                                >
                                                    <FiMessageSquare size={16}/>
                                                    <ConversationTitle>{conversation.title}</ConversationTitle>
                                                    <EditConversationButton 
                                                        onClick={(e) => handleEditConversation(conversation.id, conversation.title, e)}
                                                        whileHover={{ opacity: 1 }}
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </EditConversationButton>
                                                </ConversationItem>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState>
                                        {searchTerm
                                            ? t('no_search_results')
                                            : t('no_conversations')}
                                    </EmptyState>
                                )}
                            </ConversationList>
                        </NavSection>

                        <NavSection>
                            <NavItem
                                to="/config"
                                onClick={handleNavigation}
                                whileHover={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FiSettings size={16}/>
                                <span>{t('api_configurations')}</span>
                            </NavItem>
                        </NavSection>
                    </SidebarContainer>
                )}
            </AnimatePresence>
        </>
    );
};

const SidebarOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 995;
    opacity: 0;
    visibility: hidden;
    transition: ${colorTransition};

    &.active {
        opacity: 1;
        visibility: visible;
    }

    @media (min-width: 992px) {
        display: none;
    }
`;

const SidebarContainer = styled(motion.aside)`
    position: fixed;
    top: 60px;
    left: 0;
    width: 250px;
    height: calc(100vh - 60px);
    background-color: ${({theme}) => theme.colors.sidebar};
    border-right: 1px solid ${({theme}) => theme.colors.border};
    display: flex;
    flex-direction: column;
    z-index: 996;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    &.glass-effect {
        background-color: transparent;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

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

    @media (max-width: 991px) {
        width: 280px;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
    }
`;

const SidebarHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

const SearchContainer = styled.div`
    position: relative;
    flex: 1;
    animation: ${fadeIn} 0.3s ease;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px 8px 32px;
    border-radius: ${({theme}) => theme.borderRadius};
    border: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({theme}) => theme.colors.input};
    color: ${({theme}) => theme.colors.text};
    font-size: 0.9rem;
    transition: ${colorTransition};

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.primary}30;
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({theme}) => theme.colors.inputText};
    opacity: 0.5;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

const NewConversationButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px;
    padding: 10px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius};
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: ${colorTransition};

    svg {
        margin-right: 8px;
    }
`;

const NavSection = styled.div`
    margin-bottom: 15px;

    &:last-child {
        margin-top: auto;
        border-top: 1px solid ${({theme}) => theme.colors.border};
        padding-top: 15px;
    }
`;

const NavSectionTitle = styled.h3`
    padding: 0 15px;
    margin: 10px 0;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.6;
`;

const ConversationList = styled.div`
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    animation: ${slideUp} 0.3s ease;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(24, 144, 255, 0.3);
        border-radius: 2px;
    }
`;

const ConversationItem = styled(motion(NavLink))`
    display: flex;
    align-items: center;
    padding: 10px 15px;
    color: ${({theme}) => theme.colors.text};
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: ${colorTransition};
    position: relative;

    &.active {
        background-color: rgba(24, 144, 255, 0.08);
        border-left-color: ${({theme}) => theme.colors.primary};
    }

    svg {
        margin-right: 10px;
        color: ${({theme}) => theme.colors.primary};
    }
`;

const ConversationTitle = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
`;

const NavItem = styled(motion(NavLink))`
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: ${({theme}) => theme.colors.text};
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: ${colorTransition};

    &.active {
        background-color: rgba(24, 144, 255, 0.08);
        border-left-color: ${({theme}) => theme.colors.primary};
    }

    svg {
        margin-right: 10px;
        color: ${({theme}) => theme.colors.primary};
    }
`;

const EmptyState = styled.div`
    padding: 20px 15px;
    text-align: center;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.6;
    font-size: 0.9rem;
    animation: ${fadeIn} 0.3s ease;
`;

// New styled components for conversation editing
const EditConversationButton = styled(motion.button)`
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.text};
    opacity: 0;
    margin-left: 8px;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    ${ConversationItem}:hover & {
        opacity: 0.5;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

const ConversationEditForm = styled.form`
    display: flex;
    padding: 6px 10px;
    margin: 2px 0;
    position: relative;
`;

const ConversationEditInput = styled.input`
    width: 100%;
    padding: 6px 8px;
    border: 1px solid ${({theme}) => theme.colors.primary};
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.colors.input};
    color: ${({theme}) => theme.colors.text};
    font-size: 0.9rem;
    padding-right: 80px; /* Increased space for action button with text */

    &:focus {
        outline: none;
    }
`;

const ConversationEditActions = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 4px;
`;

const EditActionButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 8px;

    &.save {
        color: ${({theme}) => theme.colors.primary || '#4caf50'};
        
        &:hover {
            background-color: rgba(76, 175, 80, 0.1);
        }

        span {
            margin-left: 4px;
            font-size: 0.85rem;
        }
    }
`;

export default Sidebar; 