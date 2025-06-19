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

const AccountSetting: React.FC = () => {
  const navigate = useNavigate();

  const settingItems = [
    {
      text: 'アカウント情報の編集',
      path: '/profile/my-account'
    },
    {
      text: '振込先口座の管理',
      path: '/profile/bank'
    },
    {
      text: 'SNSアカウント連携',
      path: '/profile/sns'
    }
  ];

  return (
    <Container>
      <SectionTitle>アカウント情報</SectionTitle>
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

export default AccountSetting;