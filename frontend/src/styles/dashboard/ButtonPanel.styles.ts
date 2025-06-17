import styled from 'styled-components';

export const ButtonPanelContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 1.5rem 1.625rem 1.5rem;
  box-shadow: 0 -0.0625rem 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 24.5625rem;
  margin: 0 auto;
  height: 5.5rem;
  gap: 3rem;

  @media screen and (max-width: 48rem) {
    width: 100%;
    max-width: none;
    height: 3.25rem;
    padding: 0.5rem 1rem;
    gap: 2rem;
  }
`;

export const NavButton = styled.button<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active }) => (active ? '#FF6EA5' : '#B1BACE')};
  transition: color 0.2s ease;
  padding: 0;
  gap: 0.25rem;

  p {
    margin: 0;
    font-size: 0.625rem;
    line-height: 1;
  }

  span {
    font-size: 1.25rem;
  }

  &:hover {
    color: #FF6EA5;
  }

  @media screen and (max-width: 48rem) {
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
    
    p {
      font-size: 0.5625rem;
    }
    
    span {
      font-size: 1rem;
    }
  }
`;