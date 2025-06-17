import React from 'react';
import styled from 'styled-components';

const DropDownContainer = styled.button<{ $noBorder?: boolean; $width?: string; $height?: string }>`
  display: flex;
  padding: 0.5rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: ${props => props.$noBorder ? 'none' : '1px solid #535f7b'};
  background: white;
  min-width: ${props => props.$width || '8.75rem'};
  height: ${props => props.$height || 'auto'};
  cursor: pointer;
  font-size: 0.875rem;
  color: #1A1A1A;
`;

const Label = styled.span`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 100%;
`;

const ChevronIcon = styled.svg<{ $isOpen?: boolean }>`
  width: 1rem;
  height: 1rem;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

interface DropDownBoxProps {
  label: string;
  isOpen?: boolean;
  onClick?: () => void;
  noBorder?: boolean;
  width?: string;
  height?: string;
}

const DropDownBox: React.FC<DropDownBoxProps> = ({ 
  label, 
  isOpen = false, 
  onClick,
  noBorder = false,
  width,
  height
}) => {
  return (
    <DropDownContainer 
      onClick={onClick} 
      $noBorder={noBorder}
      $width={width}
      $height={height}
    >
      <Label>{label}</Label>
      <ChevronIcon 
        $isOpen={isOpen} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M6 9L12 15L18 9" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </ChevronIcon>
    </DropDownContainer>
  );
};

export default DropDownBox;
