import { createGlobalStyle, css } from 'styled-components';
import { ThemeProps } from './types';

const GlobalStyles = createGlobalStyle<{ theme?: ThemeProps }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme?.fontFamily};
    background: ${({ theme }) => theme?.colors.background};
    color: ${({ theme }) => theme?.colors.text};
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
    line-height: 1.5;
  }

  ${({ theme }) => theme?.blurAmount && css`
    .glass-effect {
      backdrop-filter: blur(${theme.blurAmount});
      -webkit-backdrop-filter: blur(${theme.blurAmount});
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.borderRadius};
    }

    .main-container {
      background-size: 400% 400%;
      animation: gradient-shift 15s ease infinite;
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}

  /* Basic button styling */
  button {
    background-color: ${({ theme }) => theme?.colors.primary};
    color: ${({ theme }) => theme?.colors.buttonText};
    border: none;
    border-radius: ${({ theme }) => theme?.borderRadius};
    padding: 8px 16px;
    cursor: pointer;
    font-family: ${({ theme }) => theme?.fontFamily};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme?.colors.hover};
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Basic input styling */
  input, textarea {
    background-color: ${({ theme }) => theme?.colors.input};
    color: ${({ theme }) => theme?.colors.inputText};
    border: 1px solid ${({ theme }) => theme?.colors.border};
    border-radius: ${({ theme }) => theme?.borderRadius};
    padding: 8px 12px;
    font-family: ${({ theme }) => theme?.fontFamily};
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${({ theme }) => theme?.colors.primary};
      outline: none;
    }
  }

  /* Links */
  a {
    color: ${({ theme }) => theme?.colors.primary};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme?.colors.primary}cc;
      text-decoration: none;
    }
  }

  /* Code blocks */
  pre, code {
    font-family: 'Consolas', 'Monaco', 'Menlo', monospace;
    background-color: ${({ theme }) => 
      theme?.colors.background === '#FFFFFF' ? '#F5F5F5' : '#2D2D2D'};
    border-radius: ${({ theme }) => theme?.borderRadius};
    padding: 2px 4px;
  }

  pre {
    padding: 16px;
    overflow-x: auto;
  }

  /* Make sure we have a scrollbar when needed */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme?.colors.primary};
  }
`;

export default GlobalStyles; 