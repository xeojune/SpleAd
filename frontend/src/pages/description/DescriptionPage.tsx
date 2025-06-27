import React from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import DescriptionHeader from '../../components/description/DescriptionHeader';
import DescriptionBanner from '../../components/description/DescriptionBanner';
import DescriptionInfo from '../../components/description/DescriptionInfo';
import { ParticipationGuide } from '../../components/description/ParticipationGuide';
import VerificationGuide from '../../components/description/VerificationGuide';
import { Caution } from '../../components/description/Caution';
import { DescriptionFooter } from '../../components/description/DescriptionFooter';
import PostGuide from '../../components/description/PostGuide';

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

interface CampaignData {
  image: string;
  productName: string | string[];
  title: string;
  description: string;
  platforms: string[];
  brand: string;
  type: string;
  recruitmentPeriod: string;
  announcementDate: string;
  participantCount: string;
  participationMethod?: string[];
  participationDetails?: string;  
  postPeriod: string;
  purchaseTime: string;
  compensation: string;
  isPurchase: boolean;
  reviewReqs?: string[];  
}

const DescriptionPage: React.FC = () => {
  const location = useLocation();
  const campaign = location.state as CampaignData;

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <>
      <DescriptionHeader title={campaign.title} />
      <ContentContainer>
        <DescriptionBanner
          image={campaign.image}
          recruitmentPeriod={campaign.recruitmentPeriod}
        />
        <DescriptionInfo
          brand={campaign.brand}
          type={campaign.type}
          productName={campaign.productName}
          title={campaign.title}
          recruitmentPeriod={campaign.recruitmentPeriod}
          announcementDate={campaign.announcementDate}
          participantCount={campaign.participantCount}
          postPeriod={campaign.postPeriod}
          purchaseTime={campaign.purchaseTime}
          platforms={campaign.platforms}
          participationMethod={campaign.participationMethod}
          participationDetails={campaign.type === 'レビュー' ? undefined : campaign.participationDetails}
          compensation={campaign.compensation}
          isPurchase={campaign.isPurchase}
          reviewReqs={campaign.type === 'レビュー' ? campaign.reviewReqs : undefined}
        />
        <ParticipationGuide />
        <PostGuide type={campaign.type} />
        <VerificationGuide />
        <Caution />
        <DescriptionFooter />
      </ContentContainer>
    </>
  );
};

export default DescriptionPage;