import React from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {FiEdit, FiEye, FiEyeOff, FiTrash2} from 'react-icons/fi';
import JSONEditor from '@/components/JSONEditor/JSONEditor';
import {fadeIn} from '@/styles/animations';
import useConfigStore from '@/store/configStore';
import {ActionButton} from '../ConfigPage';
import {useTranslation} from "react-i18next";
import {ApiConfig} from "@/api/type/configApi.ts";
import {useDialog} from '@/components/Dialog';

interface ConfigDetailViewProps {
    currentConfig: ApiConfig;
    showApiKey: boolean;
    toggleApiKeyVisibility: () => void;
    handleEditConfig: () => void;
}

const ConfigDetailView: React.FC<ConfigDetailViewProps> = ({
                                                               currentConfig,
                                                               showApiKey,
                                                               toggleApiKeyVisibility,
                                                               handleEditConfig,
                                                           }) => {
    const {deleteConfig} = useConfigStore();
    const {t} = useTranslation();
    const dialog = useDialog();

    // Add fallback translations for new keys
    const available = t('available', 'Available');
    const unavailable = t('unavailable', 'Unavailable');

    const handleDeleteConfig = async () => {
        if (!currentConfig) return;

        const confirmed = await dialog.confirm({
            title: t('delete_confirmation'),
            message: t('delete_confirm', {name: currentConfig.name}),
            type: 'warning',
            confirmLabel: t('delete'),
            cancelLabel: t('cancel')
        });

        if (confirmed) {
            await deleteConfig(currentConfig.id);
        }
    };

    // Initialize paths for JSONEditor
    const paths = {
        requestMessageGroupPath: currentConfig.requestMessageGroupPath || 'messages',
        requestRolePathFromGroup: currentConfig.requestRolePathFromGroup || 'role',
        requestTextPathFromGroup: currentConfig.requestTextPathFromGroup || 'content',
        requestUserRoleField: currentConfig.requestUserRoleField || 'user',
        requestAssistantField: currentConfig.requestAssistantField || 'assistant',
        requestSystemField: currentConfig.requestSystemField || 'system',
        responseTextPath: currentConfig.responseTextPath || 'choices[0].message.content',
        responseThinkingTextPath: currentConfig.responseThinkingTextPath || 'choices[0].message.reasoning_content'
    };

    return (
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

            <AvailabilityStatus available={currentConfig.isAvailable}>
                {currentConfig.isAvailable ? available : unavailable}
            </AvailabilityStatus>

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

            <SectionTitle>{t('request_configuration')}</SectionTitle>

            <ConfigDetail>
                <ConfigDetailLabel>{t('message_group_path')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.requestMessageGroupPath || 'messages'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('role_path_in_group')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.requestRolePathFromGroup || 'role'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('content_path_in_group')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.requestTextPathFromGroup || 'content'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('user_role')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.requestUserRoleField || 'user'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('assistant_role')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.requestAssistantField || 'assistant'}</ConfigDetailValue>
            </ConfigDetail>

            {/*<ConfigDetail>*/}
            {/*    <ConfigDetailLabel>{t('system_role')}</ConfigDetailLabel>*/}
            {/*    <ConfigDetailValue>{currentConfig.requestSystemField || 'system'}</ConfigDetailValue>*/}
            {/*</ConfigDetail>*/}

            <ConfigDetail>
                <ConfigDetailLabel>{t('request_template')}</ConfigDetailLabel>
                <JSONEditor
                    value={JSON.stringify(currentConfig.requestTemplate, null, 2)}
                    onChange={() => {
                    }}
                    readOnly={true}
                    isRequestTemplate={true}
                    paths={paths}
                />
            </ConfigDetail>

            <SectionTitle>{t('response_configuration')}</SectionTitle>

            <ConfigDetail>
                <ConfigDetailLabel>{t('response_text_path')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.responseTextPath || 'choices[0].message.content'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('response_thinking_path')}</ConfigDetailLabel>
                <ConfigDetailValue>{currentConfig.responseThinkingTextPath || 'choices[0].message.reasoning_content'}</ConfigDetailValue>
            </ConfigDetail>

            <ConfigDetail>
                <ConfigDetailLabel>{t('response_template')}</ConfigDetailLabel>
                <JSONEditor
                    value={JSON.stringify(currentConfig.responseTemplate, null, 2)}
                    onChange={() => {
                    }}
                    readOnly={true}
                    isRequestTemplate={false}
                    paths={paths}
                />
            </ConfigDetail>
        </ConfigDetailContent>
    );
};

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

const AvailabilityStatus = styled.div<{ available: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-bottom: 10px;
    background-color: ${props => props.available ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
    color: ${props => props.available ? '#4caf50' : '#f44336'};

    &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${props => props.available ? '#4caf50' : '#f44336'};
    }
`;

const SectionTitle = styled.h4`
    margin-top: 24px;
    margin-bottom: 12px;
    font-size: 1.1rem;
    color: ${({theme}) => theme.colors.primary};
`;

export default ConfigDetailView; 