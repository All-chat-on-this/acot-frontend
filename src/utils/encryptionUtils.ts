import CryptoJS from 'crypto-js';

// Encrypt data using AES-256
export const encryptData = (data: string, secretKey: string): string => {
    if (!data || !secretKey) return '';
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Decrypt data using AES-256
export const decryptData = (encryptedData: string, secretKey: string): string => {
    if (!encryptedData || !secretKey) return '';
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error);
        return '';
    }
};

// Generate a storage key for the config secret key
export const getConfigSecretKeyStorageKey = (configId: number | string): string => {
    return `acot-config-secret-${configId}`;
};

// Save a config's secret key to localStorage
export const saveConfigSecretKey = (configId: number | string, secretKey: string): void => {
    if (!configId || !secretKey) return;
    const storageKey = getConfigSecretKeyStorageKey(configId);
    localStorage.setItem(storageKey, secretKey);
};

// Get a config's secret key from localStorage
export const getConfigSecretKey = (configId: number | string): string | null => {
    if (!configId) return null;
    const storageKey = getConfigSecretKeyStorageKey(configId);
    return localStorage.getItem(storageKey);
}; 