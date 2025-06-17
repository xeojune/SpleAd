import React from 'react';

interface ProfileIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ active, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="35"
    height="35"
    viewBox="0 0 35 35"
    fill="none"
    {...props}
  >
    <rect width="35" height="35" fill="white"/>
    <circle cx="17.5" cy="13" r="6.5" fill="white" stroke={active ? "#FF6EA5" : "#B1BACE"}/>
    <path d="M20.5 15.5C23.5376 15.5 26 17.9624 26 21V27C26 27.8284 25.3284 28.5 24.5 28.5H10.5C9.67157 28.5 9 27.8284 9 27V21C9 17.9624 11.4624 15.5 14.5 15.5H20.5Z" fill="white" stroke={active ? "#FF6EA5" : "#B1BACE"}/>
    <path d="M17.5 7C20.8137 7 23.5 9.68629 23.5 13C23.5 14.2595 23.1104 15.4274 22.4473 16.3926C24.2414 17.1518 25.5 18.9292 25.5 21V27C25.5 27.5523 25.0523 28 24.5 28H10.5C9.94772 28 9.5 27.5523 9.5 27V21C9.5 18.9295 10.758 17.152 12.5518 16.3926C11.8888 15.4275 11.5 14.2593 11.5 13C11.5 9.68629 14.1863 7 17.5 7Z" fill="white"/>
    <circle cx="17.5" cy="13" r="4" fill={active ? "#FF6EA5" : "#B1BACE"}/>
    <path d="M11.5 22C11.5 19.7909 13.2909 18 15.5 18H19.5C21.7091 18 23.5 19.7909 23.5 22V25C23.5 25.5523 23.0523 26 22.5 26H12.5C11.9477 26 11.5 25.5523 11.5 25V22Z" fill={active ? "#FF6EA5" : "#B1BACE"}/>
  </svg>
);

export default ProfileIcon;