import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

interface CampaignApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CampaignApplyModal: React.FC<CampaignApplyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleMyPageClick = () => {
    navigate('/profile');
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>キャンペーン応募の前に</Title>
        <Message>
          応募にはマイページでの情報登録が必要です。
          「アカウント情報」、「振込先口座」、「SNSアカウント」の3項目すべてを登録してください。
        </Message>
        <Button onClick={handleMyPageClick}>
          マイページへ進む
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const Message = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #666;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #FF6EA5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #FF5593;
  }
`;

export default CampaignApplyModal;
