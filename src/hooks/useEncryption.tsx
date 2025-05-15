import {useState} from 'react';
import {getConfigSecretKey, saveConfigSecretKey} from '@/utils/encryptionUtils';
import SecretKeyDialog from '@/components/Config/SecretKeyDialog.tsx';

/**
 * Hook for handling API key encryption
 */
const useEncryption = () => {
    const [isSecretKeyDialogOpen, setIsSecretKeyDialogOpen] = useState(false);
    const [pendingOperationCallback, setPendingOperationCallback] = useState<((secretKey: string) => void) | null>(null);
    const [configForDialog, setConfigForDialog] = useState<{ name?: string, id?: number | null }>({});


    /**
     * Get or create a secret key for a configuration
     * @param configId The config ID
     * @param configName The config name (for UI)
     * @returns Promise that resolves to the secret key or rejects if canceled
     */
    const getOrCreateSecretKey = (configId: number, configName?: string): Promise<string> => {
        return new Promise((resolve) => {
            const existingSecretKey = getConfigSecretKey(configId);

            if (existingSecretKey) {
                resolve(existingSecretKey);
            } else {
                setPendingOperationCallback(() => (secretKey: string) => {
                    saveConfigSecretKey(configId, secretKey);
                    resolve(secretKey);
                });

                setConfigForDialog({name: configName, id: configId});
                setIsSecretKeyDialogOpen(true);
            }
        });
    };

    const handleSecretKeySubmit = (secretKey: string) => {
        setIsSecretKeyDialogOpen(false);

        if (pendingOperationCallback) {
            pendingOperationCallback(secretKey);
            setPendingOperationCallback(null);
        }
    };

    const handleSecretKeyCancel = () => {
        setIsSecretKeyDialogOpen(false);
        setPendingOperationCallback(null);
    };

    // SecretKeyDialog component to render
    const secretKeyDialogComponent = (
        <SecretKeyDialog
            isOpen={isSecretKeyDialogOpen}
            configName={configForDialog.name}
            onConfirm={handleSecretKeySubmit}
            onCancel={handleSecretKeyCancel}
        />
    );

    return {
        getOrCreateSecretKey,
        secretKeyDialogComponent
    };
};

export default useEncryption;