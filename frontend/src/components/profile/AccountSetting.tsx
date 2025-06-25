import React, { useEffect, useState } from 'react';
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
import styled from 'styled-components';
import { authApi } from '../../apis/masterAuth';

interface RegistrationStatus {
  account: boolean;
  bank: boolean;
  sns: boolean;
}

const AccountSetting: React.FC = () => {
  const navigate = useNavigate();
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>({
    account: false,
    bank: false,
    sns: false
  });

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const user = await authApi.getCurrentUser();
        console.log('User data for status:', user);
        setRegistrationStatus({
          account: !!(user?.name && user?.phoneNumber),
          bank: !!(user?.accountNumber || user?.paypalEmail),
          sns: !!(user?.linkedAccounts && user.linkedAccounts.length > 0)
        });
      } catch (error) {
        console.error('Failed to check registration status:', error);
      }
    };

    checkRegistrationStatus();
  }, []);

  const settingItems = [
    {
      text: 'アカウント情報の編集',
      path: '/profile/my-account',
      status: registrationStatus.account
    },
    {
      text: '振込先口座の管理',
      path: '/profile/my-bank',
      status: registrationStatus.bank
    },
    {
      text: 'SNSアカウント連携',
      path: '/profile/sns',
      status: registrationStatus.sns
    }
  ];

  const allRegistered = Object.values(registrationStatus).every(status => status);

  return (
    <Container>
      {!allRegistered && (
        <WarningBox>
          以下の情報が未登録のため、キャンペーンに応募できません。登録を完了してください。
        </WarningBox>
      )}
      <SectionTitle>アカウント情報</SectionTitle>
      <SettingList>
        {settingItems.map((item, index) => (
          <SettingItem 
            key={index}
            onClick={() => navigate(item.path)}
          >
            <SettingTextContainer>
              <SettingText>{item.text}</SettingText>
              <StatusTag status={item.status}>
                {item.status ? '登録済み' : '未登録'}
              </StatusTag>
            </SettingTextContainer>
            <ArrowIconStyle>
              <ArrowIcon />
            </ArrowIconStyle>
          </SettingItem>
        ))}
      </SettingList>
    </Container>
  );
};

const WarningBox = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const SettingTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusTag = styled.span<{ status: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ status }) => status ? `
    background-color: #e6f4ff;
    color: #0066cc;
  ` : `
    background-color: #fff2f2;
    color: #ff4d4d;
  `}
`;

export default AccountSetting;