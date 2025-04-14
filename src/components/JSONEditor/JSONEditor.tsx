import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Editor, {OnChange, OnMount} from '@monaco-editor/react';
import {FaCode, FaCog, FaEdit, FaInfoCircle} from 'react-icons/fa';
import {motion} from 'framer-motion';
import {colorTransition, fadeIn} from '@/styles/animations';
import {useTranslation} from 'react-i18next';
import JSONViewer from './JSONViewer';

interface JSONEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string;
    label?: string;
    tooltip?: string;
    error?: string;
    paths?: {
        roleField?: string;
        contentField?: string;
        thinkingTextField?: string;
    };
    onPathsChange?: (paths: object) => void;
    readOnly?: boolean;
}

const JSONEditor: React.FC<JSONEditorProps> = ({
                                                   value,
                                                   onChange,
                                                   height ,
                                                   label,
                                                   tooltip,
                                                   error,
                                                   paths,
                                                   onPathsChange,
                                                   readOnly = false
                                               }) => {
    const {t} = useTranslation();
    const [editorValue, setEditorValue] = useState(value);
    const [showPathEditor, setShowPathEditor] = useState(false);
    const [isEditing, setIsEditing] = useState(!readOnly);
    const [originalJson, setOriginalJson] = useState(value);
    const [localPaths, setLocalPaths] = useState(paths || {
        roleField: '',
        contentField: '',
        thinkingTextField: ''
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
            setLocalPaths(paths);
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

    const handlePathChange = (field: string, value: string) => {
        const newPaths = {...localPaths, [field]: value};
        setLocalPaths(newPaths);
        if (onPathsChange) {
            onPathsChange(newPaths);
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

            <EditorWrapper isError={!!error}>
                {isEditing ? (
                    <>
                        {showPathEditor ? (
                            <PathEditor>
                                <PathFieldGroup>
                                    <PathFieldLabel>{t('role_field_path')}:</PathFieldLabel>
                                    <PathFieldInput
                                        type="text"
                                        value={localPaths.roleField || ''}
                                        onChange={(e) => handlePathChange('roleField', e.target.value)}
                                        placeholder={t('role_field_placeholder')}
                                    />
                                    <PathFieldDescription>
                                        {t('role_field_description')}
                                    </PathFieldDescription>
                                </PathFieldGroup>

                                <PathFieldGroup>
                                    <PathFieldLabel>{t('content_field_path')}:</PathFieldLabel>
                                    <PathFieldInput
                                        type="text"
                                        value={localPaths.contentField || ''}
                                        onChange={(e) => handlePathChange('contentField', e.target.value)}
                                        placeholder={t('content_field_placeholder')}
                                    />
                                    <PathFieldDescription>
                                        {t('content_field_description')}
                                    </PathFieldDescription>
                                </PathFieldGroup>

                                <PathFieldGroup>
                                    <PathFieldLabel>{t('thinking_text_field_path')}:</PathFieldLabel>
                                    <PathFieldInput
                                        type="text"
                                        value={localPaths.thinkingTextField || ''}
                                        onChange={(e) => handlePathChange('thinkingTextField', e.target.value)}
                                        placeholder={t('thinking_text_field_placeholder')}
                                    />
                                    <PathFieldDescription>
                                        {t('thinking_text_field_description')}
                                    </PathFieldDescription>
                                </PathFieldGroup>

                                <PathPreview>
                                    <h4>{t('preview_configuration')}:</h4>
                                    <pre>{JSON.stringify({
                                        roleField: localPaths.roleField || null,
                                        contentField: localPaths.contentField || null,
                                        thinkingTextField: localPaths.thinkingTextField || null
                                    }, null, 2)}</pre>
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
                                <Editor
                                    height={calculatedHeight()}
                                    defaultLanguage="json"
                                    value={editorValue}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorMount}
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

const EditorWrapper = styled.div<{ isError: boolean }>`
    border: 1px solid ${({isError, theme}) => isError ? '#e53935' : theme.colors.border};
    border-radius: ${({theme}) => theme.borderRadius};
    overflow: hidden;
    transition: ${colorTransition};
    min-height: 45px;
    max-height: 500px;

    &:focus-within {
        border-color: ${({theme}) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({theme}) => theme.colors.primary}30;
    }
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
    padding: 16px;
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

export default JSONEditor; 