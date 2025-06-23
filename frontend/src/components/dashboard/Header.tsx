import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { HeaderContainer, Logo, HeaderActions, MenuButton, DropdownMenu, MenuItem } from '../../styles/dashboard/Header.styles';
import logo from '../../assets/logo.png';
import MenuIcon from '../icons/MenuIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { authApi } from '../../apis/masterAuth';

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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsMenuOpen(false);
      navigate('/'); // Navigate to dashboard page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
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