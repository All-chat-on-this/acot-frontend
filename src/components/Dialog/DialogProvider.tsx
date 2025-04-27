import React, {createContext, useCallback, useContext, useState} from 'react';
import Dialog, {DialogType} from './Dialog';
import {useTranslation} from 'react-i18next';

interface DialogOptions {
    title?: string;
    message: string;
    type?: DialogType;
    confirmLabel?: string;
    cancelLabel?: string;
}

interface DialogContextType {
    alert: (options: DialogOptions) => Promise<void>;
    confirm: (options: DialogOptions) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

interface DialogState extends DialogOptions {
    isOpen: boolean;
    resolve?: (value: boolean) => void;
}

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {t} = useTranslation();
    const [dialogState, setDialogState] = useState<DialogState>({
        isOpen: false,
        message: '',
    });

    const closeDialog = useCallback(() => {
        setDialogState((prev) => ({...prev, isOpen: false}));
    }, []);

    const alert = useCallback(
        (options: DialogOptions): Promise<void> => {
            return new Promise<void>((resolve) => {
                setDialogState({
                    ...options,
                    title: options.title || t('info'),
                    type: options.type || 'info',
                    confirmLabel: options.confirmLabel || t('ok'),
                    isOpen: true,
                    resolve: () => {
                        resolve();
                        return true;
                    },
                });
            });
        },
        [t]
    );

    const confirm = useCallback(
        (options: DialogOptions): Promise<boolean> => {
            return new Promise<boolean>((resolve) => {
                setDialogState({
                    ...options,
                    title: options.title || t('confirm'),
                    type: options.type || 'confirm',
                    confirmLabel: options.confirmLabel || t('yes'),
                    cancelLabel: options.cancelLabel || t('no'),
                    isOpen: true,
                    resolve,
                });
            });
        },
        [t]
    );

    const handleConfirm = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(true);
        }
    }, [dialogState]);

    const handleCancel = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(false);
        }
    }, [dialogState]);

    return (
        <DialogContext.Provider value={{alert, confirm}}>
            {children}
            <Dialog
                isOpen={dialogState.isOpen}
                title={dialogState.title || ''}
                message={dialogState.message}
                type={dialogState.type}
                confirmLabel={dialogState.confirmLabel}
                cancelLabel={dialogState.cancelLabel}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={closeDialog}
            />
        </DialogContext.Provider>
    );
};

export default DialogProvider; 