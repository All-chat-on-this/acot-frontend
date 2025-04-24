import React from 'react';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {useTranslation} from 'react-i18next';
import {TestResult} from '@/pages/config/ConfigEditForm';
import {CommonResult} from '@/types';

interface TestResponseProps {
    testResult: CommonResult<TestResult> | null;
}

const TestResponse: React.FC<TestResponseProps> = ({testResult}) => {
    const {t} = useTranslation();

    // Function to determine if a test response is successful
    const isSuccessfulResponse = (result: CommonResult<TestResult>): boolean => {
        return result?.code === 0 && result?.data?.success === true;
    };

    if (!testResult) return null;

    return (
        <ResponseContainer
            className={isSuccessfulResponse(testResult) ? 'success' : 'error'}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 10}}
            transition={{duration: 0.3}}
        >
            <h4>{isSuccessfulResponse(testResult) ? t('connection_successful') : t('connection_failed')}</h4>
            {testResult.data.message && <p>{testResult.data.message}</p>}

            {/* Show response data or error data in pre-formatted code block */}
            <div style={{marginTop: '8px'}}>
                {testResult.data.response && (
                    <>
                        <SectionTitle style={{
                            marginTop: '12px',
                            marginBottom: '4px'
                        }}>{t('test_response')}</SectionTitle>
                        <CodeBlock>
                            <pre>{JSON.stringify(testResult.data.response, null, 2)}</pre>
                        </CodeBlock>
                    </>
                )}

                {!isSuccessfulResponse(testResult) && testResult.data.error && (
                    <>
                        <SectionTitle style={{
                            marginTop: '12px',
                            marginBottom: '4px'
                        }}>{t('test_response')}</SectionTitle>
                        <CodeBlock>
                            <pre>{testResult.data.error.startsWith('{')
                                ? testResult.data.error
                                : JSON.stringify(testResult.data.error, null, 2)}</pre>
                        </CodeBlock>
                    </>
                )}
            </div>
        </ResponseContainer>
    );
};

const ResponseContainer = styled(motion.div)`
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
        background-color: ${({theme}) => `rgba(${theme.colors.success}, 0.1)`.replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i,
                (_, r, g, b) => `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 0.1)`)};
        color: ${({theme}) => theme.colors.success};

        h4::before {
            background-color: ${({theme}) => theme.colors.success};
        }
    }

    &.error {
        background-color: ${({theme}) => `rgba(${theme.colors.error}, 0.1)`.replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i,
                (_, r, g, b) => `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 0.1)`)};
        color: ${({theme}) => theme.colors.error};

        h4::before {
            background-color: ${({theme}) => theme.colors.error};
        }
    }
`;

const CodeBlock = styled.div`
    border-radius: ${({theme}) => theme.borderRadius};
    border: 1px solid ${({theme}) => theme.colors.border};
    overflow: auto;
    max-height: 400px;

    pre {
        background-color: ${({theme}) => theme.colors.card};
        margin: 0;
        padding: 16px;
        font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
    }
`;

const SectionTitle = styled.h4`
    margin-top: 24px;
    margin-bottom: 12px;
    font-size: 1.1rem;
    color: ${({theme}) => theme.colors.primary};
`;

export default TestResponse; 