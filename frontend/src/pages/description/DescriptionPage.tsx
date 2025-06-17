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

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

interface CampaignData {
  image: string;
  title: string;
  description: string;
  platforms: string[];
  brand: string;
  recruitmentPeriod: string;
  announcementDate: string;
  participantCount: string;
  postPeriod: string;
}

const DescriptionPage: React.FC = () => {
  const location = useLocation();
  const campaign = location.state as CampaignData;

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <>
      <DescriptionHeader productName={campaign.title} />
      <ContentContainer>
        <DescriptionBanner
          image={campaign.image}
        />
        <DescriptionInfo
          brand={campaign.brand}
          productName={campaign.title}
          description={campaign.description}
          recruitmentPeriod={campaign.recruitmentPeriod}
          announcementDate={campaign.announcementDate}
          participantCount={campaign.participantCount}
          postPeriod={campaign.postPeriod}
          platforms={campaign.platforms}
        />
        <ParticipationGuide />
        <VerificationGuide />
        <Caution />
        <DescriptionFooter />
      </ContentContainer>
    </>
  );
};

export default DescriptionPage;