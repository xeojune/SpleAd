import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.25rem;
  flex-shrink: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
  max-width: 24.5625rem;
  margin: 0 auto;
  
  @media screen and (max-width: 48rem) {
    width: 100%;
    max-width: none;
    padding: 0 0.75rem;
  }
`;

export const Logo = styled.img`
  height: 1.25rem;
  width: auto;
  
  @media screen and (max-width: 48rem) {
    height: 1rem;
  }
`;

export const HeaderActions = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media screen and (max-width: 48rem) {
    gap: 0.5rem;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
  
  @media screen and (max-width: 48rem) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.125rem;
    padding: 0.375rem;
  }
`;

export const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 10rem;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-0.5rem)')};
  transition: all 0.2s ease;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #f8fafc;
  }

  &:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
`;
