import React, {FormEvent, useState, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {Layout} from '@/components/Layout';
import useAuthStore from '@/store/authStore';
import {FiAlertTriangle, FiLock, FiUser} from 'react-icons/fi';
import {SiTencentqq} from 'react-icons/si';

// Social login type constant for URL parameter
const QQ_SOCIAL_TYPE = 1;

const LoginPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {
        login, 
        isLoading, 
        error, 
        isAuthenticated, 
        clearErrors, 
        qqLogin,
        getQQAuthorizeUrl
    } = useAuthStore();

    // Clear errors when component mounts or unmounts
    useEffect(() => {
        clearErrors();
        return () => clearErrors();
    }, [clearErrors]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Handle QQ OAuth callback
    useEffect(() => {
        const handleQQCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const state = params.get('state');
            const error = params.get('error');
            const socialTypeParam = params.get('social_type');
            
            if (error) {
                console.error('QQ login error:', error);
                return;
            }
            
            if (code && state && socialTypeParam && parseInt(socialTypeParam, 10) === QQ_SOCIAL_TYPE) {
                try {
                    await qqLogin(code, state);
                    navigate('/');
                } catch (err) {
                    console.error('Failed to complete QQ login:', err);
                }
            }
        };
        
        handleQQCallback();
    }, [location, qqLogin, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            return;
        }

        try {
            await login(username, password);
            // Navigate will happen automatically via the useEffect above
        } catch (error) {
            console.error('Login failed:', error);
            // Error state is already set in the store
        }
    };

    const handleQQLogin = async () => {
        try {
            // Create a state parameter with a random string for security

            // The redirect URI should point back to this login page
            const redirectUri = `${window.location.origin}/login?social_type=${QQ_SOCIAL_TYPE}`;
            
            const authorizeUrl = await getQQAuthorizeUrl(redirectUri);
            
            if (authorizeUrl) {
                // Redirect to the authorization URL
                window.location.href = authorizeUrl;
            }
        } catch (error) {
            console.error('Failed to initiate QQ login:', error);
        }
    };

    return (
        <Layout showSidebar={false}>
            <LoginContainer>
                <LoginForm onSubmit={handleSubmit}>
                    <FormHeader>
                        <LogoText>{t('app_name')}</LogoText>
                        <FormTitle>{t('login_title')}</FormTitle>
                        <FormSubtitle>{t('login_subtitle')}</FormSubtitle>
                    </FormHeader>

                    {error && (
                        <ErrorMessage>
                            <FiAlertTriangle size={18}/>
                            <ErrorText>{error}</ErrorText>
                        </ErrorMessage>
                    )}

                    <FormGroup>
                        <FormLabel>
                            <FiUser/>
                            <span>{t('username')}</span>
                        </FormLabel>
                        <FormInput
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('enter_username')}
                            required
                            disabled={isLoading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            <FiLock/>
                            <span>{t('password')}</span>
                        </FormLabel>
                        <FormInput
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('enter_password')}
                            required
                            disabled={isLoading}
                        />
                    </FormGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? t('logging_in') : t('login')}
                    </SubmitButton>

                    <Divider>
                        <DividerText>{t('or')}</DividerText>
                    </Divider>

                    <SocialButtons>
                        <SocialButton 
                            type="button" 
                            onClick={handleQQLogin} 
                            disabled={isLoading}
                        >
                            <SiTencentqq />
                            <span>{t('login_with_qq')}</span>
                        </SocialButton>
                    </SocialButtons>

                    <FormFooter>
                        <span>{t('no_account')}</span>
                        <RegisterLink to="/register">{t('register')}</RegisterLink>
                    </FormFooter>
                </LoginForm>
            </LoginContainer>
        </Layout>
    );
};

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 60px);
    padding: 20px;
`;

const LoginForm = styled.form`
    width: 100%;
    max-width: 400px;
    padding: 24px;
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const LogoText = styled.h1`
    font-size: 2rem;
    color: ${({theme}) => theme.colors.primary};
    margin: 0 0 16px;
`;

const FormTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px;
`;

const FormSubtitle = styled.p`
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
    margin: 0;
`;

const FormGroup = styled.div`
    margin-bottom: 16px;
`;

const FormLabel = styled.label`
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    margin-bottom: 6px;

    svg {
        margin-right: 6px;
        color: ${({theme}) => theme.colors.primary};
    }
`;

const FormInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    font-size: 1rem;

    &:focus {
        border-color: ${({theme}) => theme.colors.primary};
        outline: none;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    border-radius: ${({theme}) => theme.borderRadius};
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;

    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid ${({theme}) => theme.colors.border};
    }
`;

const DividerText = styled.span`
    padding: 0 10px;
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
`;

const SocialButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const SocialButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    border-radius: ${({theme}) => theme.borderRadius};
    font-size: 1rem;
    cursor: pointer;
    border: 1px solid #12B7F5;
    background-color: ${({theme}) => theme.colors.background};
    transition: all 0.2s ease;

    svg {
        font-size: 1.2rem;
    }

    &:hover {
        background-color: ${({theme}) => theme.colors.hover};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const FormFooter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    font-size: 0.9rem;
`;

const RegisterLink = styled(Link)`
    margin-left: 6px;
    color: ${({theme}) => theme.colors.primary};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px;
    background-color: #ffdede;
    color: #d33;
    border-radius: ${({theme}) => theme.borderRadius};

    svg {
        flex-shrink: 0;
        margin-right: 8px;
    }
`;

const ErrorText = styled.span`
    font-size: 0.9rem;
`;

export default LoginPage; 