import React from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {Layout} from '@/components/Layout';
import useAuthStore from '@/store/authStore';
import {FiSettings, FiUser} from 'react-icons/fi';

const HomePage: React.FC = () => {
    const {t} = useTranslation();
    const {isAuthenticated, user} = useAuthStore();
    const navigate = useNavigate();

    return (
        <Layout>
            <HomeContainer>
                <HeroSection>
                    <HeroTitle>{t('welcome')}</HeroTitle>
                    <HeroSubtitle>{t('app_full_name')} - {t('app_description')}</HeroSubtitle>

                    {isAuthenticated ? (
                        <WelcomeMessage>
                            {t('welcome_back')} <strong>{user?.nickname || user?.username}</strong>!
                        </WelcomeMessage>
                    ) : (
                        <LoginPrompt>
                            <LoginButton onClick={() => navigate('/login')}>
                                {t('login_to_start')}
                            </LoginButton>
                            <RegisterPrompt>
                                {t('no_account')} <RegisterLink
                                onClick={() => navigate('/register')}>{t('register')}</RegisterLink>
                            </RegisterPrompt>
                        </LoginPrompt>
                    )}
                </HeroSection>

                {isAuthenticated && (
                    <ActionCards>
                        <ActionCard onClick={() => navigate('/config')}>
                            <ActionIcon>
                                <FiSettings size={32}/>
                            </ActionIcon>
                            <ActionTitle>{t('configure_api')}</ActionTitle>
                            <ActionDescription>
                                {t('configure_api_desc')}
                            </ActionDescription>
                        </ActionCard>

                        <ActionCard onClick={() => navigate('/profile')}>
                            <ActionIcon>
                                <FiUser size={32}/>
                            </ActionIcon>
                            <ActionTitle>{t('profile')}</ActionTitle>
                            <ActionDescription>
                                {t('profile_desc')}
                            </ActionDescription>
                        </ActionCard>
                    </ActionCards>
                )}

                <FeatureSection>
                    <SectionTitle>{t('key_features')}</SectionTitle>
                    <Features>
                        <Feature>
                            <FeatureTitle>{t('feature_custom_api')}</FeatureTitle>
                            <FeatureDescription>
                                {t('feature_custom_api_desc')}
                            </FeatureDescription>
                        </Feature>

                        <Feature>
                            <FeatureTitle>{t('feature_thought_chain')}</FeatureTitle>
                            <FeatureDescription>
                                {t('feature_thought_chain_desc')}
                            </FeatureDescription>
                        </Feature>

                        <Feature>
                            <FeatureTitle>{t('feature_ui')}</FeatureTitle>
                            <FeatureDescription>
                                {t('feature_ui_desc')}
                            </FeatureDescription>
                        </Feature>
                    </Features>
                </FeatureSection>
            </HomeContainer>
        </Layout>
    );
};

const HomeContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const HeroSection = styled.div`
    text-align: center;
    margin-bottom: 40px;
    padding: 60px 20px;
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.colors.card};
`;

const HeroTitle = styled.h1`
    font-size: 2.5rem;
    margin: 0 0 16px;
    color: ${({theme}) => theme.colors.primary};
`;

const HeroSubtitle = styled.h2`
    font-size: 1.2rem;
    font-weight: normal;
    margin: 0 0 40px;
    opacity: 0.8;
`;

const WelcomeMessage = styled.div`
    font-size: 1.2rem;
    margin-bottom: 30px;
`;

const LoginPrompt = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LoginButton = styled.button`
    padding: 12px 24px;
    font-size: 1rem;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius};
    cursor: pointer;
    margin-bottom: 12px;

    &:hover {
        opacity: 0.9;
    }
`;

const RegisterPrompt = styled.div`
    font-size: 0.9rem;
`;

const RegisterLink = styled.span`
    color: ${({theme}) => theme.colors.primary};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const ActionCards = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
`;

const ActionCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
`;

const ActionIcon = styled.div`
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme}) => theme.colors.card};
    border-radius: 50%;
    margin-bottom: 16px;
    color: ${({theme}) => theme.colors.primary};
`;

const ActionTitle = styled.h3`
    font-size: 1.2rem;
    margin: 0 0 8px;
`;

const ActionDescription = styled.p`
    text-align: center;
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
`;

const FeatureSection = styled.div`
    margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    margin: 0 0 24px;
    text-align: center;
`;

const Features = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
`;

const Feature = styled.div`
    padding: 24px;
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
`;

const FeatureTitle = styled.h3`
    font-size: 1.2rem;
    margin: 0 0 12px;
    color: ${({theme}) => theme.colors.primary};
`;

const FeatureDescription = styled.p`
    margin: 0;
    opacity: 0.8;
    line-height: 1.5;
`;

export default HomePage; 