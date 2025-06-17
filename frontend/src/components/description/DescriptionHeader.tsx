import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  margin: 1rem 0 1rem 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ProductName = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 100%;
`;

interface DescriptionHeaderProps {
  productName: string;
}

const DescriptionHeader: React.FC<DescriptionHeaderProps> = ({ productName }) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <BackButton onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </BackButton>
      <ProductName>{productName}</ProductName>
    </HeaderContainer>
  );
};

export default DescriptionHeader;