import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {AnimatePresence, motion} from 'framer-motion';
import {FiAlertTriangle, FiCheck, FiEye, FiEyeOff, FiX} from 'react-icons/fi';
import JSONEditor from '@/components/JSONEditor/JSONEditor';
import useConfigStore from '@/store/configStore';
import {colorTransition, fadeIn} from '@/styles/animations';
import {ActionButton} from '../ConfigPage';
import {ApiConfig, ApiConfigTestRequest} from "@/api/type/configApi.ts";
import {useTranslation} from "react-i18next";
import TestResponse from '@/components/TestResponse';
import {useDialog} from '@/components/Dialog';
import useEncryption from '@/hooks/useEncryption';
import {decryptData, encryptData, getConfigSecretKey} from '@/utils/encryptionUtils';

interface ConfigEditFormProps {
    currentConfig: ApiConfig | null;
    showApiKey: boolean;
    toggleApiKeyVisibility: () => void;
    handleCancelEdit: () => void;
    isLoading: boolean;
}

export interface TestResult {
    success: boolean;
    message: string;
    response: {
        role: string;
        content: string;
        thinking: string;
    },
    error?: string;
}

const ConfigEditForm: React.FC<ConfigEditFormProps> = ({
                                                           currentConfig,
                                                           showApiKey,
                                                           toggleApiKeyVisibility,
                                                           handleCancelEdit,
                                                           isLoading,
                                                       }) => {
    const {
        createConfig,
        updateConfig,
        testConfig,
        setCurrentConfigById,
        testResult,
        error
    } = useConfigStore();

    const {t} = useTranslation();
    const dialog = useDialog();
    const {getOrCreateSecretKey, secretKeyDialogComponent} = useEncryption();

    // State to track if we've successfully tested the configuration
    const [hasSuccessfulTest, setHasSuccessfulTest] = useState(false);

    // Add state for decrypted API key

    // Debug effect to check test result data
    useEffect(() => {
        if (testResult) {
            console.log('Test Result Object:', testResult);
            // Update successful test status
            if (testResult.data?.success) {
                setHasSuccessfulTest(true);
            }
        }
    }, [testResult]);

    const [formData, setFormData] = useState({
        name: t('new_configuration'),
        apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
        apiKey: '',
        apiKeyPlacement: 'header' as 'header' | 'body' | 'custom_header',
        apiKeyHeader: '',
        apiKeyBodyPath: '',
        requestTemplate: '{\n' +
            '  "model": "Qwen/QwQ-32B",\n' +
            '  "messages": [\n' +
            '    {\n' +
            '      "role": "user",\n' +
            '      "content": "What opportunities and challenges will the Chinese large - model industry face in 2025?"\n' +
            '    }\n' +
            '  ],\n' +
            '  "stream": false,\n' +
            '  "max_tokens": 512,\n' +
            '  "stop": null,\n' +
            '  "temperature": 0.7,\n' +
            '  "top_p": 0.7,\n' +
            '  "top_k": 50,\n' +
            '  "frequency_penalty": 0.5,\n' +
            '  "n": 1,\n' +
            '  "response_format": {\n' +
            '    "type": "text"\n' +
            '  },\n' +
            '  "tools": [\n' +
            '    {\n' +
            '      "type": "function",\n' +
            '      "function": {\n' +
            '        "description": "",\n' +
            '        "name": "",\n' +
            '        "parameters": {},\n' +
            '        "strict": false\n' +
            '      }\n' +
            '    }\n' +
            '  ]\n' +
            '}',
        responseTemplate: '{\n' +
            '  "id": "0196685afb2ec3f4cdf59e1c6dd30c30",\n' +
            '  "object": "chat.completion",\n' +
            '  "created": 1745507515,\n' +
            '  "model": "Qwen/QwQ-32B",\n' +
            '  "choices": [\n' +
            '    {\n' +
            '      "index": 0,\n' +
            '      "message": {\n' +
            '        "role": "assistant",\n' +
            '        "content": "",\n' +
            '        "reasoning_content": "Hello, how can I help you?",\n' +
            '        "tool_calls": [\n' +
            '          {\n' +
            '            "id": "0196685bae420c91f60bba4d49081175",\n' +
            '            "type": "function",\n' +
            '            "function": {\n' +
            '              "name": "get_market_growth",\n' +
            '              "arguments": {\n' +
            '                "country": "China",\n' +
            '                "year": 2025\n' +
            '              }\n' +
            '            }\n' +
            '          },\n' +
            '          {\n' +
            '            "id": "0196685bae429847f23572c959e56aa9",\n' +
            '            "type": "function",\n' +
            '            "function": {\n' +
            '              "name": "get_policy_updates",\n' +
            '              "arguments": {\n' +
            '                "country": "China",\n' +
            '                "year": 2025\n' +
            '              }\n' +
            '            }\n' +
            '          },\n' +
            '          {\n' +
            '            "id": "0196685bae426f48b38445995961a914",\n' +
            '            "type": "function",\n' +
            '            "function": {\n' +
            '              "name": "get_technical_challenges",\n' +
            '              "arguments": {\n' +
            '                "country": "China",\n' +
            '                "year": 2025\n' +
            '              }\n' +
            '            }\n' +
            '          }\n' +
            '        ]\n' +
            '      },\n' +
            '      "finish_reason": "tool_calls"\n' +
            '    }\n' +
            '  ],\n' +
            '  "usage": {\n' +
            '    "prompt_tokens": 141,\n' +
            '    "completion_tokens": 774,\n' +
            '    "total_tokens": 915,\n' +
            '    "completion_tokens_details": {\n' +
            '      "reasoning_tokens": 681\n' +
            '    }\n' +
            '  },\n' +
            '  "system_fingerprint": ""\n' +
            '}',
        requestMessageGroupPath: 'messages',
        requestRolePathFromGroup: 'role',
        requestTextPathFromGroup: 'content',
        requestUserRoleField: 'user',
        requestAssistantField: 'assistant',
        requestSystemField: 'system',
        responseTextPath: 'choices[0].message.content',
        responseThinkingTextPath: 'choices[0].message.reasoning_content'
    });

    const [lastApiKeyBodyPath, setLastApiKeyBodyPath] = useState('');

    const [paths, setPaths] = useState({
        requestMessageGroupPath: 'messages',
        requestRolePathFromGroup: 'role',
        requestTextPathFromGroup: 'content',
        requestUserRoleField: 'user',
        requestAssistantField: 'assistant',
        requestSystemField: 'system',
        responseTextPath: 'choices[0].message.content',
        responseThinkingTextPath: 'choices[0].message.reasoning_content'
    });

    useEffect(() => {
        if (currentConfig) {
            setFormData({
                name: currentConfig.name,
                apiUrl: currentConfig.apiUrl,
                apiKey: currentConfig.apiKey,
                apiKeyPlacement: currentConfig.apiKeyPlacement as 'header' | 'body' | 'custom_header' || 'header',
                apiKeyHeader: currentConfig.apiKeyHeader || '',
                apiKeyBodyPath: currentConfig.apiKeyBodyPath || '',
                requestTemplate: JSON.stringify(currentConfig.requestTemplate, null, 2),
                responseTemplate: JSON.stringify(currentConfig.responseTemplate, null, 2),
                requestMessageGroupPath: currentConfig.requestMessageGroupPath || 'messages',
                requestRolePathFromGroup: currentConfig.requestRolePathFromGroup || 'role',
                requestTextPathFromGroup: currentConfig.requestTextPathFromGroup || 'content',
                requestUserRoleField: currentConfig.requestUserRoleField || 'user',
                requestAssistantField: currentConfig.requestAssistantField || 'assistant',
                requestSystemField: currentConfig.requestSystemField || 'system',
                responseTextPath: currentConfig.responseTextPath || 'choices[0].message.content',
                responseThinkingTextPath: currentConfig.responseThinkingTextPath || 'choices[0].message.reasoning_content'
            });
            setLastApiKeyBodyPath(currentConfig.apiKeyBodyPath || '');

            // Extract paths from current config
            setPaths({
                requestMessageGroupPath: currentConfig.requestMessageGroupPath || 'messages',
                requestRolePathFromGroup: currentConfig.requestRolePathFromGroup || 'role',
                requestTextPathFromGroup: currentConfig.requestTextPathFromGroup || 'content',
                requestUserRoleField: currentConfig.requestUserRoleField || 'user',
                requestAssistantField: currentConfig.requestAssistantField || 'assistant',
                requestSystemField: currentConfig.requestSystemField || 'system',
                responseTextPath: currentConfig.responseTextPath || 'choices[0].message.content',
                responseThinkingTextPath: currentConfig.responseThinkingTextPath || 'choices[0].message.reasoning_content'
            });
        }
    }, [currentConfig, t]);

    useEffect(() => {
        if (currentConfig) {
            // If API key is encrypted, decrypt it when first loading the form or when config changes
            const decryptApiKeyIfNeeded = async () => {
                if (currentConfig.apiKey.startsWith('enc:')) {
                    try {
                        // Get the stored secret key for this config
                        let secretKey = getConfigSecretKey(currentConfig.id);

                        // If no secret key found in storage, prompt the user
                        if (!secretKey) {
                            try {
                                secretKey = await getOrCreateSecretKey(currentConfig.id, currentConfig.name);
                            } catch (error) {
                                console.error('Secret key retrieval canceled:', error);
                                return;
                            }
                        }

                        // Remove the 'enc:' prefix and decrypt
                        const encryptedKey = currentConfig.apiKey.substring(4);
                        const decrypted = decryptData(encryptedKey, secretKey);

                        // Update form data with decrypted key
                        setFormData(prev => ({
                            ...prev,
                            apiKey: decrypted
                        }));
                    } catch (error) {
                        console.error('Failed to decrypt API key:', error);
                        await dialog.alert({
                            title: t('error'),
                            message: t('decryption_failed', 'Failed to decrypt API key'),
                            type: 'error'
                        });
                    }
                }
            };

            decryptApiKeyIfNeeded();
        }
    }, [showApiKey, t]);

    useEffect(() => {
        handleApiKeyBodyPathChange();
    }, [formData.apiKeyBodyPath, formData.apiKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // Special handler for API key placement changes to prevent focus loss
    const handleApiKeyPlacementChange = (value: 'header' | 'body' | 'custom_header') => {
        setFormData(prev => ({...prev, apiKeyPlacement: value}));

        // If switching to body and path already exists, update template
        if (value === 'body' && formData.apiKeyBodyPath) {
            setTimeout(() => handleApiKeyBodyPathChange(), 0);
        }
    };

    // Add key to request template when body path input loses focus
    const handleApiKeyBodyPathChange = () => {
        if (formData.apiKeyPlacement === 'body' && formData.apiKeyBodyPath) {
            try {
                // Parse existing template
                const requestTemplate = JSON.parse(formData.requestTemplate);
                const previewValue = '*'.repeat(formData.apiKey.length);

                // Create clean template
                const cleanTemplate = {...requestTemplate};

                // Remove old API key fields
                Object.keys(cleanTemplate).forEach(key => {
                    if (key === lastApiKeyBodyPath) {
                        delete cleanTemplate[key];
                    }
                });

                // Add new API key field
                cleanTemplate[formData.apiKeyBodyPath] = previewValue;

                // Update form
                setFormData(prev => ({
                    ...prev,
                    requestTemplate: JSON.stringify(cleanTemplate, null, 2)
                }));

                // Update last API key body path
                setLastApiKeyBodyPath(formData.apiKeyBodyPath);
            } catch (error) {
                console.error('Cannot update template, invalid JSON:', error);
            }
        }
    };

    const handleJsonChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const handlePathsChange = (newPaths: {
        requestMessageGroupPath: string,
        requestRolePathFromGroup: string,
        requestTextPathFromGroup: string,
        requestUserRoleField: string,
        requestAssistantField: string,
        requestSystemField: string,
        responseTextPath: string,
        responseThinkingTextPath: string
    }) => {
        setPaths(newPaths);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Parse JSON templates
            let requestTemplate = JSON.parse(formData.requestTemplate);
            const responseTemplate = JSON.parse(formData.responseTemplate);

            // If apiKeyPlacement is 'body', ensure the field exists in requestTemplate
            if (formData.apiKeyPlacement === 'body' && formData.apiKeyBodyPath) {
                if (requestTemplate[formData.apiKeyBodyPath] === undefined) {
                    requestTemplate = {
                        ...requestTemplate,
                        [formData.apiKeyBodyPath]: formData.apiKey
                    };
                }
            }

            // Two-phase process for new configurations
            if (!currentConfig) {
                // Phase 1: Save a temporary configuration without an API key to get an ID
                const tempConfigData = {
                    name: formData.name,
                    apiUrl: formData.apiUrl,
                    apiKey: "", // Empty API key
                    apiKeyPlacement: formData.apiKeyPlacement,
                    apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                    apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                    headers: {'Content-Type': 'application/json'},
                    requestTemplate,
                    responseTemplate,
                    requestMessageGroupPath: paths.requestMessageGroupPath,
                    requestRolePathFromGroup: paths.requestRolePathFromGroup,
                    requestTextPathFromGroup: paths.requestTextPathFromGroup,
                    requestUserRoleField: paths.requestUserRoleField,
                    requestAssistantField: paths.requestAssistantField,
                    requestSystemField: paths.requestSystemField,
                    responseTextPath: paths.responseTextPath,
                    responseThinkingTextPath: paths.responseThinkingTextPath,
                    isAvailable: hasSuccessfulTest
                };

                // Create temporary config to get an ID
                const tempConfig = await createConfig(tempConfigData);
                console.log('Created temporary config:', tempConfig);

                // Phase 2: Get or create secret key and encrypt the API key
                try {
                    // Get secret key or create a new one
                    const secretKey = await getOrCreateSecretKey(tempConfig.id, formData.name);

                    // Encrypt the API key
                    const encryptedApiKey = encryptData(formData.apiKey, secretKey);

                    // Update the config with the encrypted API key
                    const finalConfigData = {
                        ...tempConfigData,
                        id: tempConfig.id,
                        apiKey: `enc:${encryptedApiKey}`
                    };

                    await updateConfig(tempConfig.id, finalConfigData);
                    await setCurrentConfigById(tempConfig.id);
                } catch (error) {
                    console.error('[handleSubmit] API key encryption failed:', error);
                    // Still keep the config but with empty API key
                    await setCurrentConfigById(tempConfig.id);
                }

                handleCancelEdit();
                return;
            }

            // For existing configs, handle API key encryption if needed
            let apiKeyToSave = formData.apiKey;

            // If the current API key doesn't start with "enc:" but the original did,
            // or if it's a completely new plaintext key, we need to encrypt it
            const isPlaintext = !formData.apiKey.startsWith('enc:');
            const wasEncrypted = currentConfig.apiKey.startsWith('enc:');

            if (isPlaintext && (wasEncrypted || formData.apiKey !== currentConfig.apiKey)) {
                try {
                    // Get or create a secret key for this config
                    const secretKey = await getOrCreateSecretKey(currentConfig.id, formData.name);

                    // Encrypt the API key
                    const encryptedApiKey = encryptData(formData.apiKey, secretKey);
                    apiKeyToSave = `enc:${encryptedApiKey}`;
                } catch (error) {
                    console.error('[handleSubmit] API key encryption canceled:', error);
                    return; // Stop form submission if canceled
                }
            }

            const configData = {
                name: formData.name,
                apiUrl: formData.apiUrl,
                apiKey: apiKeyToSave,
                apiKeyPlacement: formData.apiKeyPlacement,
                apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                headers: {'Content-Type': 'application/json'},
                requestTemplate,
                responseTemplate,
                requestMessageGroupPath: paths.requestMessageGroupPath,
                requestRolePathFromGroup: paths.requestRolePathFromGroup,
                requestTextPathFromGroup: paths.requestTextPathFromGroup,
                requestUserRoleField: paths.requestUserRoleField,
                requestAssistantField: paths.requestAssistantField,
                requestSystemField: paths.requestSystemField,
                responseTextPath: paths.responseTextPath,
                responseThinkingTextPath: paths.responseThinkingTextPath,
            };

            // Update existing config
            await updateConfig(currentConfig.id, configData);
            // Config is already fetched and set as current in updateConfig
            await setCurrentConfigById(currentConfig.id);
            handleCancelEdit();
        } catch (error) {
            console.error('[handleSubmit] Failed to save configuration:', error);
            await dialog.alert({
                title: t('error'),
                message: t('invalid_json'),
                type: 'error'
            });
        }
    };

    const handleTestConfig = async () => {
        try {
            // Reset the successful test flag
            setHasSuccessfulTest(false);

            // Parse JSON templates
            let requestTemplate = JSON.parse(formData.requestTemplate);
            const responseTemplate = JSON.parse(formData.responseTemplate);

            // If apiKeyPlacement is 'body', ensure the field exists in requestTemplate
            if (formData.apiKeyPlacement === 'body' && formData.apiKeyBodyPath) {
                if (requestTemplate[formData.apiKeyBodyPath] === undefined) {
                    requestTemplate = {
                        ...requestTemplate,
                        [formData.apiKeyBodyPath]: formData.apiKey
                    };
                }
            }

            // Two-phase process for new configurations
            if (!currentConfig) {
                // Phase 1: Save a temporary configuration without an API key to get an ID
                const tempConfigData = {
                    name: formData.name,
                    apiUrl: formData.apiUrl,
                    apiKey: "", // Empty API key
                    apiKeyPlacement: formData.apiKeyPlacement,
                    apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                    apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                    headers: {'Content-Type': 'application/json'},
                    requestTemplate,
                    responseTemplate,
                    requestMessageGroupPath: paths.requestMessageGroupPath,
                    requestRolePathFromGroup: paths.requestRolePathFromGroup,
                    requestTextPathFromGroup: paths.requestTextPathFromGroup,
                    requestUserRoleField: paths.requestUserRoleField,
                    requestAssistantField: paths.requestAssistantField,
                    requestSystemField: paths.requestSystemField,
                    responseTextPath: paths.responseTextPath,
                    responseThinkingTextPath: paths.responseThinkingTextPath
                };

                // Create temporary config to get an ID
                const tempConfig = await createConfig(tempConfigData);

                try {
                    // Get secret key or create a new one
                    const secretKey = await getOrCreateSecretKey(tempConfig.id, formData.name);

                    // Encrypt the API key
                    const encryptedApiKey = encryptData(formData.apiKey, secretKey);

                    // Update the config with the encrypted API key
                    const finalConfigData = {
                        ...tempConfigData,
                        id: tempConfig.id,
                        apiKey: `enc:${encryptedApiKey}`
                    };

                    // Update first with encrypted API key
                    await updateConfig(tempConfig.id, finalConfigData);

                    // Then test with the secret key
                    const testRequestData: ApiConfigTestRequest = {
                        ...finalConfigData,
                        secretKey
                    };
                    await testConfig(testRequestData);

                    // Update the config to reflect test results
                    setCurrentConfigById(tempConfig.id);
                } catch (error) {
                    console.error('[handleTestConfig] API key encryption failed:', error);
                    // Test with temporary config (empty API key)
                    const testRequestData: ApiConfigTestRequest = {
                        ...tempConfigData,
                        id: tempConfig.id
                    };
                    await testConfig(testRequestData);
                }

                return;
            }

            // For existing configs
            // Always encrypt the plaintext API key from formData before testing
            let secretKey: string | undefined = undefined;

            // If the original config had an encrypted key, use the same secret key
            if (currentConfig && !currentConfig.apiKey.startsWith('enc:')) {
                try {
                    // Get or create a secret key for this config
                    secretKey = await getOrCreateSecretKey(currentConfig.id, formData.name);

                    // Encrypt the form's API key for the test request
                    const encryptedApiKey = encryptData(formData.apiKey, secretKey);

                    // Create test data with encrypted key
                    const testRequestData: ApiConfigTestRequest = {
                        id: currentConfig.id,
                        name: formData.name,
                        apiUrl: formData.apiUrl,
                        apiKey: `enc:${encryptedApiKey}`,
                        apiKeyPlacement: formData.apiKeyPlacement,
                        apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                        apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                        headers: {'Content-Type': 'application/json'},
                        requestTemplate,
                        responseTemplate,
                        requestMessageGroupPath: paths.requestMessageGroupPath,
                        requestRolePathFromGroup: paths.requestRolePathFromGroup,
                        requestTextPathFromGroup: paths.requestTextPathFromGroup,
                        requestUserRoleField: paths.requestUserRoleField,
                        requestAssistantField: paths.requestAssistantField,
                        requestSystemField: paths.requestSystemField,
                        responseTextPath: paths.responseTextPath,
                        responseThinkingTextPath: paths.responseThinkingTextPath,
                        secretKey
                    };

                    await testConfig(testRequestData);
                } catch (error) {
                    console.error('[handleTestConfig] API key encryption canceled:', error);
                    return; // Stop test if canceled
                }
            } else if (currentConfig) {
                // If the original config was not encrypted, just test with plaintext
                const testRequestData: ApiConfigTestRequest = {
                    id: currentConfig.id,
                    name: formData.name,
                    apiUrl: formData.apiUrl,
                    apiKey: formData.apiKey,
                    apiKeyPlacement: formData.apiKeyPlacement,
                    apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                    apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                    headers: {'Content-Type': 'application/json'},
                    requestTemplate,
                    responseTemplate,
                    requestMessageGroupPath: paths.requestMessageGroupPath,
                    requestRolePathFromGroup: paths.requestRolePathFromGroup,
                    requestTextPathFromGroup: paths.requestTextPathFromGroup,
                    requestUserRoleField: paths.requestUserRoleField,
                    requestAssistantField: paths.requestAssistantField,
                    requestSystemField: paths.requestSystemField,
                    responseTextPath: paths.responseTextPath,
                    responseThinkingTextPath: paths.responseThinkingTextPath
                };

                await testConfig(testRequestData);
            }

            // Update the existing config with all form data fields
            // Keep the API key format consistent with the original config (encrypted or not)
            if (currentConfig) {
                const configUpdateData: Partial<ApiConfig> = {
                    name: formData.name,
                    apiUrl: formData.apiUrl,
                    apiKey: currentConfig.apiKey.startsWith('enc:') && secretKey ?
                        `enc:${encryptData(formData.apiKey, secretKey)}` : formData.apiKey,
                    apiKeyPlacement: formData.apiKeyPlacement,
                    apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                    apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                    headers: {'Content-Type': 'application/json'},
                    requestTemplate,
                    responseTemplate,
                    requestMessageGroupPath: paths.requestMessageGroupPath,
                    requestRolePathFromGroup: paths.requestRolePathFromGroup,
                    requestTextPathFromGroup: paths.requestTextPathFromGroup,
                    requestUserRoleField: paths.requestUserRoleField,
                    requestAssistantField: paths.requestAssistantField,
                    requestSystemField: paths.requestSystemField,
                    responseTextPath: paths.responseTextPath,
                    responseThinkingTextPath: paths.responseThinkingTextPath
                };

                updateConfig(currentConfig.id, configUpdateData).then(() => {
                    // Config is already fetched and set as current in updateConfig
                    console.log('[handleTestConfig] Setting current config by ID after update');
                    setCurrentConfigById(currentConfig.id);
                });
            }
        } catch (error) {
            console.error('[handleTestConfig] Failed to test configuration:', error);
            await dialog.alert({
                title: t('error'),
                message: t('invalid_json'),
                type: 'error'
            });
        }
    };

    return (
        <>
            <ConfigForm
                onSubmit={handleSubmit}
                key="form"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.3}}
            >
                <ConfigTitle>{currentConfig ? `${t('edit_configuration')}: ${currentConfig.name}` : t('new_configuration')}</ConfigTitle>

                <FormGroup>
                    <FormLabel htmlFor="name">{t('config_name')}</FormLabel>
                    <FormInput
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('config_name')}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="apiUrl">{t('api_url')}</FormLabel>
                    <FormInput
                        id="apiUrl"
                        name="apiUrl"
                        value={formData.apiUrl}
                        onChange={handleChange}
                        placeholder="https://api.example.com/chat/completions"
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="apiKey">{t('api_key')}</FormLabel>
                    <FormInputWithIcon>
                        <FormInput
                            id="apiKey"
                            name="apiKey"
                            type={showApiKey ? "text" : "password"}
                            value={formData.apiKey}
                            onChange={handleChange}
                            placeholder="sk-..."
                            required
                            style={{width: '100%', paddingRight: '40px'}}
                        />
                        <EyeIconButton type="button" onClick={toggleApiKeyVisibility}>
                            {showApiKey ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                        </EyeIconButton>
                    </FormInputWithIcon>
                </FormGroup>

                <FormGroup>
                    <FormLabel>{t('api_key_placement')}</FormLabel>
                    <RadioGroup>
                        <RadioOption>
                            <input
                                type="radio"
                                id="placement-header"
                                name="apiKeyPlacement"
                                value="header"
                                checked={formData.apiKeyPlacement === 'header'}
                                onChange={() => handleApiKeyPlacementChange('header')}
                            />
                            <label htmlFor="placement-header">{t('default_authorization_header')}</label>
                        </RadioOption>
                        <RadioOption>
                            <input
                                type="radio"
                                id="placement-custom-header"
                                name="apiKeyPlacement"
                                value="custom_header"
                                checked={formData.apiKeyPlacement === 'custom_header'}
                                onChange={() => handleApiKeyPlacementChange('custom_header')}
                            />
                            <label htmlFor="placement-custom-header">{t('custom_header')}</label>
                        </RadioOption>
                        <RadioOption>
                            <input
                                type="radio"
                                id="placement-body"
                                name="apiKeyPlacement"
                                value="body"
                                checked={formData.apiKeyPlacement === 'body'}
                                onChange={() => handleApiKeyPlacementChange('body')}
                            />
                            <label htmlFor="placement-body">{t('request_body')}</label>
                        </RadioOption>
                    </RadioGroup>

                    {formData.apiKeyPlacement === 'custom_header' && (
                        <FormSubGroup>
                            <FormLabel htmlFor="apiKeyHeader">{t('header_name')}</FormLabel>
                            <FormInput
                                id="apiKeyHeader"
                                name="apiKeyHeader"
                                value={formData.apiKeyHeader}
                                onChange={handleChange}
                                placeholder="X-API-Key"
                                required
                            />
                            <HelperText>{t('header_name_helper')}</HelperText>
                        </FormSubGroup>
                    )}

                    {formData.apiKeyPlacement === 'body' && (
                        <FormSubGroup>
                            <FormLabel htmlFor="apiKeyBodyPath">{t('body_path')}</FormLabel>
                            <FormInput
                                id="apiKeyBodyPath"
                                name="apiKeyBodyPath"
                                value={formData.apiKeyBodyPath}
                                onChange={handleChange}
                                placeholder="api_key"
                                required
                                onBlur={handleApiKeyBodyPathChange}
                            />
                            <HelperText>{t('body_path_helper')}</HelperText>
                        </FormSubGroup>
                    )}
                </FormGroup>

                <SectionTitle>{t('request_configuration')}</SectionTitle>
                <FormGroup>
                    <JSONEditor
                        value={formData.requestTemplate}
                        onChange={(value) => handleJsonChange('requestTemplate', value)}
                        height="500px"
                        label={t('request_template_json')}
                        tooltip={t('request_template_tooltip')}
                        paths={paths}
                        onPathsChange={handlePathsChange}
                        isRequestTemplate={true}
                    />
                </FormGroup>

                <SectionTitle>{t('response_configuration')}</SectionTitle>
                <HelperText
                    style={{marginBottom: '16px'}}>{t('response_no_message_group') || "The response does not use message groups - paths are for direct extraction from response JSON"}</HelperText>

                <FormGroup>
                    <JSONEditor
                        value={formData.responseTemplate}
                        onChange={(value) => handleJsonChange('responseTemplate', value)}
                        height="500px"
                        label={t('response_template_json')}
                        tooltip={t('response_template_tooltip')}
                        paths={paths}
                        onPathsChange={handlePathsChange}
                        isRequestTemplate={false}
                    />
                </FormGroup>

                <FormActions>
                    <TestButton
                        id="test-button"
                        type="button"
                        onClick={handleTestConfig}
                        disabled={isLoading}
                        whileHover={{
                            scale: 1.03,
                        }}
                        whileTap={{scale: 0.97}}
                    >
                        {t('test_connection')}
                    </TestButton>
                    <ActionButton
                        type="button"
                        onClick={handleCancelEdit}
                        className="secondary"
                        whileHover={{scale: 1.03, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}
                        whileTap={{scale: 0.97}}
                    >
                        <FiX/>
                        <span>{t('cancel')}</span>
                    </ActionButton>
                    <ActionButton
                        type="submit"
                        disabled={isLoading}
                        whileHover={{
                            scale: 1.03,
                        }}
                        whileTap={{scale: 0.97}}
                    >
                        <FiCheck/>
                        <span>{t('save')}</span>
                    </ActionButton>
                </FormActions>

                <AnimatePresence>
                    {error && (
                        <ErrorMessage
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                            transition={{duration: 0.2}}
                        >
                            <FiAlertTriangle size={18}/>
                            <span>{error}</span>
                        </ErrorMessage>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {testResult && (
                        <TestResponse testResult={testResult}/>
                    )}
                </AnimatePresence>
            </ConfigForm>
            {secretKeyDialogComponent}
        </>
    );
};

const ConfigForm = styled(motion.form)`
    padding: 20px;
`;

const ConfigTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.3rem;
    color: ${({theme}) => theme.colors.primary};
`

const FormGroup = styled.div`
    margin-bottom: 16px;
`;

const FormSubGroup = styled.div`
    margin-top: 12px;
    margin-bottom: 16px;
    padding: 14px;
    border-left: 2px solid ${({theme}) => theme.colors.primary};
    background-color: ${({theme}) => theme.colors.background};
    border-radius: ${({theme}) => theme.borderRadius};
`;

const FormInputWithIcon = styled.div`
    display: flex;
    position: relative;
    width: 100%;
`;

const FormLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.95rem;
    color: ${({theme}) => theme.colors.text};
`;

const FormInput = styled.input`
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

const FormActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
`;

const RadioGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
`;

const RadioOption = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    input[type="radio"] {
        margin-right: 10px;
        cursor: pointer;
    }

    label {
        cursor: pointer;
        font-size: 0.95rem;
    }
`;

const HelperText = styled.div`
    font-size: 0.8rem;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
    margin-top: 4px;
`;

const ErrorMessage = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px;
    background-color: #ffdede;
    color: #d33;
    border-radius: ${({theme}) => theme.borderRadius};
    animation: ${fadeIn} 0.3s ease;
`;

const EyeIconButton = styled.button`
    position: absolute;
    right: 10px;
    background-color: transparent !important;
    border: none;
    cursor: pointer;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.6;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const TestButton = styled(motion.button)`
    margin-right: auto;
    padding: 8px 16px;
    background-color: transparent;
    color: ${({theme}) => theme.colors.primary};
    border: 1px solid ${({theme}) => theme.colors.primary};
    border-radius: ${({theme}) => theme.borderRadius};
    cursor: pointer;
    transition: ${colorTransition};
    font-weight: 500;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:hover {
        color: ${({theme}) => theme.colors.text};
    }
`;

const SectionTitle = styled.h4`
    margin-top: 24px;
    margin-bottom: 12px;
    font-size: 1.1rem;
    color: ${({theme}) => theme.colors.primary};
`;

export default ConfigEditForm;