import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import styled from 'styled-components';
import { authApi } from '../../apis/masterAuth';
import CampaignApplyModal from './CampaignApplyModal';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = async () => {
    try {
      const { authenticated } = await authApi.isAuthenticated();
      if (!authenticated) {
        alert('로그인 이후 이용해주세요.');
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      alert('로그인 이후 이용해주세요.');
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  return (
    <>
      <Container>
        <Button variant="outline">
          <ButtonText>제품 바로가기</ButtonText>
        </Button>
        <Button variant="filled" onClick={handleApplyClick}>
          <ButtonText>申し込みする</ButtonText>
        </Button>
      </Container>
      <CampaignApplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};