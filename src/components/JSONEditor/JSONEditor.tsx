import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import Editor, {BeforeMount, loader, OnChange, OnMount} from '@monaco-editor/react';
import {FaCode, FaCog, FaEdit, FaInfoCircle} from 'react-icons/fa';
import {motion} from 'framer-motion';
import {colorTransition, fadeIn} from '@/styles/animations';
import {useTranslation} from 'react-i18next';
import JSONViewer from './JSONViewer';
import {ThemeContext} from '@/theme/ThemeProvider';

interface JSONEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
    label?: string;
    tooltip?: string;
    error?: string;
    paths?: {
        // Request configuration fields
        requestMessageGroupPath?: string;
        requestRolePathFromGroup?: string;
        requestTextPathFromGroup?: string;
        requestUserRoleField?: string;
        requestAssistantField?: string;
        requestSystemField?: string;
        // Response configuration fields
        responseTextPath?: string;
        responseThinkingTextPath?: string;
    };
    onPathsChange?: (paths: {
        // Request configuration fields
        requestMessageGroupPath: string;
        requestRolePathFromGroup: string;
        requestTextPathFromGroup: string;
        requestUserRoleField: string;
        requestAssistantField: string;
        requestSystemField: string;
        // Response configuration fields
        responseTextPath: string;
        responseThinkingTextPath: string;
    }) => void;
    readOnly?: boolean;
    // To toggle between request/response sections in path editor
    isRequestTemplate?: boolean;
}

// load loader.js from local node_modules
loader.config({
    paths: {
        vs: '/monaco-editor/min/vs'
    }
});

const JSONEditor: React.FC<JSONEditorProps> = ({
                                                   value,
                                                   onChange,
                                                   height,
                                                   label,
                                                   tooltip,
                                                   error,
                                                   paths,
                                                   onPathsChange,
                                                   readOnly = false,
                                                   isRequestTemplate
                                               }) => {
    const {t} = useTranslation();
    const {isDark} = useContext(ThemeContext);
    const [editorValue, setEditorValue] = useState(value);
    const [showPathEditor, setShowPathEditor] = useState(false);
    const [isEditing, setIsEditing] = useState(!readOnly);
    const [originalJson, setOriginalJson] = useState(value);
    const [editorError, setEditorError] = useState<string | null>(null);
    const [localPaths, setLocalPaths] = useState(paths || {
        // Default values for request configuration
        requestMessageGroupPath: 'messages',
        requestRolePathFromGroup: 'role',
        requestTextPathFromGroup: 'content',
        requestUserRoleField: 'user',
        requestAssistantField: 'assistant',
        requestSystemField: 'system',
        // Default values for response configuration
        responseTextPath: 'choices[0].message.content',
        responseThinkingTextPath: ''
    });

    // Calculate the actual height respecting min and max constraints
    const calculatedHeight = () => {
        // If height is a number (without px), add px
        const heightValue = typeof height === 'number' ? `${height}px` : height;
        return heightValue;
    };

    useEffect(() => {
        setEditorValue(value);
        if (!isEditing) {
            setOriginalJson(value);
        }
    }, [value, isEditing]);

    useEffect(() => {
        if (paths) {
            // Ensure all fields are present with defaults when updating from props
            setLocalPaths({
                requestMessageGroupPath: paths.requestMessageGroupPath || 'messages',
                requestRolePathFromGroup: paths.requestRolePathFromGroup || 'role',
                requestTextPathFromGroup: paths.requestTextPathFromGroup || 'content',
                requestUserRoleField: paths.requestUserRoleField || 'user',
                requestAssistantField: paths.requestAssistantField || 'assistant',
                requestSystemField: paths.requestSystemField || 'system',
                responseTextPath: paths.responseTextPath || 'choices[0].message.content',
                responseThinkingTextPath: paths.responseThinkingTextPath || ''
            });
        }
    }, [paths]);

    const handleEditorChange: OnChange = (newValue) => {
        if (newValue) {
            setEditorValue(newValue);
            onChange(newValue);
        }
    };

    const handleEditorMount: OnMount = (editor) => {
        // Set up editor configs when mounted
        editor.updateOptions({
            wordWrap: 'on',
            minimap: {enabled: false},
            scrollBeyondLastLine: false,
            automaticLayout: true
        });
    };

    const handleBeforeMount: BeforeMount = () => {
        // Reset any previous errors when we attempt to mount again
        setEditorError(null);
    };

    const handlePathChange = (field: string, value: string) => {
        const newPaths = {...localPaths, [field]: value};
        setLocalPaths(newPaths);
        if (onPathsChange) {
            // Cast the paths to ensure all required fields are present
            onPathsChange({
                requestMessageGroupPath: newPaths.requestMessageGroupPath || 'messages',
                requestRolePathFromGroup: newPaths.requestRolePathFromGroup || 'role',
                requestTextPathFromGroup: newPaths.requestTextPathFromGroup || 'content',
                requestUserRoleField: newPaths.requestUserRoleField || 'user',
                requestAssistantField: newPaths.requestAssistantField || 'assistant',
                requestSystemField: newPaths.requestSystemField || 'system',
                responseTextPath: newPaths.responseTextPath || 'choices[0].message.content',
                responseThinkingTextPath: newPaths.responseThinkingTextPath || ''
            });
        }
    };

    const formatJson = () => {
        try {
            const parsedValue = JSON.parse(editorValue);
            const formattedValue = JSON.stringify(parsedValue, null, 2);
            setEditorValue(formattedValue);
            onChange(formattedValue);
        } catch (e) {
            // Don't format if it's not valid JSON
            console.error('Cannot format invalid JSON:', e);
        }
    };

    const startEditing = () => {
        setOriginalJson(value);
        setIsEditing(true);
    };

    // Fallback editor component when Monaco fails to load
    const FallbackEditor = () => (
        <FallbackTextarea
            value={editorValue}
            onChange={(e) => {
                const newValue = e.target.value;
                setEditorValue(newValue);
                onChange(newValue);
            }}
            style={{height: calculatedHeight()}}
        />
    );

    return (
        <EditorContainer>
            {label && (
                <EditorLabel>
                    <LabelGroup>
                        <div className="label-text">
                            <FaCode size={14} style={{marginRight: '6px'}}/>
                            {label}
                        </div>

                        {tooltip && (
                            <TooltipContainer>
                                <FaInfoCircle size={14}/>
                                <TooltipText>{tooltip}</TooltipText>
                            </TooltipContainer>
                        )}
                    </LabelGroup>

                    <EditorActions>
                        {readOnly && !isEditing && (
                            <ActionButton
                                onClick={startEditing}
                                whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                whileTap={{scale: 0.95}}
                                type="button"
                            >
                                <FaEdit size={14}/>
                                <span>{t('edit')}</span>
                            </ActionButton>
                        )}

                        {isEditing && (
                            <>
                                {showPathEditor ? (
                                    <ActionButton
                                        onClick={() => setShowPathEditor(false)}
                                        whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                        whileTap={{scale: 0.95}}
                                        type="button"
                                    >
                                        <FaCode size={14}/>
                                        <span>{t('code_view')}</span>
                                    </ActionButton>
                                ) : (
                                    <>
                                        <ActionButton
                                            onClick={formatJson}
                                            whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                            whileTap={{scale: 0.95}}
                                            type="button"
                                        >
                                            <span>{t('format')}</span>
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => setShowPathEditor(true)}
                                            whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                            whileTap={{scale: 0.95}}
                                            type="button"
                                        >
                                            <FaCog size={14}/>
                                            <span>{t('path_editor')}</span>
                                        </ActionButton>
                                        {readOnly && (
                                            <ActionButton
                                                onClick={() => setIsEditing(false)}
                                                whileHover={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                                                whileTap={{scale: 0.95}}
                                                type="button"
                                            >
                                                <span>{t('done')}</span>
                                            </ActionButton>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </EditorActions>
                </EditorLabel>
            )}

            <EditorWrapper iserror={!!error}>
                {isEditing ? (
                    <>
                        {showPathEditor ? (
                            <PathEditor>
                                {isRequestTemplate ? (
                                    // Request Template Path Editor
                                    <>
                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('message_group_path')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestMessageGroupPath || ''}
                                                onChange={(e) => handlePathChange('requestMessageGroupPath', e.target.value)}
                                                placeholder="messages"
                                            />
                                            <PathFieldDescription>
                                                {t('message_group_path_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('role_path_in_group')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestRolePathFromGroup || ''}
                                                onChange={(e) => handlePathChange('requestRolePathFromGroup', e.target.value)}
                                                placeholder="role"
                                            />
                                            <PathFieldDescription>
                                                {t('role_path_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('content_path_in_group')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestTextPathFromGroup || ''}
                                                onChange={(e) => handlePathChange('requestTextPathFromGroup', e.target.value)}
                                                placeholder="content"
                                            />
                                            <PathFieldDescription>
                                                {t('content_path_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('user_role')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestUserRoleField || ''}
                                                onChange={(e) => handlePathChange('requestUserRoleField', e.target.value)}
                                                placeholder="user"
                                            />
                                            <PathFieldDescription>
                                                {t('user_role_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('assistant_role')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestAssistantField || ''}
                                                onChange={(e) => handlePathChange('requestAssistantField', e.target.value)}
                                                placeholder="assistant"
                                            />
                                            <PathFieldDescription>
                                                {t('assistant_role_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('system_role')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.requestSystemField || ''}
                                                onChange={(e) => handlePathChange('requestSystemField', e.target.value)}
                                                placeholder="system"
                                            />
                                            <PathFieldDescription>
                                                {t('system_role_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>
                                    </>
                                ) : (
                                    // Response Template Path Editor
                                    <>
                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('response_text_path')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.responseTextPath || ''}
                                                onChange={(e) => handlePathChange('responseTextPath', e.target.value)}
                                                placeholder="choices[0].message.content"
                                            />
                                            <PathFieldDescription>
                                                {t('response_text_path_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>

                                        <PathFieldGroup>
                                            <PathFieldLabel>{t('response_thinking_path')}:</PathFieldLabel>
                                            <PathFieldInput
                                                type="text"
                                                value={localPaths.responseThinkingTextPath || ''}
                                                onChange={(e) => handlePathChange('responseThinkingTextPath', e.target.value)}
                                                placeholder="choices[0].message.reasoning_content"
                                            />
                                            <PathFieldDescription>
                                                {t('response_thinking_helper')}
                                            </PathFieldDescription>
                                        </PathFieldGroup>
                                    </>
                                )}

                                <PathPreview>
                                    <h4>{t('current_configuration')}:</h4>
                                    <pre>{value}</pre>
                                </PathPreview>
                            </PathEditor>
                        ) : (
                            <EditorContainer>
                                {originalJson && originalJson !== editorValue && (
                                    <ReferenceJsonContainer>
                                        <ReferenceHeader>{t('original_json_reference')}</ReferenceHeader>
                                        <JSONViewer value={originalJson}/>
                                    </ReferenceJsonContainer>
                                )}
                                {editorError ? (
                                    <FallbackContainer>
                                        <ErrorMessage>
                                            {t('monaco_initialization_error', 'Monaco editor failed to initialize')}: {editorError}
                                        </ErrorMessage>
                                        <p>{t('fallback_editor_message', 'Using simple text editor as fallback')}</p>
                                        <FallbackEditor/>
                                    </FallbackContainer>
                                ) : (
                                    /* Using an object to pass props to avoid TypeScript issues */
                                    <Editor
                                        height={calculatedHeight()}
                                        defaultLanguage="json"
                                        value={editorValue}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorMount}
                                        beforeMount={handleBeforeMount}
                                        theme={isDark ? 'vs-dark' : 'light'}
                                        loading={<div>{t('loading_editor', 'Loading editor')}...</div>}
                                        options={{
                                            minimap: {enabled: false},
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                            tabSize: 2,
                                            formatOnPaste: true,
                                            fontFamily: "'Fira Code', 'Consolas', monospace",
                                            fontSize: 13,
                                            scrollbar: {
                                                useShadows: false,
                                                verticalScrollbarSize: 12,
                                                horizontalScrollbarSize: 12,
                                                vertical: 'auto',
                                                horizontal: 'auto',
                                            }
                                        }}
                                    />
                                )}
                            </EditorContainer>
                        )}
                    </>
                ) : (
                    <JSONViewer value={editorValue} height={calculatedHeight()}/>
                )}
            </EditorWrapper>

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </EditorContainer>
    );
};

const EditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    animation: ${fadeIn} 0.3s ease;
`;

const EditorLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9rem;

    .label-text {
        display: flex;
        align-items: center;
    }
`;

const LabelGroup = styled.div`
    display: flex;
    align-items: center;
`;

const TooltipContainer = styled.div`
    position: relative;
    margin-left: 8px;
    color: ${({theme}) => theme.colors.text};
    opacity: 0.7;
    cursor: help;

    &:hover > div {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
    }
`;

const TooltipText = styled.div`
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    transform: translateY(-10px);
    width: 250px;
    padding: 8px 12px;
    background-color: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-weight: normal;
    font-size: 0.8rem;
    line-height: 1.4;
    z-index: 10;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
`;

const EditorWrapper = styled.div<{ iserror: boolean }>`
    overflow: hidden;
    transition: ${colorTransition};
`;

const EditorActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: transparent;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    color: ${({theme}) => theme.colors.text};
    font-size: 0.8rem;
    cursor: pointer;
    transition: ${colorTransition};

    span {
        margin-left: 2px;
    }
`;

const ErrorMessage = styled.div`
    margin-top: 4px;
    color: #e53935;
    font-size: 0.8rem;
    animation: ${fadeIn} 0.3s ease;
`;

const PathEditor = styled.div`
    background-color: ${({theme}) => theme.colors.background};
`;

const PathFieldGroup = styled.div`
    margin-bottom: 16px;
`;

const PathFieldLabel = styled.label`
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9rem;
`;

const PathFieldInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    font-family: monospace;
    font-size: 0.9rem;
    background-color: ${({theme}) => theme.colors.input};
    color: ${({theme}) => theme.colors.text};
    transition: ${colorTransition};

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.colors.primary};
    }
`;

const PathFieldDescription = styled.div`
    margin-top: 4px;
    font-size: 0.8rem;
    opacity: 0.7;
`;

const PathPreview = styled.div`
    margin-top: 24px;
    padding: 12px;
    background-color: ${({theme}) => theme.colors.card};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};

    h4 {
        margin: 0 0 8px;
        font-size: 0.9rem;
    }

    pre {
        margin: 0;
        font-family: monospace;
        font-size: 0.85rem;
        white-space: pre-wrap;
        color: ${({theme}) => theme.isDark ? theme.colors.text : '#333'};
        background-color: ${({theme}) => theme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'};
        padding: 8px;
        border-radius: 4px;
    }
`;

const ReferenceJsonContainer = styled.div`
    margin-bottom: 16px;
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    overflow: hidden;
`;

const ReferenceHeader = styled.div`
    padding: 8px 12px;
    background-color: ${({theme}) => theme.colors.background};
    font-size: 0.85rem;
    font-weight: 600;
    border-bottom: 1px solid ${({theme}) => theme.colors.border};
`;

const FallbackTextarea = styled.textarea`
    width: 100%;
    min-height: 200px;
    padding: 12px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    color: ${({theme}) => theme.colors.text};
    background-color: ${({theme}) => theme.colors.background};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    resize: vertical;
`;

const FallbackContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 10px 0;
`;

export default JSONEditor; 