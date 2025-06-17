import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 2;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: none;
  background-color: ${({ active }) => active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
`;

interface DottedNavProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

const DottedNav: React.FC<DottedNavProps> = ({ total, current, onDotClick }) => {
  return (
    <NavContainer>
      {Array.from({ length: total }, (_, i) => (
        <Dot
          key={i}
          active={i === current}
          onClick={() => onDotClick(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </NavContainer>
  );
};

export default DottedNav;