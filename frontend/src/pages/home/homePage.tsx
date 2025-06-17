import React from 'react'
import Banner from '../../components/dashboard/Banner'
import styled from 'styled-components';
import ProductCard from '../../components/dashboard/ProductCard';
import { imageMap } from '../../utils/imageMap';
import productData from '../../test_data/productData.json';

const SectionTitle = styled.h2`
  margin: 1.5rem 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0 1rem;
  
  @media screen and (max-width: 48rem) {
    font-size: 1.125rem;
    margin: 1.5rem 0 0.75rem 0;
    padding: 0 0.75rem;
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
  justify-content: space-between;
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
  flex: 0 0 calc(50% - 0.5rem); /* Take up half the space minus half the gap */
  max-width: calc(50% - 0.5rem);
  
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const HomePage:React.FC = () => {
    const campaigns = productData.campaigns;

    return (
        <>
            <Banner />
            <SectionTitle>キャンペーン</SectionTitle>
            <ProductListContainer>
                <ProductList>
                    {campaigns.map((campaign) => (
                        <ProductWrapper key={campaign.id}>
                            <ProductCard 
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
                        </ProductWrapper>
                    ))}
                </ProductList>
            </ProductListContainer>
        </>
    )
}

export default HomePage