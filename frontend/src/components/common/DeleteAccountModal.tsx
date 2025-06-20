import React, { useState } from 'react';
import styled from 'styled-components';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 320px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  color: #1e293b;
  margin: 0;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const WarningMessage = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const InputLabel = styled.p`
  font-size: 0.875rem;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.75rem;

  ${props => props.variant === 'primary' ? `
    background-color: #FF69B4;
    color: white;
    border: none;
    opacity: ${props.disabled ? '0.5' : '1'};
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};

    &:hover {
      background-color: ${props.disabled ? '#FF69B4' : '#FF1493'};
    }
  ` : `
    background-color: #f1f5f9;
    color: #64748b;
    border: none;

    &:hover {
      background-color: #e2e8f0;
    }
  `}
`;

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onDelete }) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!isOpen) return null;

  const handleDelete = () => {
    if (confirmText === '退会') {
      onDelete();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>退会手続き</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Message>
          退会すると、再登録ができなくなる可能性があります。本当に退会しますか？
        </Message>
        <WarningMessage>
          退会時、進行中の案件の報酬が支払われない場合があります。報酬の受取完了後に退会手続きを行ってください。
        </WarningMessage>
        <InputLabel>「退会」と入力してください。</InputLabel>
        <Input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="退会"
        />
        <Button
          variant="primary"
          onClick={handleDelete}
          disabled={confirmText !== '退会'}
        >
          退会する
        </Button>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteAccountModal;
