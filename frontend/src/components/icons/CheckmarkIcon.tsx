import React from 'react';

const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className}
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="8" fill="#0095F6"/>
    <path 
      d="M11.4667 5.46667L7.1 9.83333L4.53333 7.26667L3.7 8.1L7.1 11.5L12.3 6.3L11.4667 5.46667Z" 
      fill="white"
    />
  </svg>
)

export default CheckmarkIcon;
