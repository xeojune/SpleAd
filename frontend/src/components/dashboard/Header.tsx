import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { HeaderContainer, Logo, HeaderActions, MenuButton, DropdownMenu, MenuItem } from '../../styles/dashboard/Header.styles';
import logo from '../../assets/logo.png';
import LogoutIcon from '../icons/LogoutIcon';
import SearchIcon from '../icons/SearchIcon';
import { authApi } from '../../apis/masterAuth';
import { useSearch } from '../../contexts/SearchContext';

const SearchInput = styled.input<{ isOpen: boolean }>`
  position: absolute;
  right: 60px;
  height: 36px;
  width: ${props => props.isOpen ? '200px' : '0'};
  padding: ${props => props.isOpen ? '0 12px' : '0'};
  border: ${props => props.isOpen ? '1px solid #ddd' : 'none'};
  border-radius: 4px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  outline: none;
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
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
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    } else {
      setSearchQuery('');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <HeaderContainer>
      <Logo src={logo} alt="SpleAd Logo" />
      <HeaderActions ref={menuRef}>
        <SearchInput
          isOpen={isSearchOpen}
          value={searchQuery}
          onChange={handleSearch}
          placeholder="キーワード検索…"
        />
        <MenuButton onClick={handleSearchClick}>
          <SearchIcon />
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