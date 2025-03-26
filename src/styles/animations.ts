import { keyframes } from 'styled-components';

// Subtle fade in animation
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Elegant slide up animation
export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Subtle slide in from right
export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Subtle slide in from left
export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Scale animation for buttons and interactive elements
export const scaleUp = keyframes`
  from {
    transform: scale(0.97);
  }
  to {
    transform: scale(1);
  }
`;

// Subtle pulse animation
export const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Background shine animation for highlighting
export const shine = keyframes`
  from {
    background-position: -100px;
  }
  to {
    background-position: 200px;
  }
`;

// Elegant color transition
export const colorTransition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';

// More dramatic animation for important actions
export const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  70% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Ripple effect
export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

// Loading animation
export const spinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Float animation for cards and dialogs
export const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Glass blur in effect
export const blurIn = keyframes`
  from {
    backdrop-filter: blur(0px);
    background-opacity: 0;
  }
  to {
    backdrop-filter: blur(10px);
    background-opacity: 1;
  }
`;

// Animated gradient background shift
export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`; 