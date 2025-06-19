import React from 'react';
import { useNavigate } from 'react-router';
import ArrowIcon from '../icons/ArrowIcon';
import {
  Container,
  SectionTitle,
  SettingList,
  SettingItem,
  SettingText,
  ArrowIcon as ArrowIconStyle,
} from '../../styles/profile/Setting.styles';

const PrivacySetting: React.FC = () => {
  const navigate = useNavigate();

  const settingItems = [
    {
      text: 'パスワードの変更',
      path: '/profile/edit'
    },
    {
      text: 'ログアウト',
      path: '/profile/bank'
    },
    {
      text: '退会する',
      path: '/profile/sns'
    }
  ];

  return (
    <Container>
      <SectionTitle>セキュリティ設定 または アカウント設定</SectionTitle>
      <SettingList>
        {settingItems.map((item, index) => (
          <SettingItem 
            key={index}
            onClick={() => navigate(item.path)}
          >
            <SettingText>{item.text}</SettingText>
            <ArrowIconStyle>
              <ArrowIcon />
            </ArrowIconStyle>
          </SettingItem>
        ))}
      </SettingList>
    </Container>
  );
};

export default PrivacySetting;