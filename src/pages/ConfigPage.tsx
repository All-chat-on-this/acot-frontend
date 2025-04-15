import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import {Layout} from '@/components/Layout';
import JSONEditor from '@/components/JSONEditor/JSONEditor';
import useConfigStore from '@/store/configStore';
import {FiAlertTriangle, FiCheck, FiEdit, FiEye, FiEyeOff, FiPlus, FiTrash2, FiX} from 'react-icons/fi';
import {colorTransition, fadeIn, slideUp} from '@/styles/animations';

const ConfigPage: React.FC = () => {
    const {t} = useTranslation();
    const {
        configs,
        currentConfig,
        fetchConfigs,
        createConfig,
        updateConfig,
        deleteConfig,
        setCurrentConfig,
        testConfig,
        testResult,
        isLoading,
        error,
        fetchModelStatus
    } = useConfigStore();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        apiUrl: '',
        apiKey: '',
        apiKeyPlacement: 'header' as 'header' | 'body' | 'custom_header',
        apiKeyHeader: '',
        apiKeyBodyPath: '',
        requestTemplate: '{\n  "model": "gpt-3.5-turbo",\n  "messages": [\n    { "role": "system", "content": "You are a helpful assistant." }\n  ]\n}',
        responseTemplate: '{\n  "roleField": "choices[0].message.role",\n  "contentField": "choices[0].message.content",\n  "thinkingTextField": null\n}'
    });

    const [lastApiKeyBodyPath, setLastApiKeyBodyPath] = useState('');

    const [paths, setPaths] = useState({
        roleField: 'choices[0].message.role',
        contentField: 'choices[0].message.content',
        thinkingTextField: null as string | null
    });

    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    useEffect(() => {
        if (currentConfig) {
            fetchModelStatus(currentConfig.id);
        }
    }, [currentConfig]);

    useEffect(() => {
        if (currentConfig) {
            setFormData({
                name: currentConfig.name,
                apiUrl: currentConfig.apiUrl,
                apiKey: currentConfig.apiKey,
                apiKeyPlacement: currentConfig.apiKeyPlacement || 'header',
                apiKeyHeader: currentConfig.apiKeyHeader || '',
                apiKeyBodyPath: currentConfig.apiKeyBodyPath || '',
                requestTemplate: JSON.stringify(currentConfig.requestTemplate, null, 2),
                responseTemplate: JSON.stringify(currentConfig.responseTemplate, null, 2)
            });
            setLastApiKeyBodyPath(currentConfig.apiKeyBodyPath || '');
        }
    }, [currentConfig]);

    useEffect(() => {
        if (currentConfig && editMode) {
            setFormData({
                name: currentConfig.name,
                apiUrl: currentConfig.apiUrl,
                apiKey: currentConfig.apiKey,
                apiKeyPlacement: currentConfig.apiKeyPlacement || 'header',
                apiKeyHeader: currentConfig.apiKeyHeader || '',
                apiKeyBodyPath: currentConfig.apiKeyBodyPath || '',
                requestTemplate: JSON.stringify(currentConfig.requestTemplate, null, 2),
                responseTemplate: JSON.stringify(currentConfig.responseTemplate, null, 2)
            });
            setLastApiKeyBodyPath(currentConfig.apiKeyBodyPath || '');

            // Extract paths from current config's responseTemplate if it exists
            if (currentConfig.responseTemplate) {
                setPaths({
                    roleField: currentConfig.responseTemplate.roleField || '',
                    contentField: currentConfig.responseTemplate.contentField || '',
                    thinkingTextField: currentConfig.responseTemplate.thinkingTextField || null
                });
            }
        }
    }, [currentConfig, editMode]);

    useEffect(() => {
        handleApiKeyBodyPathChange();
    }, [formData.apiKeyBodyPath, formData.apiKey]);

    const handleNewConfig = () => {
        setEditMode(true);
        setCurrentConfig(null);
        setFormData({
            name: t('new_configuration'),
            apiUrl: 'https://api.example.com/chat/completions',
            apiKey: '',
            apiKeyPlacement: 'header',
            apiKeyHeader: '',
            apiKeyBodyPath: '',
            requestTemplate: '{\n  "model": "gpt-3.5-turbo",\n  "messages": [\n    { "role": "system", "content": "You are a helpful assistant." }\n  ]\n}',
            responseTemplate: '{\n  "roleField": "choices[0].message.role",\n  "contentField": "choices[0].message.content",\n  "thinkingTextField": null\n}'
        });
        setLastApiKeyBodyPath('');

        setPaths({
            roleField: 'choices[0].message.role',
            contentField: 'choices[0].message.content',
            thinkingTextField: null as string | null
        });
    };

    const handleEditConfig = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

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
                console.log('apiKeyBodyPath:' + formData.apiKeyBodyPath);

                // Update form
                setFormData(prev => ({
                    ...prev,
                    requestTemplate: JSON.stringify(cleanTemplate, null, 2)
                }));

                console.log('formData.apiKeyBodyPath:' + formData.apiKeyBodyPath);

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

    const handlePathsChange = (newPaths: any) => {
        setPaths(newPaths);
    };

    const handleSelectConfig = (configId: number) => {
        const config = configs.find(c => c.id === configId);
        if (config) {
            setCurrentConfig(config);
        }
    };

    const handleDeleteConfig = async () => {
        if (!currentConfig) return;

        if (window.confirm(t('delete_confirm', {name: currentConfig.name}))) {
            await deleteConfig(currentConfig.id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Parse JSON templates
            let requestTemplate = JSON.parse(formData.requestTemplate);
            const responseTemplate = {
                ...JSON.parse(formData.responseTemplate),
                roleField: paths.roleField,
                contentField: paths.contentField,
                thinkingTextField: paths.thinkingTextField
            };

            // If apiKeyPlacement is 'body', ensure the field exists in requestTemplate
            if (formData.apiKeyPlacement === 'body' && formData.apiKeyBodyPath) {
                if (requestTemplate[formData.apiKeyBodyPath] === undefined) {
                    requestTemplate = {
                        ...requestTemplate,
                        [formData.apiKeyBodyPath]: formData.apiKey
                    };
                }
            }

            const configData = {
                name: formData.name,
                apiUrl: formData.apiUrl,
                apiKey: formData.apiKey,
                apiKeyPlacement: formData.apiKeyPlacement,
                apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                headers: {'Content-Type': 'application/json'},
                requestTemplate,
                responseTemplate
            };

            if (currentConfig) {
                await updateConfig(currentConfig.id, configData);
            } else {
                await createConfig(configData);
            }

            setEditMode(false);
        } catch (error) {
            console.error('Failed to save configuration:', error);
            alert(t('invalid_json'));
        }
    };

    const handleTestConfig = async () => {
        try {
            // Parse JSON templates
            let requestTemplate = JSON.parse(formData.requestTemplate);
            const responseTemplate = {
                ...JSON.parse(formData.responseTemplate),
                roleField: paths.roleField,
                contentField: paths.contentField,
                thinkingTextField: paths.thinkingTextField
            };

            // If apiKeyPlacement is 'body', ensure the field exists in requestTemplate
            if (formData.apiKeyPlacement === 'body' && formData.apiKeyBodyPath) {
                if (requestTemplate[formData.apiKeyBodyPath] === undefined) {
                    requestTemplate = {
                        ...requestTemplate,
                        [formData.apiKeyBodyPath]: formData.apiKey
                    };
                }
            }

            const configData = {
                name: formData.name,
                apiUrl: formData.apiUrl,
                apiKey: formData.apiKey,
                apiKeyPlacement: formData.apiKeyPlacement,
                apiKeyHeader: formData.apiKeyPlacement === 'custom_header' ? formData.apiKeyHeader : undefined,
                apiKeyBodyPath: formData.apiKeyPlacement === 'body' ? formData.apiKeyBodyPath : undefined,
                headers: {'Content-Type': 'application/json'},
                requestTemplate,
                responseTemplate
            };

            await testConfig(configData);
        } catch (error) {
            console.error('Failed to test configuration:', error);
            alert(t('invalid_json'));
        }
    };

    const toggleApiKeyVisibility = () => {
        setShowApiKey(prev => !prev);
    };

    // Animation variants
    const pageVariants = {
        initial: {opacity: 0},
        animate: {opacity: 1, transition: {duration: 0.3}},
        exit: {opacity: 0, transition: {duration: 0.3}}
    };

    const configItemVariants = {
        initial: {opacity: 0, y: 5},
        animate: {opacity: 1, y: 0, transition: {duration: 0.2}},
        hover: {
            scale: 1.01,
            transition: {duration: 0.15}
        },
        tap: {scale: 0.98}
    };

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

    const TestResult = styled(motion.div)`
        margin-top: 16px;
        padding: 16px;
        border-radius: ${({theme}) => theme.borderRadius};

        h4 {
            margin: 0 0 12px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        h4::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        p {
            margin: 0 0 12px;
            line-height: 1.5;
        }

        &.success {
            background-color: #e8f5e9;
            color: #2e7d32;

            h4::before {
                background-color: #2e7d32;
            }
        }

        &.error {
            background-color: #ffdede;
            color: #d33;

            h4::before {
                background-color: #d33;
            }
        }
    `;

    const ConfigDetailValueWithIcon = styled.div`
        display: flex;
        align-items: center;
        position: relative;

        ${ConfigDetailValue} {
            flex: 1;
            padding-right: 40px;
        }
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

    const EmptyState = styled(motion.div)`
        padding: 40px 20px;
        text-align: center;
        color: ${({theme}) => theme.colors.text};
        opacity: 0.7;
        border: 1px dashed ${({theme}) => theme.colors.border};
        border-radius: ${({theme}) => theme.borderRadius};
        margin: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        white-space: pre-line;

        &::before {
            content: '';
            display: block;
            width: 60px;
            height: 60px;
            margin-bottom: 16px;
            background: ${({theme}) => theme.colors.border};
            mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z'/%3E%3C/svg%3E");
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center;
        }
    `;

    return (
        <Layout>
            <PageContainer
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
            >
                <ConfigHeader>
                    <motion.h2
                        initial={{y: -10, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.3, delay: 0.1}}
                    >{t('api_configs')}</motion.h2>
                    {!editMode && (
                        <ActionButton
                            onClick={handleNewConfig}
                            whileHover={{scale: 1.03, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}
                            whileTap={{scale: 0.97}}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.3, delay: 0.2}}
                        >
                            <FiPlus/>
                            <span>{t('new_config')}</span>
                        </ActionButton>
                    )}
                </ConfigHeader>

                <ConfigLayout>
                    {/* Config List */}
                    <ConfigList>
                        <h3>{t('your_configs')}</h3>
                        {configs.length > 0 ? (
                            <ConfigItems>
                                <AnimatePresence>
                                    {configs.map((config, index) => (
                                        <ConfigItem
                                            key={config.id}
                                            className={currentConfig?.id === config.id ? 'active' : ''}
                                            onClick={() => handleSelectConfig(config.id)}
                                            variants={configItemVariants}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            whileTap="tap"
                                            transition={{delay: index * 0.05}}
                                        >
                                            <div>{config.name}</div>
                                            <ConfigItemUrl>{config.apiUrl}</ConfigItemUrl>
                                        </ConfigItem>
                                    ))}
                                </AnimatePresence>
                            </ConfigItems>
                        ) : (
                            <EmptyState>
                                {t('no_configs')}
                            </EmptyState>
                        )}
                    </ConfigList>

                    {/* Config Details/Editor */}
                    <ConfigDetails>
                        <AnimatePresence mode="wait">
                            {currentConfig && !editMode ? (
                                <ConfigDetailContent
                                    key="details"
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.3}}
                                >
                                    <ConfigDetailsHeader>
                                        <h3>{currentConfig.name}</h3>
                                        <ConfigActions>
                                            <ActionButton
                                                onClick={handleEditConfig}
                                                whileHover={{
                                                    scale: 1.05,
                                                }}
                                                whileTap={{scale: 0.95}}
                                            >
                                                <FiEdit/>
                                                <span>{t('edit')}</span>
                                            </ActionButton>
                                            <ActionButton
                                                onClick={handleDeleteConfig}
                                                className="danger"
                                                whileHover={{scale: 1.05, backgroundColor: '#d32f2f'}}
                                                whileTap={{scale: 0.95}}
                                            >
                                                <FiTrash2/>
                                                <span>{t('delete')}</span>
                                            </ActionButton>
                                        </ConfigActions>
                                    </ConfigDetailsHeader>

                                    <ConfigDetail>
                                        <ConfigDetailLabel>{t('api_url')}</ConfigDetailLabel>
                                        <ConfigDetailValue>{currentConfig.apiUrl}</ConfigDetailValue>
                                    </ConfigDetail>

                                    <ConfigDetail>
                                        <ConfigDetailLabel>{t('api_key')}</ConfigDetailLabel>
                                        <ConfigDetailValueWithIcon>
                                            <ConfigDetailValue>{showApiKey ? currentConfig.apiKey : '••••••••••••••••••••••'}</ConfigDetailValue>
                                            <EyeIconButton onClick={toggleApiKeyVisibility}>
                                                {showApiKey ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                                            </EyeIconButton>
                                        </ConfigDetailValueWithIcon>
                                    </ConfigDetail>

                                    <ConfigDetail>
                                        <ConfigDetailLabel>{t('api_key_placement')}</ConfigDetailLabel>
                                        <ConfigDetailValue>
                                            {currentConfig.apiKeyPlacement === 'header' && t('default_authorization_header')}
                                            {currentConfig.apiKeyPlacement === 'custom_header' && (
                                                <>
                                                    {t('custom_header')}: {currentConfig.apiKeyHeader}
                                                </>
                                            )}
                                            {currentConfig.apiKeyPlacement === 'body' && (
                                                <>
                                                    {t('request_body')}: {currentConfig.apiKeyBodyPath}
                                                </>
                                            )}
                                            {!currentConfig.apiKeyPlacement && t('default_authorization_header')}
                                        </ConfigDetailValue>
                                    </ConfigDetail>

                                    <ConfigDetail>
                                        <ConfigDetailLabel>{t('request_template')}</ConfigDetailLabel>
                                        <JSONEditor
                                            value={JSON.stringify(currentConfig.requestTemplate, null, 2)}
                                            onChange={() => {
                                            }}
                                            readOnly={true}
                                        />
                                    </ConfigDetail>

                                    <ConfigDetail>
                                        <ConfigDetailLabel>{t('response_template')}</ConfigDetailLabel>
                                        <JSONEditor
                                            value={JSON.stringify(currentConfig.responseTemplate, null, 2)}
                                            onChange={() => {
                                            }}
                                            readOnly={true}
                                        />
                                    </ConfigDetail>
                                </ConfigDetailContent>
                            ) : editMode ? (
                                <ConfigForm
                                    onSubmit={handleSubmit}
                                    key="form"
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.3}}
                                >
                                    <h3>{currentConfig ? `${t('edit_configuration')}: ${currentConfig.name}` : t('new_configuration')}</h3>

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
                                                <label
                                                    htmlFor="placement-header">{t('default_authorization_header')}</label>
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
                                                />
                                                <HelperText>
                                                    {t('body_path_helper')}
                                                </HelperText>

                                                {formData.apiKeyBodyPath && (
                                                    <>
                                                        <HelperText style={{marginTop: '12px', fontWeight: 'bold'}}>
                                                            {t('api_key_body_note')}
                                                        </HelperText>
                                                        <HelperText style={{
                                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                                            padding: '6px 8px',
                                                            borderRadius: '4px',
                                                            fontFamily: 'monospace',
                                                            marginTop: '4px'
                                                        }}>
                                                            {`'${formData.apiKeyBodyPath}': ${'*'.repeat(formData.apiKey.length)}`}
                                                        </HelperText>
                                                    </>
                                                )}
                                            </FormSubGroup>
                                        )}
                                    </FormGroup>

                                    <FormGroup>
                                        <JSONEditor
                                            value={formData.requestTemplate}
                                            onChange={(value) => handleJsonChange('requestTemplate', value)}
                                            height="200px"
                                            label={t('request_template_json')}
                                            tooltip={t('request_template_tooltip')}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <JSONEditor
                                            value={formData.responseTemplate}
                                            onChange={(value) => handleJsonChange('responseTemplate', value)}
                                            height="150px"
                                            label={t('response_template_json')}
                                            tooltip={t('response_template_tooltip')}
                                            paths={paths}
                                            onPathsChange={handlePathsChange}
                                        />
                                    </FormGroup>

                                    <FormActions>
                                        <TestButton
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
                                            <TestResult
                                                className={testResult.success ? 'success' : 'error'}
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 10}}
                                                transition={{duration: 0.3}}
                                            >
                                                <h4>{testResult.success ? t('connection_successful') : t('connection_failed')}</h4>
                                                <p>{testResult.message}</p>
                                                {testResult.success && testResult.response && (
                                                    <div style={{marginTop: '8px'}}>
                                                        <JSONEditor
                                                            value={JSON.stringify(testResult.response, null, 2)}
                                                            onChange={() => {
                                                            }}
                                                            height="250px"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                )}
                                            </TestResult>
                                        )}
                                    </AnimatePresence>
                                </ConfigForm>
                            ) : (
                                <EmptyState
                                    key="empty"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.3}}
                                >
                                    {t('select_config')}
                                </EmptyState>
                            )}
                        </AnimatePresence>
                    </ConfigDetails>
                </ConfigLayout>
            </PageContainer>
        </Layout>
    );
};

const PageContainer = styled(motion.div)`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const ConfigHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h2 {
        margin: 0;
        font-size: 1.8rem;
        background: linear-gradient(90deg, ${({theme}) => theme.colors.primary}, ${({theme}) => theme.colors.secondary || theme.colors.primary}D0);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`;

const ConfigLayout = styled.div`
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

const ConfigList = styled.div`
    background-color: ${({theme}) => theme.colors.card};
    padding: 16px;
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    height: fit-content;
    animation: ${slideUp} 0.3s ease;

    h3 {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 1.2rem;
        color: ${({theme}) => theme.colors.primary};
    }
`;

const ConfigItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ConfigItem = styled(motion.div)`
    padding: 12px;
    border-radius: ${({theme}) => theme.borderRadius};
    cursor: pointer;
    border: 1px solid ${({theme}) => theme.colors.border};
    transition: ${colorTransition};

    &.active {
        border-color: ${({theme}) => theme.colors.primary};
    }
`;

const ConfigItemUrl = styled.div`
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ConfigDetails = styled.div`
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    min-height: 500px;
`;

const ConfigDetailContent = styled(motion.div)`
    padding: 20px;
`;

const ConfigDetailsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
    padding-bottom: 16px;

    h3 {
        margin: 0;
        font-size: 1.3rem;
        color: ${({theme}) => theme.colors.primary};
    }
`;

const ConfigActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ConfigDetail = styled.div`
    margin-bottom: 16px;
    animation: ${fadeIn} 0.4s ease;
`;

const ConfigDetailLabel = styled.div`
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9rem;
    color: ${({theme}) => theme.colors.secondary || theme.colors.primary};
`;

const ConfigDetailValue = styled.div`
    padding: 10px 12px;
    background-color: ${({theme}) => theme.colors.input};
    border-radius: ${({theme}) => theme.borderRadius};
    font-family: monospace;
    word-break: break-all;
    font-size: 0.95rem;
`;

const ActionButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: ${({theme}) => theme.borderRadius};
    background-color: ${({theme}) => theme.colors.primary};
    color: ${({theme}) => theme.colors.buttonText};
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    transition: ${colorTransition};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.secondary {
        background-color: transparent;
        color: ${({theme}) => theme.colors.text};
        border: 1px solid ${({theme}) => theme.colors.border};
        box-shadow: none;
    }

    &.danger {
        background-color: #e53935;
    }
`;

const ConfigForm = styled(motion.form)`
    padding: 20px;

    h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.3rem;
        color: ${({theme}) => theme.colors.primary};
    }
`;

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
`;

export default ConfigPage;