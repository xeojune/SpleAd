import React from 'react';

interface XIconProps {
  className?: string;
}

const XIcon: React.FC<XIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="25" 
      height="25" 
      viewBox="0 0 25 25" 
      fill="none"
      className={className}
    >
      <path 
        d="M4.93945 19.4639L19.0816 5.32173" 
        stroke="#535F7B" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4.93896 5.32129L19.0811 19.4634" 
        stroke="#535F7B" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default XIcon;