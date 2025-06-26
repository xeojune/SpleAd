import React from 'react';
import styled from 'styled-components';
import { getRecruitmentStatus } from '../../utils/dateUtils';
import ClockIcon from '../icons/ClockIcon';

const BannerContainer = styled.div`
  width: 100%;
  height: 20rem;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusTag = styled.div<{ status?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background-color: ${props => props.status === '募集終了' ? '#FFFFFF' : '#FF6EA5'};
  color: ${props => props.status === '募集終了' ? '#6B7280' : '#FFFFFF'};
  border-radius: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
  
  ${props => props.status === '募集終了' ? `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 7rem;
    padding: 0.625rem 1.5rem;
  ` : `
    top: 0.75rem;
    left: 0.75rem;
  `}
`;

const ImageOverlay = styled.div<{ isEnded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isEnded ? 'rgba(0, 0, 0, 0.4)' : 'none'};
  border-radius: 0.75rem;
`;

interface DescriptionBannerProps {
  image: string;
  recruitmentPeriod: string;
}

const DescriptionBanner: React.FC<DescriptionBannerProps> = ({ image, recruitmentPeriod }) => {
  const status = getRecruitmentStatus(recruitmentPeriod);
  const isEnded = status === '募集終了';

  return (
    <BannerContainer>
      <BannerImage src={image} alt="Campaign Banner" />
      <ImageOverlay isEnded={isEnded} />
      {(status === 'オープン予定' || status === '募集終了') && (
        <StatusTag status={status}>
          {status === 'オープン予定' && <ClockIcon width={15} height={15} />}
          {status}
        </StatusTag>
      )}
    </BannerContainer>
  );
};

export default DescriptionBanner;