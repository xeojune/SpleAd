import React from 'react';
import styled from 'styled-components';
import Header from '../../components/dashboard/Header';
import ButtonPanel from '../../components/dashboard/ButtonPanel';

const DashboardContainer = styled.div`
  max-width: 24.5625rem;
  font-family: Pretendard JP;
  margin: 0 auto;
  padding-bottom: 4.375rem;
  background: white;
  min-height: 53.25rem;
  display: flex;
  flex-direction: column;
  
  @media screen and (max-width: 48rem) {
    max-width: none;
    padding-bottom: 3.75rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 3.25rem; /* Same as header height */
  
  @media screen and (max-width: 48rem) {
    padding: 0.75rem;
  }
`;

interface DashboardPageProps {
  children: React.ReactNode;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ children }) => {
  return (
    <DashboardContainer>
      <Header />
      <ContentArea>
        {children}
      </ContentArea>
      <ButtonPanel />
    </DashboardContainer>
  );
};

export default DashboardPage;