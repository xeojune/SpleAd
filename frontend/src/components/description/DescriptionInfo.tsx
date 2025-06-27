import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PlatformTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
      case 'x(twitter)': return '#E5E7EB';
      case 'tiktok': return '#000000';
      case 'loft': return '#fff1c1';
      case 'qoo10': return '#fee1df';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => {
    switch (props.platform.toLowerCase()) {
      case 'instagram': return '#FF4D82';
      case 'lips': return '#2563EB';
      case 'x': return '#4B5563';
      case 'x(twitter)': return '#4B5563';
      case 'tiktok': return '#FFFFFF';
      case 'loft': return '#d7a00b';
      case 'qoo10': return '#fb4136';
      default: return '#666666';
    }
  }};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem 1rem;
  margin-top: 0.5rem;
`;

const Label = styled.span`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const Value = styled.span`
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: pre-wrap;
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;
`;

const BulletItem = styled.li`
  color: #1e293b;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e2e8f0;
  margin: 2rem 0;
`;

interface DescriptionInfoProps {
  brand: string;
  type: string;
  productName: string | string[];
  title: string;
  recruitmentPeriod: string;
  announcementDate: string;
  participantCount: string;
  postPeriod: string;
  purchaseTime?: string;
  platforms: string[];
  participationMethod?: string[];
  participationDetails?: string;
  compensation?: string;
  isPurchase: boolean;
  reviewReqs?: string[];
}

const DescriptionInfo: React.FC<DescriptionInfoProps> = ({
  brand,
  type,
  productName,
  title,
  recruitmentPeriod,
  announcementDate,
  participantCount,
  postPeriod,
  purchaseTime,
  platforms,
  participationMethod,
  participationDetails,
  compensation,
  isPurchase,
  reviewReqs
}) => {
  return (
    <Container>
      <PlatformTags>
        {platforms.map((platform, index) => (
          <Tag key={index} platform={platform}>
            {platform}
          </Tag>
        ))}
      </PlatformTags>
      
      <div>
        <Title>{title}</Title>
      </div>

      <InfoGrid>
        <Label>ブランド</Label>
        <Value>{brand}</Value>

        <Label>商品名</Label>
        <Value>
          {Array.isArray(productName) ? (
            productName.map((name, index) => (
              <React.Fragment key={index}>
                {name}
                {index < productName.length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            productName
          )}
        </Value>

        <Label>募集期間</Label>
        <Value>{recruitmentPeriod}</Value>

        <Label>当選発表</Label>
        <Value>{announcementDate}</Value>

        <Label>募集人数</Label>
        <Value>{participantCount}名</Value>

        {!isPurchase && participationMethod && participationMethod.length > 0 && (
          <>
            <Label>参加方法</Label>
            <Value>
              {participationMethod.map((method, index) => (
                <React.Fragment key={index}>
                  {method.startsWith('-') ? (
                    <div style={{ marginLeft: '1rem' }}>{method}</div>
                  ) : (
                    <>
                      {method}
                      {index < participationMethod.length - 1 && <br />}
                    </>
                  )}
                </React.Fragment>
              ))}
            </Value>
          </>
        )}

        {(type === '購入' || type === 'モニター') && participationDetails && (
          <>
            <Label>参加条件</Label>
            <Value>{participationDetails}</Value>
          </>
        )}
        {(type === 'レビュー') && reviewReqs && (
          <>
            <Label>レビュー要件</Label>
            <Value style={{ color: 'red' }}>{reviewReqs.join(', ')}</Value>
          </>
        )}

        
        {(type === '購入' || type === 'レビュー') && purchaseTime && (
          <>
            <Label>購入可能時間</Label>
            <Value>{purchaseTime}</Value>
          </>
        )}

        {(type === 'モニター' || type === 'レビュー') && postPeriod && (
          <>
            <Label>{type === 'モニター' ? '投稿期間' : 'レビュー期限'}</Label>
            <Value>{postPeriod}</Value>
          </>
        )}

        {compensation && (
          <>
            <Label>
              {type === 'モニター' && '報酬'}
              {type === '購入' && 'リワード返金内容'}
              {type === 'レビュー' && '謝礼'}
            </Label>
            <Value>{compensation}</Value>
          </>
        )}
        
      </InfoGrid>
      <Divider />
    </Container>
  );
};

export default DescriptionInfo;