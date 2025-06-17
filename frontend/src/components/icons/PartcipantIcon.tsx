import React from 'react';

interface ParticipantIconProps {
  className?: string;
}

export const ParticipantIcon: React.FC<ParticipantIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="7" 
      height="10" 
      viewBox="0 0 7 10" 
      fill="none"
      className={className}
    >
      <circle cx="3.66211" cy="2.25" r="2" fill="#7D8CAE"/>
      <path d="M0.662109 7.75C0.662109 6.09315 2.00526 4.75 3.66211 4.75C5.31896 4.75 6.66211 6.09315 6.66211 7.75V9.75H0.662109V7.75Z" fill="#7D8CAE"/>
    </svg>
  );
};

export default ParticipantIcon;