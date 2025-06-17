import React from 'react';
import styled from 'styled-components';
import { getRecruitmentStatus, type RecruitmentStatus } from '../../utils/dateUtils';


const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
`;

const Label = styled.span`
  color: #94a3b8;
`;

const Value = styled.span`
  color: #1e293b;
`;

const PlatformTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span<{ platform: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background: ${props => {
    switch (props.platform.toLowerCase()) {
      case 'instagram': return '#FFE5EC';
      case 'lips': return '#E5EEFF';
      case 'x': return '#E5E7EB';
      case 'loft': return '#fff1c1';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.platform.toLowerCase()) {
      case 'instagram': return '#FF4D82';
      case 'lips': return '#2563EB';
      case 'x': return '#4B5563';
      case 'loft': return '#d7a00b';
      default: return '#666666';
    }
  }};
`;

const StatusTag = styled.span<{ status: RecruitmentStatus }>`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  background-color: ${({ status }) => {
    switch (status) {
      case '募集予定':
        return '#3B82F6'; // Blue
      case '募集中':
        return '#10B981'; // Green
      case '募集終了':
        return '#6B7280'; // Gray
      default:
        return '#6B7280';
    }
  }};
  color: white;
`;

const Container = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PlatformContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PlatformHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlatformLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

interface DescriptionInfoProps {
  brand: string;
  productName: string;
  description: string;
  recruitmentPeriod: string;
  announcementDate: string;
  participantCount: string;
  postPeriod: string;
  platforms: string[];
}

const DescriptionInfo: React.FC<DescriptionInfoProps> = ({
  brand,
  productName,
  description,
  recruitmentPeriod,
  announcementDate,
  participantCount,
  postPeriod,
  platforms
}) => {
  const recruitmentStatus = getRecruitmentStatus(recruitmentPeriod);
  console.log('Recruitment Status:', {
    period: recruitmentPeriod,
    status: recruitmentStatus
  });

  return (
    <Container>
      <PlatformContainer>
        <PlatformHeader>
          <PlatformLabel>投稿先</PlatformLabel>
          <StatusTag status={recruitmentStatus}>
            {recruitmentStatus}
          </StatusTag>
        </PlatformHeader>
        <PlatformTags>
          {platforms.map((platform, index) => (
            <Tag key={index} platform={platform}>
              {platform}
            </Tag>
          ))}
        </PlatformTags>
      </PlatformContainer>
      <InfoGrid>
        <Label>ブランド</Label>
        <Value>{brand}</Value>
        <Label>提供商品</Label>
        <Value>{productName}</Value>
        <Label>商品説明</Label>
        <Value>{description}</Value>
        <Label>募集期間</Label>
        <Value>{recruitmentPeriod}</Value>
        <Label>当選発表</Label>
        <Value>{announcementDate}</Value>
        <Label>募集人数</Label>
        <Value>{participantCount}名</Value>
        <Label>投稿期間</Label>
        <Value>{postPeriod}</Value>
      </InfoGrid>
    </Container>
  );
};

export default DescriptionInfo;