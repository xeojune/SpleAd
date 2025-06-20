import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  SectionTitle,
  SettingList,
  SettingItem,
  SettingText,
  ArrowIcon as ArrowIconStyle,
} from '../../styles/profile/Setting.styles';
import LogoutModal from '../common/LogoutModal';
import DeleteAccountModal from '../common/DeleteAccountModal';
import ArrowIcon from '../icons/ArrowIcon';
import { authApi } from '../../apis/masterAuth';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  padding: 0.5rem;
  margin: 0.5rem 0;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  text-align: center;
`;

const PrivacySetting: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError(null);
      await authApi.deleteAccount();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      setDeleteError('アカウントの削除に失敗しました。後でもう一度お試しください。');
      // Keep modal open to show error
    }
  };

  const settingItems = [
    {
      text: 'パスワードの変更',
      path: '/profile/edit-password',
      onClick: () => navigate('/profile/edit-password')
    },
    {
      text: 'ログアウト',
      path: '#',
      onClick: () => setIsLogoutModalOpen(true)
    },
    {
      text: '退会する',
      path: '#',
      onClick: () => setIsDeleteModalOpen(true)
    }
  ];

  return (
    <Container>
      <SectionTitle>セキュリティ設定 または アカウント設定</SectionTitle>
      {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}
      <SettingList>
        {settingItems.map((item, index) => (
          <SettingItem 
            key={index}
            onClick={item.onClick}
          >
            <SettingText>{item.text}</SettingText>
            <ArrowIconStyle>
              <ArrowIcon />
            </ArrowIconStyle>
          </SettingItem>
        ))}
      </SettingList>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onDelete={handleDeleteAccount}
      />
    </Container>
  );
};

export default PrivacySetting;