import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../../components/dashboard/ProductCard';
import CheckButtonIcon from '../../components/icons/CheckButtonIcon';
import productData from '../../test_data/productData.json';
import purchaseData from '../../test_data/purchaseData.json';
import reviewData from '../../test_data/reviewData.json';
import { imageMap } from '../../utils/imageMap';
import { getRecruitmentStatus, type RecruitmentStatus } from '../../utils/dateUtils';
import { isMonitorCampaign, isPurchaseCampaign, isReviewCampaign, type Campaign } from '../../types/campaign';
import { useLocation } from 'react-router';

const Container = styled.div`
  padding: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  width: 100%;
  background: transparent;
  font-size: 1rem;
  color: ${props => props.$active ? '#000' : '#6B7280'};
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? '#FF6EA5' : 'transparent'};
  }
`;

const FilterSection = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.5rem;
  border: none;
  background: transparent;
  color: ${props => props.$active ? '#FF6EA5' : '#6B7280'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CampaignDescription = styled.div`
  background-color: #FFF1F5;
  color: #FF6EA5;
  padding: 1rem;
  margin: 0 0.5rem 1.5rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0 0.5rem;
`;

const CampaignPage: React.FC = () => {
  const location = useLocation();
  const savedTab = location.state?.currentTab || localStorage.getItem('campaignTab') || 'モニター';
  const [activeTab, setActiveTab] = useState(savedTab);
  const [selectedFilters, setSelectedFilters] = useState<RecruitmentStatus[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Run once when component mounts

  useEffect(() => {
    localStorage.setItem('campaignTab', activeTab);
  }, [activeTab]);

  const handleFilterClick = (filter: RecruitmentStatus) => {
    setSelectedFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setSelectedFilters([]); // Reset filters when switching tabs
    localStorage.setItem('campaignTab', tab);
  };

  const filteredCampaigns = useMemo(() => {
    let campaigns: Campaign[];
    if (activeTab === '購入') {
      campaigns = purchaseData.campaigns as Campaign[];
    } else if (activeTab === 'レビュー') {
      campaigns = reviewData.reviewCampaigns as Campaign[];
    } else {
      campaigns = productData.campaigns.filter(campaign => campaign.type === activeTab) as Campaign[];
    }
    
    if (selectedFilters.length === 0) {
      return campaigns;
    }
    
    return campaigns.filter(campaign => {
      const status = getRecruitmentStatus(campaign.recruitmentPeriod);
      return selectedFilters.includes(status);
    });
  }, [selectedFilters, activeTab]);

  return (
    <Container>
      <TabContainer>
        <Tab $active={activeTab === 'モニター'} onClick={() => handleTabClick('モニター')}>
          モニター
        </Tab>
        <Tab $active={activeTab === '購入'} onClick={() => handleTabClick('購入')}>
          購入
        </Tab>
        <Tab $active={activeTab === 'レビュー'} onClick={() => handleTabClick('レビュー')}>
          レビュー
        </Tab>
      </TabContainer>

      <FilterSection>
        <FilterButton $active={selectedFilters.includes('募集中')} onClick={() => handleFilterClick('募集中')}>
          <CheckButtonIcon active={selectedFilters.includes('募集中')} />
          募集中
        </FilterButton>
        <FilterButton $active={selectedFilters.includes('オープン予定')} onClick={() => handleFilterClick('オープン予定')}>
          <CheckButtonIcon active={selectedFilters.includes('オープン予定')} />
          オープン予定
        </FilterButton>
        <FilterButton $active={selectedFilters.includes('募集終了')} onClick={() => handleFilterClick('募集終了')}>
          <CheckButtonIcon active={selectedFilters.includes('募集終了')} />
          募集終了
        </FilterButton>
      </FilterSection>

      <CampaignGrid>
        {filteredCampaigns.map((campaign) => (
          <ProductCard
            key={campaign.id}
            image={imageMap[campaign.image]}
            title={campaign.title}
            description={Array.isArray(campaign.description) ? campaign.description : [campaign.description]}
            platforms={campaign.platforms}
            brand={campaign.brand}
            type={campaign.type}
            campaignBadges={campaign.campaignBadges}
            productName={Array.isArray(campaign.productName) ? campaign.productName : [campaign.productName]}
            recruitmentPeriod={campaign.recruitmentPeriod}
            announcementDate={campaign.announcementDate}
            participantCount={campaign.participantCount}
            participationMethod={isMonitorCampaign(campaign) ? campaign.participationMethod : undefined}
            participationDetails={isReviewCampaign(campaign) ? undefined : campaign.participationDetails}
            reviewReqs={isReviewCampaign(campaign) ? campaign.reviewReqs : undefined}
            postPeriod={isMonitorCampaign(campaign) || isReviewCampaign(campaign) ? campaign.postPeriod : undefined}
            purchaseTime={isPurchaseCampaign(campaign) || isReviewCampaign(campaign) ? campaign.purchaseTime : undefined}
            compensation={campaign.compensation}
          />
        ))}
      </CampaignGrid>
    </Container>
  );
};

export default CampaignPage;