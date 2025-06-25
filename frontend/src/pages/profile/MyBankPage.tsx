import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import BankInfoCard from '../../components/profile/MyBank/BankInfoCard';
import PaypalInfoCard from '../../components/profile/MyBank/PaypalInfoCard';
import ArrowIcon from '../../components/icons/ArrowIcon';
import { authApi } from '../../apis/masterAuth';

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

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const AddPaymentButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #1565c0;
  }
`;

interface BankInfo {
  accountHolderLastKana: string;
  accountHolderFirstKana: string;
  bankName: string;
  branchCode: string;
  accountType: string;
  accountNumber: string;
  accountPostalCode: string;
  accountAddress: string;
  accountPhone: string;
}

interface PaypalInfo {
  email: string;
}

const MyBankPage: React.FC = () => {
  const navigate = useNavigate();
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [paypalInfo, setPaypalInfo] = useState<PaypalInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        console.log('Loaded user data:', user);
        
        if (user?.bankName) {
          // If bank info exists, set it and ensure PayPal is null
          setBankInfo({
            accountHolderLastKana: user.accountHolderLastKana || '',
            accountHolderFirstKana: user.accountHolderFirstKana || '',
            bankName: user.bankName,
            branchCode: user.branchCode || '',
            accountType: user.accountType || '',
            accountNumber: user.accountNumber || '',
            accountPostalCode: user.accountPostalCode || '',
            accountAddress: user.accountAddress || '',
            accountPhone: user.accountPhone || ''
          });
          setPaypalInfo(null);
        } else if (user?.paypalEmail) {
          // If PayPal email exists, show PayPal info
          setPaypalInfo({ email: user.paypalEmail });
          setBankInfo(null);
        } else {
          // Neither exists
          setBankInfo(null);
          setPaypalInfo(null);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setBankInfo(null);
        setPaypalInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleBankDelete = async () => {
    try {
      await authApi.updateUser({
        accountHolderLastKana: '',
        accountHolderFirstKana: '',
        bankName: '',
        branchCode: '',
        accountType: '',
        accountNumber: '',
        accountPostalCode: '',
        accountAddress: '',
        accountPhone: ''
      });
      setBankInfo(null);
    } catch (error) {
      console.error('Failed to delete bank information:', error);
    }
  };

  const handlePaypalDelete = async () => {
    try {
      await authApi.updateUser({
        paypalEmail: ''  // Just clear the paypalEmail field
      });
      setPaypalInfo(null);
    } catch (error) {
      console.error('Failed to delete PayPal information:', error);
    }
  };

  const handleAddPayment = () => {
    navigate('/profile/edit-bank');
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
        {isLoading ? (
          <div>Loading...</div>
        ) : bankInfo ? (
          <BankInfoCard
            accountHolderLastKana={bankInfo.accountHolderLastKana}
            accountHolderFirstKana={bankInfo.accountHolderFirstKana}
            bankName={bankInfo.bankName}
            branchCode={bankInfo.branchCode}
            accountType={bankInfo.accountType}
            accountNumber={bankInfo.accountNumber}
            accountPostalCode={bankInfo.accountPostalCode}
            accountAddress={bankInfo.accountAddress}
            accountPhone={bankInfo.accountPhone}
            onDelete={handleBankDelete}
          />
        ) : paypalInfo ? (
          <PaypalInfoCard
            email={paypalInfo.email}
            onDelete={handlePaypalDelete}
          />
        ) : (
          <EmptyStateContainer>
            <div>支払い方法が登録されていません</div>
            <AddPaymentButton onClick={handleAddPayment}>
              支払い方法を追加
            </AddPaymentButton>
          </EmptyStateContainer>
        )}
      </BankInfoCardContainer>
    </PageContainer>
  );
};

export default MyBankPage;