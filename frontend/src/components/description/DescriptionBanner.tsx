import React from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  width: 100%;
  height: 100%rem;
  position: relative;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface DescriptionBannerProps {
  image: string;
}

const DescriptionBanner: React.FC<DescriptionBannerProps> = ({ image }) => {
  return (
    <BannerContainer>
      <BannerImage src={image} alt="Campaign Banner" />
    </BannerContainer>
  );
};

export default DescriptionBanner;