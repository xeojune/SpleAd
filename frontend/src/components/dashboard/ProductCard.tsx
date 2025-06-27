import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import ClockIcon from '../icons/ClockIcon';
import { getRecruitmentStatus } from '../../utils/dateUtils';
import { useSearch } from '../../contexts/SearchContext';
import { Card, ImageContainer, CardImage, StatusTag, CardContent, TagContainer, Tag } from '../../styles/dashboard/ProductCard.styles';

const CardTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const CardDescription = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  min-height: 2.5rem;
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const Metric = styled.span`
  padding: 0.25rem 0.25rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: white;
  color: #535f7b;
  border: 1px solid #E5E7EB;
`;

interface ProductCardProps {
  image: string;
  title: string;
  description: string | string[];
  platforms: string[];
  brand: string;
  type: string;
  campaignBadges?: string[];
  productName?: string | string[];
  recruitmentPeriod?: string;
  announcementDate?: string;
  participantCount?: string;
  participationMethod?: string[];
  participationDetails?: string;
  postPeriod?: string;
  compensation?: string;
  purchaseTime?: string;
  reviewReqs?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  platforms,
  brand,
  type,
  campaignBadges,
  productName,
  recruitmentPeriod,
  announcementDate,
  participantCount,
  participationMethod,
  participationDetails,
  postPeriod,
  compensation,
  purchaseTime,
  reviewReqs
}) => {
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const status = recruitmentPeriod ? getRecruitmentStatus(recruitmentPeriod) : null;

  const matchesSearch = () => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const brandMatch = brand.toLowerCase().includes(query);
    const descriptionMatch = Array.isArray(description)
      ? description.some(desc => desc.toLowerCase().includes(query))
      : description.toLowerCase().includes(query);
    
    return brandMatch || descriptionMatch;
  };

  if (!matchesSearch()) return null;

  const handleClick = () => {
    // Create URL-safe versions of brand and title
    const urlSafeBrand = encodeURIComponent(brand);
    const urlSafeTitle = encodeURIComponent(title);

    navigate(`/dashboard/campaign/${urlSafeBrand}/${urlSafeTitle}`, {
      state: {
        image,
        brand,
        title,
        description,
        platforms,
        type,
        campaignBadges,
        productName,
        recruitmentPeriod,
        announcementDate,
        participantCount,
        participationMethod,
        participationDetails,
        postPeriod,
        purchaseTime,
        compensation,
        status,
        isPurchase: type === '購入',
        currentTab: type,
        reviewReqs
      }
    });
  };

  return (
    <Card onClick={handleClick}>
      <ImageContainer isEnded={status === '募集終了'}>
        <CardImage src={image} alt={title} />
        {(status === 'オープン予定' || status === '募集終了') && (
          <StatusTag status={status}>
            {status === 'オープン予定' && <ClockIcon width={15} height={15} />}
            {status}
          </StatusTag>
        )}
      </ImageContainer>
      <CardContent>
        <TagContainer>
          {platforms.map((platform, index) => (
            <Tag key={index} platform={platform}>
              {platform}
            </Tag>
          ))}
        </TagContainer>
        <CardTitle>{brand}</CardTitle>
        <CardDescription>
          {Array.isArray(description) 
            ? description.map((name, index) => (
                <React.Fragment key={index}>
                  {name}
                  {index < description.length - 1 && <>, <br /></>}
                </React.Fragment>
              ))
            : description}
        </CardDescription>
        {campaignBadges && campaignBadges.length > 0 && (
          <MetricsContainer>
            {campaignBadges.map((badge, index) => (
              <Metric key={index}>
                {badge}
              </Metric>
            ))}
          </MetricsContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;