import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {motion} from 'framer-motion';
import {Layout} from '@/components/Layout';
import usePreferenceStore from '@/store/preferenceStore';
import useUserStore from '@/store/userStore';
import {FiCheck, FiEdit, FiEye, FiGlobe, FiKey, FiUser, FiX} from 'react-icons/fi';
import {colorTransition} from '@/styles/animations';

// Dialog Component
interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({isOpen, title, message, onConfirm, onCancel}) => {
    const {t} = useTranslation();

    if (!isOpen) return null;

    return (
        <DialogOverlay>
            <DialogContainer>
                <DialogTitle>{title}</DialogTitle>
                <DialogMessage>{message}</DialogMessage>
                <DialogActions>
                    <DialogButton className="secondary" onClick={onCancel}>
                        {t('no')}
                    </DialogButton>
                    <DialogButton onClick={onConfirm}>
                        {t('yes')}
                    </DialogButton>
                </DialogActions>
            </DialogContainer>
        </DialogOverlay>
    );
};

const ProfilePage: React.FC = () => {
    const {t} = useTranslation();
    const {
        preference,
        updateLanguage,
        toggleShowThinking,
        toggleSaveApiKey,
        isLoading: preferenceLoading
    } = usePreferenceStore();
    const {
        user,
        getUserInformation,
        updateNickname,
        isLoading: userLoading,
        error,
        clearErrors
    } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [selectedLanguage, setSelectedLanguage] = useState(preference.language || 'en');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const isLoading = userLoading || preferenceLoading;

    // Fetch user information when component mounts
    useEffect(() => {
        getUserInformation();
    }, [getUserInformation]);

    useEffect(() => {
        // Update the selected language when preference changes
        setSelectedLanguage(preference.language || 'en');
    }, [preference.language]);

    useEffect(() => {
        // Reset nickname when user changes
        if (user?.nickname) {
            setNickname(user.nickname);
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setNickname(user?.nickname || '');
            clearErrors();
            setUpdateSuccess(false);
        }
    };

    const handleSave = async () => {
        if (nickname.trim() === '') return;

        const success = await updateNickname(nickname);

        if (success) {
            // Refresh user data after successful update
            getUserInformation();
            setUpdateSuccess(true);
            setIsEditing(false);
            // Hide success message after 3 seconds
            setTimeout(() => setUpdateSuccess(false), 3000);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNickname(user?.nickname || '');
        clearErrors();
        setUpdateSuccess(false);
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        updateLanguage(language);
    };

    const handleShowThinkingToggle = () => {
        toggleShowThinking();
    };

    const handleSaveApiKeyToggle = () => {
        if (preference.saveApiKey) {
            setDialogOpen(true);
        } else {
            toggleSaveApiKey();
        }
    };

    const handleConfirmToggleSaveApiKey = () => {
        toggleSaveApiKey();
        setDialogOpen(false);
    };

    const handleCancelToggleSaveApiKey = () => {
        setDialogOpen(false);
    };

    return (
        <Layout>
            <ProfileContainer>
                <PageTitle>{t('profile')}</PageTitle>

                <ProfileCard>
                    <ProfileHeader>
                        <UserAvatar>
                            {user?.nickname?.[0] || user?.username?.[0] || 'U'}
                        </UserAvatar>
                        <UsernameDisplay>{user?.nickname || user?.username}</UsernameDisplay>
                    </ProfileHeader>

                    <ProfileDetail>
                        <DetailLabel>
                            <FiUser size={16}/>
                            <span>{t('nickname')}</span>
                        </DetailLabel>

                        {isEditing ? (
                            <EditContainer>
                                <ProfileInput
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    autoFocus
                                    disabled={isLoading}
                                />
                                {error && <ErrorMessage>{error}</ErrorMessage>}
                                <EditActions>
                                    <ActionButton
                                        onClick={handleCancel}
                                        className="secondary"
                                        whileHover={{scale: 1.03, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                                        whileTap={{scale: 0.97}}
                                        disabled={isLoading}
                                    >
                                        <FiX size={16}/>
                                        <span>{t('cancel')}</span>
                                    </ActionButton>
                                    <ActionButton
                                        onClick={handleSave}
                                        whileHover={{scale: 1.03}}
                                        whileTap={{scale: 0.97}}
                                        disabled={isLoading || nickname.trim() === ''}
                                    >
                                        <FiCheck size={16}/>
                                        <span>{isLoading ? t('saving') : t('save')}</span>
                                    </ActionButton>
                                </EditActions>
                            </EditContainer>
                        ) : (
                            <DetailContainer>
                                <DetailValue>
                                    {user?.nickname || '-'}
                                    {updateSuccess && <SuccessIndicator>{t('updated_message')}</SuccessIndicator>}
                                </DetailValue>
                                <EditButton
                                    onClick={handleEditToggle}
                                    whileHover={{backgroundColor: 'rgba(24, 144, 255, 0.1)'}}
                                    whileTap={{scale: 0.95}}
                                >
                                    <FiEdit size={16}/>
                                </EditButton>
                            </DetailContainer>
                        )}
                    </ProfileDetail>

                    {/* Language Selection */}
                    <ProfileDetail>
                        <DetailLabel>
                            <FiGlobe size={16}/>
                            <span>{t('language')}</span>
                        </DetailLabel>
                        <LanguageOptions>
                            <LanguageOption
                                selected={selectedLanguage === 'en'}
                                onClick={() => handleLanguageChange('en')}
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                            >
                                {t('english')}
                            </LanguageOption>
                            <LanguageOption
                                selected={selectedLanguage === 'zh'}
                                onClick={() => handleLanguageChange('zh')}
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                            >
                                {t('chinese')}
                            </LanguageOption>
                        </LanguageOptions>
                    </ProfileDetail>

                    {/* Preference Settings Section */}
                    <SectionTitle>{t('preferences')}</SectionTitle>

                    {/* Show Thinking Toggle */}
                    <PreferenceItem>
                        <PreferenceInfo>
                            <PreferenceLabel>
                                <FiEye size={16}/>
                                <span>{t('show_thinking')}</span>
                            </PreferenceLabel>
                            <PreferenceDescription>{t('show_thinking_description')}</PreferenceDescription>
                        </PreferenceInfo>
                        <ToggleButton
                            active={preference.showThinking}
                            onClick={handleShowThinkingToggle}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            disabled={isLoading}
                        >
                            <ToggleText>{preference.showThinking ? t('on') : t('off')}</ToggleText>
                        </ToggleButton>
                    </PreferenceItem>

                    {/* Save API Key Toggle */}
                    <PreferenceItem>
                        <PreferenceInfo>
                            <PreferenceLabel>
                                <FiKey size={16}/>
                                <span>{t('save_api_key')}</span>
                            </PreferenceLabel>
                            <PreferenceDescription>{t('save_api_key_description')}</PreferenceDescription>
                        </PreferenceInfo>
                        <ToggleButton
                            active={preference.saveApiKey}
                            onClick={handleSaveApiKeyToggle}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            disabled={isLoading}
                        >
                            <ToggleText>{preference.saveApiKey ? t('on') : t('off')}</ToggleText>
                        </ToggleButton>
                    </PreferenceItem>
                </ProfileCard>
            </ProfileContainer>

            <ConfirmDialog
                isOpen={dialogOpen}
                title={t('save_api_key_confirm_title')}
                message={t('save_api_key_confirm_message')}
                onConfirm={handleConfirmToggleSaveApiKey}
                onCancel={handleCancelToggleSaveApiKey}
            />
        </Layout>
    );
};

const ProfileContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const PageTitle = styled.h1`
    font-size: 1.8rem;
    margin-bottom: 24px;
    color: ${({theme}) => theme.colors.primary};
`;

const ProfileCard = styled.div`
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

const UserAvatar = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 16px;
`;

const UsernameDisplay = styled.h2`
    font-size: 1.3rem;
    margin: 0;
`;

const ProfileDetail = styled.div`
    margin-bottom: 16px;
    padding: 12px;
    border-radius: ${({theme}) => theme.borderRadius};
    transition: ${colorTransition};

    &:hover {
        background-color: ${({theme}) => theme.colors.hover}10;
    }
`;

const DetailLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
`;

const DetailContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const DetailValue = styled.div`
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SuccessIndicator = styled.span`
    font-size: 0.8rem;
    color: ${({theme}) => theme.colors.success || '#52c41a'};
    background-color: ${({theme}) => theme.colors.success + '20' || 'rgba(82, 196, 26, 0.1)'};
    padding: 2px 8px;
    border-radius: 10px;
`;

const ErrorMessage = styled.div`
    color: ${({theme}) => theme.colors.error || '#f5222d'};
    font-size: 0.9rem;
    margin-top: 4px;
`;

const EditButton = styled(motion.button)`
    background: none;
    border: none;
    color: ${({theme}) => theme.colors.primary};
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const EditContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ProfileInput = styled.input`
    padding: 10px 12px;
    border-radius: ${({theme}) => theme.borderRadius};
    border: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({theme}) => theme.colors.input};
    color: ${({theme}) => theme.colors.text};
    font-size: 1rem;
    width: 100%;

    &:focus {
        border-color: ${({theme}) => theme.colors.primary};
        outline: none;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const EditActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const ActionButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    transition: ${colorTransition};

    &.secondary {
        background-color: transparent;
        color: ${({theme}) => theme.colors.text};
        border: 1px solid ${({theme}) => theme.colors.border};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LanguageOptions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 8px;
`;

interface LanguageOptionProps {
    selected: boolean;
}

const LanguageOption = styled(motion.button)<LanguageOptionProps>`
    padding: 8px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({selected, theme}) =>
            selected ? theme.colors.primary : 'transparent'};
    color: ${({selected, theme}) =>
            selected ? theme.colors.buttonText : theme.colors.text};
    border: 1px solid ${({selected, theme}) =>
            selected ? theme.colors.primary : theme.colors.border};
    cursor: pointer;
    font-size: 0.95rem;
    transition: ${colorTransition};

    &:hover {
        border-color: ${({theme}) => theme.colors.primary};
    }
`;

// New Styled Components for Preferences Section
const SectionTitle = styled.h3`
    font-size: 1.3rem;
    margin: 24px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    color: ${({theme}) => theme.colors.text};
`;

const PreferenceItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 12px;
    border-radius: ${({theme}) => theme.borderRadius};
    transition: ${colorTransition};

    &:hover {
        background-color: ${({theme}) => theme.colors.hover}10;
    }
`;

const PreferenceInfo = styled.div`
    flex: 1;
`;

const PreferenceLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    margin-bottom: 4px;
    color: ${({theme}) => theme.colors.text};
`;

const PreferenceDescription = styled.div`
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.textSecondary || theme.colors.text + '99'};
    margin-left: 24px;
`;

interface ToggleButtonProps {
    active: boolean;
    disabled?: boolean;
}

const ToggleButton = styled(motion.button)<ToggleButtonProps>`
    min-width: 64px;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: ${({active, theme}) =>
            active ? theme.colors.primary : theme.colors.textSecondary || '#999'};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 0.85rem;
    opacity: ${({disabled}) => disabled ? 0.6 : 1};
    cursor: ${({disabled}) => disabled ? 'not-allowed' : 'pointer'};
`;

const ToggleText = styled.span`
    font-weight: 600;
`;

// Dialog Styled Components
const DialogOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const DialogContainer = styled.div`
    background-color: ${({theme}) => theme.colors.dialogBackground};
    border-radius: ${({theme}) => theme.borderRadius};
    padding: 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: ${({theme}) => theme.blurAmount ? `blur(${theme.blurAmount})` : 'none'};
`;

const DialogTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.3rem;
    color: ${({theme}) => theme.colors.text};
`;

const DialogMessage = styled.p`
    margin-bottom: 24px;
    color: ${({theme}) => theme.colors.text};
    line-height: 1.5;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`;

const DialogButton = styled.button`
    padding: 8px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    cursor: pointer;
    font-size: 0.95rem;

    &.secondary {
        background-color: transparent;
        color: ${({theme}) => theme.colors.text};
        border: 1px solid ${({theme}) => theme.colors.border};
    }

    &:hover {
        opacity: 0.9;
    }
`;

export default ProfilePage; 