import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem 0 2rem 0;
`;

const Button = styled.button<{ variant: 'outline' | 'filled' }>`
  flex: 1;
  max-width: 24rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) => variant === 'outline' ? `
    background-color: white;
    border: 1px solid #ff4d8d;
    color: #ff4d8d;

    &:hover {
      background-color: #fff1f5;
    }
  ` : `
    background-color: #ff4d8d;
    border: none;
    color: white;

    &:hover {
      background-color: #ff3377;
    }
  `}
`;

const ButtonText = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

export const DescriptionFooter: React.FC = () => {
  return (
    <Container>
      <Button variant="outline">
        <ButtonText>제품 바로가기</ButtonText>
      </Button>
      <Button variant="filled">
        <ButtonText>申し込みする</ButtonText>
      </Button>
    </Container>
  );
};