import React, { useState } from 'react';
import styled from 'styled-components';
import DropDownBox from '../../components/DropDownBox';
import ProductCard from '../../components/dashboard/ProductCard';
import CheckButtonIcon from '../../components/icons/CheckButtonIcon';
import productData from '../../test_data/productData.json';
import { imageMap } from '../../utils/imageMap';

const Container = styled.div`
  padding: 1rem;
`;

const TopSection = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 1.25rem;
  border: none;
  background: transparent;
  color: ${props => props.$active ? '#FF6EA5' : '#6B7280'};
  font-size: 0.875rem;
  cursor: pointer;
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const CampaignPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'open'>('open');
  const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);
  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  return (
    <Container>
      <TopSection>
        <DropDownBox 
          label="キャンペーン" 
          isOpen={campaignDropdownOpen}
          onClick={() => setCampaignDropdownOpen(!campaignDropdownOpen)}
        />
        <DropDownBox 
          label="モニター" 
          isOpen={monitorDropdownOpen}
          onClick={() => setMonitorDropdownOpen(!monitorDropdownOpen)}
          width="6rem"
        />
      </TopSection>

      <FilterSection>
        <FilterButtons>
          <FilterButton 
            $active={activeFilter === 'upcoming'}
            onClick={() => setActiveFilter('upcoming')}
          >
            <CheckButtonIcon active={activeFilter === 'upcoming'} />
            先着順
          </FilterButton>
          <FilterButton 
            $active={activeFilter === 'open'}
            onClick={() => setActiveFilter('open')}
          >
            <CheckButtonIcon active={activeFilter === 'open'} />
            オープン予定
          </FilterButton>
        </FilterButtons>

        <DropDownBox 
          label="最新順" 
          isOpen={sortDropdownOpen}
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          noBorder
          width="6rem"
        />
      </FilterSection>

      <CampaignGrid>
        {(productData.campaigns as any[]).map((campaign: any) => (
          <ProductCard
            key={campaign.id}
            image={imageMap[campaign.image]}
            brand={campaign.brand}
            title={campaign.title}
            description={campaign.description}
            platforms={campaign.platforms}
            metrics={campaign.metrics}
            recruitmentPeriod={campaign.recruitmentPeriod}
            announcementDate={campaign.announcementDate}
            participantCount={campaign.participantCount}
            postPeriod={campaign.postPeriod}
          />
        ))}
      </CampaignGrid>
    </Container>
  );
};

export default CampaignPage;