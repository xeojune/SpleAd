import React from 'react';

interface MenuIconProps {
  className?: string;
}

export const MenuIcon: React.FC<MenuIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="21" 
      height="16" 
      viewBox="0 0 21 16" 
      fill="none"
      className={className}
    >
      <rect x="0.129272" width="20.1538" height="2" fill="#535F7B"/>
      <rect x="0.129272" y="7" width="20.1538" height="2" fill="#535F7B"/>
      <rect x="0.129272" y="14" width="20.1538" height="2" fill="#535F7B"/>
    </svg>
  );
};

export default MenuIcon;