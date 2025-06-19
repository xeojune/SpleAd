import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import AccountInfo from '../../components/profile/MyAccount/AccountInfo';
import AddressInfo from '../../components/profile/MyAccount/AddressInfo';
import ArrowIcon from '../../components/icons/ArrowIcon';

const PageWrapper = styled.div`
  min-height: 100vh;
`;

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
  padding: 0;
  margin-right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #1e293b;
`;

const RotatedArrow = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f1f5f9;
  margin: 0;
`;

const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate('/profile')}>
            <RotatedArrow>
              <ArrowIcon />
            </RotatedArrow>
          </BackButton>
          <Title>アカウント情報の編集</Title>
        </Header>
        <ContentContainer>
          <AccountInfo />
          <Divider />
          <AddressInfo />
        </ContentContainer>
      </PageContainer>
    </PageWrapper>
  );
};

export default MyAccountPage;