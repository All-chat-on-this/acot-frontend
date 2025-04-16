import React, { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout';
import useAuthStore from '@/store/authStore';
import { FiAlertTriangle, FiLock, FiUser, FiTag } from 'react-icons/fi';

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const {
        register,
        isLoading,
        error,
        isAuthenticated,
        clearErrors
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

    const validate = (): boolean => {
        if (!username.trim()) {
            setFormError(t('username_required'));
            return false;
        }
        
        if (!password.trim()) {
            setFormError(t('password_required'));
            return false;
        }
        
        if (password !== confirmPassword) {
            setFormError(t('passwords_dont_match'));
            return false;
        }
        
        if (password.length < 6) {
            setFormError(t('password_too_short'));
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearErrors();
        setFormError(null);

        if (!validate()) {
            return;
        }

        try {
            await register(username, password, nickname || '');
            // Navigate will happen automatically via the useEffect above
        } catch (error) {
            console.error('Registration failed:', error);
            // Error state is already set in the store
        }
    };

    return (
        <Layout showSidebar={false}>
            <RegisterContainer>
                <RegisterForm onSubmit={handleSubmit}>
                    <FormHeader>
                        <LogoText>{t('app_name')}</LogoText>
                        <FormTitle>{t('register_title')}</FormTitle>
                        <FormSubtitle>{t('register_subtitle')}</FormSubtitle>
                    </FormHeader>

                    {(error || formError) && (
                        <ErrorMessage>
                            <FiAlertTriangle size={18} />
                            <ErrorText>{formError || error}</ErrorText>
                        </ErrorMessage>
                    )}

                    <FormGroup>
                        <FormLabel>
                            <FiUser />
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
                            <FiTag />
                            <span>{t('nickname')}</span>
                        </FormLabel>
                        <FormInput
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={t('enter_nickname')}
                            disabled={isLoading}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            <FiLock />
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

                    <FormGroup>
                        <FormLabel>
                            <FiLock />
                            <span>{t('confirm_password')}</span>
                        </FormLabel>
                        <FormInput
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('confirm_password')}
                            required
                            disabled={isLoading}
                        />
                    </FormGroup>

                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? t('registering') : t('register')}
                    </SubmitButton>

                    <FormFooter>
                        <span>{t('already_have_account')}</span>
                        <LoginLink to="/login">{t('login')}</LoginLink>
                    </FormFooter>
                </RegisterForm>
            </RegisterContainer>
        </Layout>
    );
};

const RegisterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 60px);
    padding: 20px;
`;

const RegisterForm = styled.form`
    width: 100%;
    max-width: 400px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.card};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const LogoText = styled.h1`
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 16px;
`;

const FormTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px;
`;

const FormSubtitle = styled.p`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
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
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const FormInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        outline: none;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.buttonText};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

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

const LoginLink = styled(Link)`
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.primary};
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
    border-radius: ${({ theme }) => theme.borderRadius};

    svg {
        flex-shrink: 0;
        margin-right: 8px;
    }
`;

const ErrorText = styled.span`
    font-size: 0.9rem;
`;

export default RegisterPage; 