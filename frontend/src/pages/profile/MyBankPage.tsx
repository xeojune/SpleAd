import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import BankInfoCard from '../../components/profile/MyBank/BankInfoCard';
import PaypalInfoCard from '../../components/profile/MyBank/PaypalInfoCard';
import ArrowIcon from '../../components/icons/ArrowIcon';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 10px;
  margin-right: 10px;
  &:hover {
    opacity: 0.7;
  }
`;

const PageTitle = styled.h1`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const RotatedArrow = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
`;

const BankInfoCardContainer = styled.div`
  padding: 1.5rem;
`;

const MyBankPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual data from your API
  const bankInfo = {
    bankName: 'ここ銀行',
    accountHolder: 'ひなた ここ',
    branchCode: '000/〇〇〇',
    accountType: '普通',
    accountNumber: '1234567',
    postalCode: '000-0000',
    address: '東京都渋谷区神南1-22-7 岩本ビル B1F',
    phoneNumber: '000-0234-5678'
  };

  const paypalInfo = {
    email: 'example@email.com'
  };

  const handleBankEdit = () => {
    console.log('Edit bank info');
  };

  const handleBankDelete = () => {
    console.log('Delete bank info');
  };

  const handlePaypalEdit = () => {
    console.log('Edit paypal info');
  };

  const handlePaypalDelete = () => {
    console.log('Delete paypal info');
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/profile')}>
          <RotatedArrow>
            <ArrowIcon />
          </RotatedArrow>
        </BackButton>
        <PageTitle>振込先口座の管理</PageTitle>
      </Header>
      <BankInfoCardContainer>
        <BankInfoCard
          bankName={bankInfo.bankName}
          accountHolder={bankInfo.accountHolder}
          branchCode={bankInfo.branchCode}
          accountType={bankInfo.accountType}
          accountNumber={bankInfo.accountNumber}
          postalCode={bankInfo.postalCode}
          address={bankInfo.address}
          phoneNumber={bankInfo.phoneNumber}
          onDelete={handleBankDelete}
        />
        <PaypalInfoCard
          email={paypalInfo.email}
          onDelete={handlePaypalDelete}
        />
      </BankInfoCardContainer>
    </PageContainer>
  );
};

export default MyBankPage;