import {ThemeDefinition} from './types';

const themes: ThemeDefinition = {
  light: {
    colors: {
      primary: '#1890FF',
      background: '#FFFFFF',
      text: '#333333',
      border: '#E8E8E8',
      buttonText: '#FFFFFF',
      sidebar: '#F6F8FA',
      card: '#FFFFFF',
      input: '#F0F2F5',
      inputText: '#333333',
      userBubble: '#E1F5FE',
      assistantBubble: '#F0F2F5',
      systemBubble: '#FFF9C4',
      userBubbleText: '#333333',
      assistantBubbleText: '#333333',
      systemBubbleText: '#333333',
      hover: '#E6F7FF',
      dialogBackground: '#FFFFFF'
    },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    borderRadius: '8px'
  },
  
  dark: {
    colors: {
      primary: '#1890FF',
      background: '#1F1F1F',
      text: '#E0E0E0',
      border: '#444444',
      buttonText: '#FFFFFF',
      sidebar: '#2D2D2D',
      card: '#2D2D2D',
      input: '#383838',
      inputText: '#E0E0E0',
      userBubble: '#0D47A1',
      assistantBubble: '#383838',
      systemBubble: '#665C00',
      userBubbleText: '#E0E0E0',
      assistantBubbleText: '#E0E0E0',
      systemBubbleText: '#E0E0E0',
      hover: '#003A8C',
      dialogBackground: '#2D2D2D'
    },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    borderRadius: '8px'
  },
  
  dreamlikeColorLight: {
    colors: {
      primary: '#1890FF',
      background: 'linear-gradient(120deg, rgba(224, 195, 252, 0.7), rgba(142, 197, 252, 0.7))',
      text: '#333333',
      border: 'rgba(255, 255, 255, 0.18)',
      buttonText: '#FFFFFF',
      sidebar: 'rgba(255, 255, 255, 0.5)',
      card: 'rgba(255, 255, 255, 0.5)',
      input: 'rgba(255, 255, 255, 0.7)',
      inputText: '#333333',
      userBubble: 'rgba(225, 245, 254, 0.7)',
      assistantBubble: 'rgba(255, 255, 255, 0.5)',
      systemBubble: 'rgba(255, 249, 196, 0.7)',
      userBubbleText: '#333333',
      assistantBubbleText: '#333333',
      systemBubbleText: '#333333',
      hover: 'rgb(44,154,255)',
      dialogBackground: 'rgba(255, 255, 255, 1)'
    },
    blurAmount: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    borderRadius: '8px'
  },
  
  dreamlikeColorDark: {
    colors: {
      primary: '#3DACFF',
      background: 'linear-gradient(120deg, rgba(50, 25, 79, 0.8), rgba(20, 30, 90, 0.8))',
      text: '#E0E0E0',
      border: 'rgba(255, 255, 255, 0.08)',
      buttonText: '#FFFFFF',
      sidebar: 'rgba(30, 30, 50, 0.5)',
      card: 'rgba(30, 30, 50, 0.5)',
      input: 'rgba(40, 40, 60, 0.7)',
      inputText: '#E0E0E0',
      userBubble: 'rgba(13, 71, 161, 0.7)',
      assistantBubble: 'rgba(40, 40, 60, 0.7)',
      systemBubble: 'rgba(102, 92, 0, 0.7)',
      userBubbleText: '#E0E0E0',
      assistantBubbleText: '#E0E0E0',
      systemBubbleText: '#E0E0E0',
      hover: 'rgba(0, 58, 140, 0.7)',
      dialogBackground: 'rgba(30, 30, 50, 1)'
    },
    blurAmount: '15px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    borderRadius: '8px'
  }
};

export default themes; 