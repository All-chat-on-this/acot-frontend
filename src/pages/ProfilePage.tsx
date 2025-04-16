import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import useAuthStore from '@/store/authStore';
import { FiEdit, FiCheck, FiX, FiUser } from 'react-icons/fi';
import { colorTransition } from '@/styles/animations';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user?.nickname || '');

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setNickname(user?.nickname || '');
        }
    };

    const handleSave = async () => {
        // Here you would update the user's nickname in the database
        // For now, we'll just toggle editing mode off
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNickname(user?.nickname || '');
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
                        <UsernameDisplay>{user?.username}</UsernameDisplay>
                    </ProfileHeader>

                    <ProfileDetail>
                        <DetailLabel>
                            <FiUser size={16} />
                            <span>{t('nickname')}</span>
                        </DetailLabel>
                        
                        {isEditing ? (
                            <EditContainer>
                                <ProfileInput
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    autoFocus
                                />
                                <EditActions>
                                    <ActionButton
                                        onClick={handleCancel}
                                        className="secondary"
                                        whileHover={{ scale: 1.03, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <FiX size={16} />
                                        <span>{t('cancel')}</span>
                                    </ActionButton>
                                    <ActionButton
                                        onClick={handleSave}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <FiCheck size={16} />
                                        <span>{t('save')}</span>
                                    </ActionButton>
                                </EditActions>
                            </EditContainer>
                        ) : (
                            <DetailContainer>
                                <DetailValue>{user?.nickname || '-'}</DetailValue>
                                <EditButton
                                    onClick={handleEditToggle}
                                    whileHover={{ backgroundColor: 'rgba(24, 144, 255, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiEdit size={16} />
                                </EditButton>
                            </DetailContainer>
                        )}
                    </ProfileDetail>
                </ProfileCard>
            </ProfileContainer>
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

export default ProfilePage; 