import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { HeaderContainer, Logo, HeaderActions, MenuButton, DropdownMenu, MenuItem } from '../../styles/dashboard/Header.styles';
import logo from '../../assets/logo.png';
import MenuIcon from '../icons/MenuIcon';
import LogoutIcon from '../icons/LogoutIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    
    // Close the dropdown menu
    setIsMenuOpen(false);
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Logo src={logo} alt="SpleAd Logo" />
      <HeaderActions ref={menuRef}>
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon />
        </MenuButton>
        <DropdownMenu isOpen={isMenuOpen}>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon />
            로그아웃
          </MenuItem>
        </DropdownMenu>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;