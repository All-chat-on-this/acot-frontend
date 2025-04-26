import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';
import {AnimatePresence, motion} from 'framer-motion';
import {Layout} from '@/components/Layout';
import useConfigStore from '@/store/configStore';
import {FiPlus} from 'react-icons/fi';
import {colorTransition, slideUp} from '@/styles/animations';
import ConfigDetailView from './config/ConfigDetailView';
import ConfigEditForm from './config/ConfigEditForm';

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

const ConfigPage: React.FC = () => {
    const {t} = useTranslation();

    const {
        configs,
        currentConfig,
        fetchConfigs,
        setCurrentConfig,
        resetTestResult,
        isLoading
    } = useConfigStore();

    const [editMode, setEditMode] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    const handleNewConfig = () => {
        setEditMode(true);
        setCurrentConfig(null);
        resetTestResult();
    };

    const handleEditConfig = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleSelectConfig = (configId: number) => {
        const config = configs.find(c => c.id === configId);
        if (config) {
            setCurrentConfig(config);
            resetTestResult();
        }
    };

    const toggleApiKeyVisibility = () => {
        setShowApiKey(prev => !prev);
    };

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
                                            <AvailabilityIndicator available={config.isAvailable}/>
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
                                <ConfigDetailView
                                    currentConfig={currentConfig}
                                    showApiKey={showApiKey}
                                    toggleApiKeyVisibility={toggleApiKeyVisibility}
                                    handleEditConfig={handleEditConfig}
                                />
                            ) : editMode ? (
                                <ConfigEditForm
                                    currentConfig={currentConfig}
                                    showApiKey={showApiKey}
                                    toggleApiKeyVisibility={toggleApiKeyVisibility}
                                    handleCancelEdit={handleCancelEdit}
                                    isLoading={isLoading}
                                />
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
    position: relative;

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

const AvailabilityIndicator = styled.div<{ available: boolean }>`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.available ? '#4caf50' : '#f44336'};
    box-shadow: 0 0 4px ${props => props.available ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'};
`;

const ConfigDetails = styled.div`
    background-color: ${({theme}) => theme.colors.card};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    min-height: 500px;
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

export const ActionButton = styled(motion.button)`
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

export default ConfigPage;