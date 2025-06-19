import React from 'react';

const ArrowIcon: React.FC = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none"
    >
      <rect width="20" height="20" transform="translate(20) rotate(90)" fill="white"/>
      <path 
        d="M10 17.0711L17.0711 10L10 2.92894" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;