import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/Layout';
import useAuthStore from '@/store/authStore';
import useConversationStore from '@/store/conversationStore';
import { FiUser, FiLock, FiAlertTriangle } from 'react-icons/fi';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const { createConversation } = useConversationStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login(username, password);
      
      // Create a new conversation and navigate to it
      const newConversation = await createConversation(t('new_conversation'));
      navigate(`/chat/${newConversation.id}`);
    } catch (error) {
      console.error('Login failed:', error);
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
              <FiAlertTriangle size={18} />
              <ErrorText>{error}</ErrorText>
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
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? t('logging_in') : t('login')}
          </SubmitButton>
          
          <FormFooter>
            <span>{t('no_account')}</span>
            <RegisterLink to="/register">{t('register')}</RegisterLink>
          </FormFooter>
          
          <DemoAccount>
            <h4>{t('demo_account')}</h4>
            <p>{t('username')}: demo</p>
            <p>{t('password')}: password</p>
          </DemoAccount>
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

const RegisterLink = styled(Link)`
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

const DemoAccount = styled.div`
  margin-top: 24px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.hover};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  
  h4 {
    margin: 0 0 8px;
    font-size: 1rem;
  }
  
  p {
    margin: 4px 0;
  }
`;

export default LoginPage; 