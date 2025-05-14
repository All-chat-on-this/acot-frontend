import React, {useState} from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {FiEye, FiEyeOff, FiInfo, FiLock} from 'react-icons/fi';
import {useTranslation} from 'react-i18next';
import {colorTransition} from '@/styles/animations.ts';

interface SecretKeyDialogProps {
    isOpen: boolean;
    configName?: string;
    onConfirm: (secretKey: string) => void;
    onCancel: () => void;
}

const SecretKeyDialog: React.FC<SecretKeyDialogProps> = ({
                                                             isOpen,
                                                             configName,
                                                             onConfirm,
                                                             onCancel,
                                                         }) => {
    const {t} = useTranslation();
    const [secretKey, setSecretKey] = useState('');
    const [confirmKey, setConfirmKey] = useState('');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!secretKey) {
            setError(t('secret_key_required'));
            return;
        }

        if (secretKey !== confirmKey) {
            setError(t('secret_keys_dont_match'));
            return;
        }

        onConfirm(secretKey);
    };

    const toggleShowKey = () => {
        setShowSecretKey(!showSecretKey);
    };

    if (!isOpen) return null;

    return (
        <DialogOverlay
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <DialogContainer
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.9, opacity: 0}}
            >
                <DialogHeader>
                    <FiLock size={20}/>
                    <DialogTitle>{t('set_secret_key')}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <InfoBox>
                        <FiInfo size={16}/>
                        <InfoText>
                            {configName
                                ? t('secret_key_info_with_name', {name: configName})
                                : t('secret_key_info')}
                        </InfoText>
                    </InfoBox>

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="secretKey">{t('secret_key')}</Label>
                            <InputWrapper>
                                <Input
                                    id="secretKey"
                                    type={showSecretKey ? 'text' : 'password'}
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    placeholder={t('enter_secret_key')}
                                    autoFocus
                                />
                                <EyeButton type="button" onClick={toggleShowKey}>
                                    {showSecretKey ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                                </EyeButton>
                            </InputWrapper>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="confirmKey">{t('confirm_secret_key')}</Label>
                            <Input
                                id="confirmKey"
                                type={showSecretKey ? 'text' : 'password'}
                                value={confirmKey}
                                onChange={(e) => setConfirmKey(e.target.value)}
                                placeholder={t('confirm_secret_key')}
                            />
                        </FormGroup>

                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <DialogActions>
                            <CancelButton type="button" onClick={onCancel}>
                                {t('cancel')}
                            </CancelButton>
                            <ConfirmButton type="submit">
                                {t('confirm')}
                            </ConfirmButton>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </DialogContainer>
        </DialogOverlay>
    );
};

const DialogOverlay = styled(motion.div)`
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
    backdrop-filter: blur(2px);
`;

const DialogContainer = styled(motion.div)`
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90%;
    overflow: hidden;
`;

const DialogHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
`;

const DialogTitle = styled.h3`
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
`;

const DialogContent = styled.div`
    padding: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    font-size: 0.95rem;
    transition: ${colorTransition};

    &:focus {
        border-color: ${({theme}) => theme.colors.primary};
        outline: none;
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.primary}30;
    }
`;

const EyeButton = styled.button`
    position: absolute;
    right: 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const InfoBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    background-color: ${({theme}) => theme.colors.background};
    border-radius: ${({theme}) => theme.borderRadius};
    border-left: 3px solid ${({theme}) => theme.colors.primary};
`;

const InfoText = styled.p`
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
`;

const ErrorMessage = styled.div`
    color: #e53935;
    font-size: 0.85rem;
    margin-top: -8px;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
`;

const Button = styled.button`
    padding: 8px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    font-size: 0.9rem;
    cursor: pointer;
    transition: ${colorTransition};

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    border: 1px solid ${({theme}) => theme.colors.border};
    color: ${({theme}) => theme.colors.text};

    &:hover {
        background-color: ${({theme}) => theme.colors.background};
    }
`;

const ConfirmButton = styled(Button)`
    background-color: ${({theme}) => theme.colors.primary};
    border: none;
    color: ${({theme}) => theme.colors.buttonText};

    &:hover {
        background-color: ${({theme}) => theme.colors.primary}dd;
    }
`;

export default SecretKeyDialog;