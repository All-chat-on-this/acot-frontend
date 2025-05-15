export type ThemeType = 'light' | 'dark' | 'dreamlikeColorLight' | 'dreamlikeColorDark';

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  border: string;
  buttonText: string;
  sidebar: string;
  card: string;
  input: string;
  inputText: string;
  userBubble: string;
  assistantBubble: string;
  systemBubble: string;
  userBubbleText: string;
  assistantBubbleText: string;
  systemBubbleText: string;
  hover: string;
  borderInDialog: string;
  dialogBackground: string;
  success: string;
  error: string;
}

export interface ThemeProps {
  colors: ThemeColors;
  blurAmount?: string;
  fontFamily: string;
  borderRadius: string;
}

export type ThemeDefinition = Record<ThemeType, ThemeProps>; 