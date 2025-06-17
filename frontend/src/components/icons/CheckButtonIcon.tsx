import React from 'react';
import styled from 'styled-components';

interface CheckButtonIconProps {
  active?: boolean;
}

const StyledSvg = styled.svg<{ $active?: boolean }>`
  path, circle {
    stroke: ${props => props.$active ? '#FF6EA5' : '#B1BACE'};
  }
`;

const CheckButtonIcon: React.FC<CheckButtonIconProps> = ({ active = false }) => {
  return (
    <StyledSvg 
      width="16" 
      height="17" 
      viewBox="0 0 16 17" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      $active={active}
    >
      <g clipPath="url(#clip0_1_288)">
        <circle cx="8" cy="8.7139" r="7.5" />
        <path d="M4.46436 8.7139L7.29278 11.5423L11.5354 7.29968" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1_288">
          <rect width="16" height="16" fill="white" transform="translate(0 0.713867)"/>
        </clipPath>
      </defs>
    </StyledSvg>
  );
};

export default CheckButtonIcon;