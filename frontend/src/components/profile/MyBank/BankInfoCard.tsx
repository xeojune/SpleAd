import styled from 'styled-components';
import React from 'react';
import { useNavigate } from 'react-router';

interface BankInfoProps {
  bankName: string;
  accountHolderLastKana: string;
  accountHolderFirstKana: string;
  branchCode: string;
  accountType: string;
  accountNumber: string;
  accountPostalCode: string;
  accountAddress: string;
  accountPhone: string;
  onDelete?: () => void;
}

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
`;

const InfoRow = styled.div<{ hasMargin?: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.hasMargin ? '12px' : '0'};
`;

const Value = styled.span`
  color: #333;
  font-size: 0.875rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StyledButton = styled.button<{ variant: 'primary' | 'delete' }>`
  padding: 0 0.5rem;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background-color: #1976d2;
    color: white;
    border: none;
    &:hover {
      background-color: #1565c0;
    }
  `}

  ${props => props.variant === 'delete' && `
    background-color: white;
    color: #d32f2f;
    border: 1px solid #d32f2f;
    &:hover {
      background-color: #ffebee;
    }
  `}
`;

const BankInfoCard: React.FC<BankInfoProps> = ({
  bankName,
  accountHolderLastKana,
  accountHolderFirstKana,
  branchCode,
  accountType,
  accountNumber,
  accountPostalCode,
  accountAddress,
  accountPhone,
  onDelete
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/profile/edit-bank', { state: { activeTab: '銀行振込' } });
  };

  return (
    <Card>
      <Title>銀行振込</Title>
      <InfoRow>
        <Value>{accountHolderLastKana} {accountHolderFirstKana}</Value>
      </InfoRow>
      <InfoRow hasMargin>
        <Value>{bankName} {branchCode} {accountType} {accountNumber}</Value>
      </InfoRow>
      <InfoRow>
        <Value style={{ fontSize: '0.75rem', color: '#535F7B' }}>{accountPostalCode}</Value>
      </InfoRow>
      <InfoRow>
        <Value style={{ fontSize: '0.75rem', color: '#535F7B' }}>{accountAddress}</Value>
      </InfoRow>
      <InfoRow>
        <Value style={{ fontSize: '0.75rem', color: '#535F7B' }}>{accountPhone}</Value>
      </InfoRow>
      <ButtonContainer>
        <StyledButton variant="primary" onClick={handleEdit}>
          編集
        </StyledButton>
        <StyledButton variant="delete" onClick={onDelete}>
          削除
        </StyledButton>
      </ButtonContainer>
    </Card>
  );
};

export default BankInfoCard;