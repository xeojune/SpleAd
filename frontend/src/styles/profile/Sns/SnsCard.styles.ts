import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  width: 100%;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Title = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1E293B;
`;

export const Username = styled.span`
  font-size: 0.875rem;
  color: #64748B;
`;

export const ConnectedTag = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  color: #448eff;
  background: #E6f0ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

export const Logo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: contain;
`;

export const ConnectButton = styled.button<{ isConnected: boolean }>`
  background-color: #FF69B4;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 7.5rem; /* Fixed width for all buttons */
  text-align: center;
  white-space: nowrap;
  transition: all 0.2s;
  
  ${({ isConnected }) => isConnected ? `
    display: flex;
    align-items: center;
    justify-content: center;
  background: white;
    border: 1px solid #E2E8F0;
    color: #64748B;
    
    &:hover {
      background: #F8FAFC;
      border-color: #CBD5E1;
    }
  ` : `
    background: #FF69B4;
    border: none;
    color: white;
    
    &:hover {
      background: #FF1493;
    }
  `}
`;

export const PageContainer = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 1rem;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #1A202C;
  
  &:hover {
    background-color: #F7FAFC;
    border-radius: 50%;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 0.5rem;
  color: #1A202C;
`;