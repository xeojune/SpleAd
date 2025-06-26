import React from 'react'
import Banner from '../../components/dashboard/Banner'
import styled from 'styled-components';
import ProductCard from '../../components/dashboard/ProductCard';
import { imageMap } from '../../utils/imageMap';
import productData from '../../test_data/productData.json';

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  padding: 0 1rem;
  
  @media screen and (max-width: 48rem) {
    margin: 1.5rem 0 0.75rem 0;
    padding: 0 0.75rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 1.5rem 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  
  @media screen and (max-width: 48rem) {
    font-size: 1.125rem;
    margin: 1.5rem 0 0.75rem 0;
  }
`;

const ViewAllButton = styled.button`
  background-color: #24293E;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1a1f33;
  }
`;

const ProductListContainer = styled.div`
  position: relative;
  padding-right: 1rem;
  padding-left: 1rem;
  
  @media screen and (max-width: 48rem) {
    padding: 0.75rem;
  }
`;

const ProductList = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const ProductWrapper = styled.div`
  max-width: calc(50% - 0.5rem);
  
  &:not(:last-child) {
    margin-right: 1.5rem;
  }
`;

const HomePage: React.FC = () => {
    const campaigns = productData.campaigns;

    return (
        <>
            <Banner />
            <SectionHeader>
                <SectionTitle>新着モニターキャンペーン</SectionTitle>
                <ViewAllButton>すべて見る</ViewAllButton>
            </SectionHeader>
            <ProductListContainer>
                <ProductList>
                    {campaigns
                        .filter(campaign => campaign.type === 'モニター')
                        .map((campaign) => (
                            <ProductWrapper key={campaign.id}>
                                <ProductCard 
                                    image={imageMap[campaign.image]}
                                    brand={campaign.brand}
                                    title={campaign.title}
                                    description={campaign.description}
                                    platforms={campaign.platforms}
                                    type={campaign.type}
                                    campaignBadges={campaign.campaignBadges}
                                    productName={campaign.productName}
                                    recruitmentPeriod={campaign.recruitmentPeriod}
                                    announcementDate={campaign.announcementDate}
                                    participantCount={campaign.participantCount}
                                    participationMethod={campaign.participationMethod}
                                    participationDetails={campaign.participationDetails}
                                    postPeriod={campaign.postPeriod}
                                    compensation={campaign.compensation}
                                />
                            </ProductWrapper>
                        ))}
                </ProductList>
            </ProductListContainer>

            <SectionHeader>
                <SectionTitle>新着購入キャンペーン</SectionTitle>
                <ViewAllButton>すべて見る</ViewAllButton>
            </SectionHeader>
            <ProductListContainer>
                <ProductList>
                    {campaigns
                        .filter(campaign => campaign.type === '購入')
                        .map((campaign) => (
                            <ProductWrapper key={`purchase-${campaign.id}`}>
                                <ProductCard 
                                    image={imageMap[campaign.image]}
                                    brand={campaign.brand}
                                    title={campaign.title}
                                    description={campaign.description}
                                    platforms={campaign.platforms}
                                    type={campaign.type}
                                    campaignBadges={campaign.campaignBadges}
                                    productName={campaign.productName}
                                    recruitmentPeriod={campaign.recruitmentPeriod}
                                    announcementDate={campaign.announcementDate}
                                    participantCount={campaign.participantCount}
                                    participationMethod={campaign.participationMethod}
                                    participationDetails={campaign.participationDetails}
                                    postPeriod={campaign.postPeriod}
                                    compensation={campaign.compensation}
                                />
                            </ProductWrapper>
                        ))}
                </ProductList>
            </ProductListContainer>

            <SectionHeader>
                <SectionTitle>新着レビューキャンペーン</SectionTitle>
                <ViewAllButton>すべて見る</ViewAllButton>
            </SectionHeader>
            <ProductListContainer>
                <ProductList>
                    {campaigns
                        .filter(campaign => campaign.type === 'レビュー')
                        .map((campaign) => (
                            <ProductWrapper key={`review-${campaign.id}`}>
                                <ProductCard 
                                    image={imageMap[campaign.image]}
                                    brand={campaign.brand}
                                    title={campaign.title}
                                    description={campaign.description}
                                    platforms={campaign.platforms}
                                    type={campaign.type}
                                    campaignBadges={campaign.campaignBadges}
                                    productName={campaign.productName}
                                    recruitmentPeriod={campaign.recruitmentPeriod}
                                    announcementDate={campaign.announcementDate}
                                    participantCount={campaign.participantCount}
                                    participationMethod={campaign.participationMethod}
                                    participationDetails={campaign.participationDetails}
                                    postPeriod={campaign.postPeriod}
                                    compensation={campaign.compensation}
                                />
                            </ProductWrapper>
                        ))}
                </ProductList>
            </ProductListContainer>
        </>
    );
};

export default HomePage