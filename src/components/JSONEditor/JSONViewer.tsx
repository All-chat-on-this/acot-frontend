import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';
import {fadeIn} from '@/styles/animations';

// Register the JSON language
hljs.registerLanguage('json', json);

interface JSONViewerProps {
    value: string;
    height?: string;
}

const JSONViewer: React.FC<JSONViewerProps> = ({value, height}) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            try {
                // Format JSON if it's valid
                const parsedValue = JSON.parse(value);
                const formattedValue = JSON.stringify(parsedValue, null, 2);
                codeRef.current.textContent = formattedValue;
            } catch (e) {
                // Use original value if it's not valid JSON
                codeRef.current.textContent = value;
            }

            // Apply highlighting
            hljs.highlightElement(codeRef.current);
        }
    }, [value]);

    return (
        <ViewerContainer style={{height}}>
      <pre className="hljs">
        <code ref={codeRef} className="json"></code>
      </pre>
        </ViewerContainer>
    );
};

const ViewerContainer = styled.div`
    border-radius: ${({theme}) => theme.borderRadius};
    overflow: auto;
    animation: ${fadeIn} 0.3s ease;
    min-height: 45px;
    max-height: 500px;

    pre {
        margin: 0;
        padding: 12px;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 13px;
    }

    .hljs {
        background: ${({theme}) => theme.colors.codeBackground || theme.colors.card};
        border-radius: ${({theme}) => theme.borderRadius};
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    /* Ensure text is visible in both light and dark themes */

    .hljs-string,
    .hljs-number,
    .hljs-boolean,
    .hljs-null,
    .hljs-attr,
    .hljs-literal {
        color: ${({theme}) => theme.isDark ? '#9cdcfe' : '#0550ae'};
    }

    .hljs-punctuation {
        color: ${({theme}) => theme.isDark ? '#d4d4d4' : '#24292e'};
    }
`;

export default JSONViewer; 