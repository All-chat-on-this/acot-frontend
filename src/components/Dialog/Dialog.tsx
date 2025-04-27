import React from 'react';
import styled from 'styled-components';
import {AnimatePresence, motion} from 'framer-motion';
import {FiAlertTriangle, FiInfo, FiX} from 'react-icons/fi';
import {colorTransition} from '@/styles/animations';

export type DialogType = 'info' | 'warning' | 'error' | 'confirm';

interface DialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: DialogType;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({
                                           isOpen,
                                           title,
                                           message,
                                           type = 'info',
                                           confirmLabel = 'OK',
                                           cancelLabel = 'Cancel',
                                           onConfirm,
                                           onCancel,
                                           onClose,
                                       }) => {
    // Handle clicks on the backdrop
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle keyboard events
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Enter') {
                onConfirm();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, onConfirm]);

    // Handle confirm and cancel
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Backdrop
                    onClick={handleBackdropClick}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.2}}
                >
                    <DialogContainer
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.2}}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DialogHeader $type={type}>
                            <IconContainer>
                                {type === 'warning' || type === 'error' ? (
                                    <FiAlertTriangle size={22}/>
                                ) : (
                                    <FiInfo size={22}/>
                                )}
                            </IconContainer>
                            <Title>{title}</Title>
                            <CloseButton onClick={onClose}>
                                <FiX size={18}/>
                            </CloseButton>
                        </DialogHeader>
                        <DialogContent>
                            <Message>{message}</Message>
                        </DialogContent>
                        <DialogActions>
                            {(type === 'confirm') && (
                                <CancelButton
                                    onClick={handleCancel}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {cancelLabel}
                                </CancelButton>
                            )}
                            <ConfirmButton
                                onClick={handleConfirm}
                                $type={type}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                {confirmLabel}
                            </ConfirmButton>
                        </DialogActions>
                    </DialogContainer>
                </Backdrop>
            )}
        </AnimatePresence>
    );
};

const Backdrop = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
`;

const DialogContainer = styled(motion.div)`
    background-color: ${({theme}) => theme.colors.dialogBackground};
    border-radius: ${({theme}) => theme.borderRadius};
    width: 100%;
    max-width: 450px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    margin: 0 20px;
`;

const DialogHeader = styled.div<{ $type: DialogType }>`
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    background-color: ${({$type}) =>
            $type === 'error' ? '#FFEBEE' :
                    $type === 'warning' ? '#FFF8E1' :
                            $type === 'confirm' ? '#E8F5E9' :
                                    '#E3F2FD'
    };
    color: ${({$type}) =>
            $type === 'error' ? '#B71C1C' :
                    $type === 'warning' ? '#F57F17' :
                            $type === 'confirm' ? '#1B5E20' :
                                    '#0D47A1'
    };
`;

const IconContainer = styled.div`
    margin-right: 12px;
    display: flex;
    align-items: center;
`;

const Title = styled.h3`
    margin: 0;
    flex-grow: 1;
    font-size: 1.1rem;
`;

const CloseButton = styled.button`
    background: transparent !important;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    color: inherit;
    opacity: 0.6;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const DialogContent = styled.div`
    padding: 16px;
    max-height: 70vh;
    overflow-y: auto;
`;

const Message = styled.p`
    margin: 0;
    line-height: 1.5;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    gap: 12px;
    border-top: 1px solid ${({theme}) => theme.colors.border};
`;

const Button = styled(motion.button)`
    padding: 8px 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: ${colorTransition};
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    color: ${({theme}) => theme.colors.text};
    border: 1px solid ${({theme}) => theme.colors.border};

    &:hover {
        background-color: ${({theme}) => theme.colors.hover};
    }
`;

const ConfirmButton = styled(Button)<{ $type: DialogType }>`
    background-color: ${({$type, theme}) =>
            $type === 'error' ? theme.colors.error :
                    $type === 'warning' ? '#FF9800' :
                            theme.colors.primary
    };
    color: ${({theme}) => theme.colors.buttonText};
`;

export default Dialog; 