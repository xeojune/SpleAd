import React, { useState } from 'react';
import styled from 'styled-components';
import XIcon from '../../icons/XIcon';

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

interface ModalContentProps {
  platform: string;
}

const ModalContent = styled.div<ModalContentProps>`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 20.9375rem; /* 335px */
  position: relative;
  z-index: 10000;
  height: ${({ platform }) => {
    switch (platform) {
      case 'X (旧Twitter)':
        return '22.875rem'; // 366px - original height with notice
      case 'LIPS':
      case '@cosme':
        return '18rem'; // 320px - shorter height without notice
      default:
        return '18rem';
    }
  }};

  @media (max-width: 375px) {
    width: 90%;
    height: auto;
    min-height: ${({ platform }) => 
      platform === 'X (旧Twitter)' ? '22.875rem' : '20rem'};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
`;

const SnsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SnsLogo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
`;

const SnsName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.375rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    outline: none;
    border-color: #FF69B4;
    box-shadow: 0 0 0 1px #FF69B4;
  }
`;

const Notice = styled.p`
  font-size: 0.75rem;
  color: #64748B;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.4;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #FF69B4;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #FF1493;
  }
  
  &:disabled {
    background-color: #CBD5E1;
    cursor: not-allowed;
  }
`;

interface SnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  logo: string;
  onSubmit: (id: string) => void;
}

const SnsModal: React.FC<SnsModalProps> = ({
  isOpen,
  onClose,
  platform,
  logo,
  onSubmit,
}) => {
  const [id, setId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(id);
    setId('');
  };

  const getNoticeText = () => {
    switch (platform) {
      case 'X (旧Twitter)':
        return 'X（旧Twitter）アカウントは公開アカウントのみ認証可能です。非公開アカウントを登録した場合、認証が取り消されることがあります。';
      default:
        return '';
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent platform={platform} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>SNSアカウントID登録</Title>
          <CloseButton onClick={onClose} type="button" aria-label="Close">
            <XIcon />
          </CloseButton>
        </ModalHeader>
        <SnsInfo>
          <SnsLogo src={logo} alt={platform} />
          <SnsName>{platform}</SnsName>
        </SnsInfo>
        <form onSubmit={handleSubmit}>
          <InputLabel>ID（ユーザー名）</InputLabel>
          <Input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="IDを入力してください。"
            required
            autoFocus
          />
          {getNoticeText() && <Notice>{getNoticeText()}</Notice>}
          <SubmitButton type="submit" disabled={!id.trim()}>
            登録する
          </SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SnsModal;