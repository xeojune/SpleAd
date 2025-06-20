import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import EditBankForm from '../../components/profile/EditBank/EditBankForm';
import EditPaypalForm from '../../components/profile/EditBank/EditPaypalForm';
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e2e8f0;
  margin-top: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  font-size: 1rem;
  background: none;
  width: 100%;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#FF6EA5' : 'transparent'};
  color: ${props => props.active ? '#FF6EA5' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: black;
  }
`;


const RotatedArrow = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
`;

const FormContainer = styled.div`
  padding: 2rem 1rem;
`;

type PaymentMethod = '銀行振込' | 'PayPal';

const EditBankPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PaymentMethod>('銀行振込');

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/profile/my-bank')}><RotatedArrow><ArrowIcon /></RotatedArrow></BackButton>
        <PageTitle>振込先口座の管理</PageTitle>
      </Header>
      
      <TabContainer>
        <Tab 
          active={activeTab === '銀行振込'} 
          onClick={() => setActiveTab('銀行振込')}
        >
          銀行振込
        </Tab>
        <Tab 
          active={activeTab === 'PayPal'} 
          onClick={() => setActiveTab('PayPal')}
        >
          PayPal
        </Tab>
      </TabContainer>

      <FormContainer>
        {activeTab === '銀行振込' ? (
          <EditBankForm />
        ) : (
          <EditPaypalForm />
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default EditBankPage;