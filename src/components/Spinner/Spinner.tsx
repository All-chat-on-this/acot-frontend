import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 30, 
  color,
  thickness = 2 
}) => {
  return (
    <SpinnerContainer>
      <SpinnerElement 
        size={size} 
        color={color}
        thickness={thickness}
      />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const SpinnerElement = styled.div<{ size: number, color?: string, thickness: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: ${props => props.thickness}px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: ${props => props.thickness}px solid ${props => props.color || props.theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;
`;

export default Spinner; 