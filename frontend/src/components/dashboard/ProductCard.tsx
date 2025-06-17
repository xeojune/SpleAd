import React from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardDescription,
  TagContainer,
  Tag,
  MetricsContainer,
  Metric
} from '../../styles/dashboard/ProductCard.styles';
import { ParticipantIcon } from '../icons/PartcipantIcon';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  platforms: string[];
  metrics: {
    target: string;
    current: string;
  };
  brand?: string;
  recruitmentPeriod?: string;
  announcementDate?: string;
  participantCount?: string;
  postPeriod?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  platforms,
  metrics,
  brand,
  recruitmentPeriod,
  announcementDate,
  participantCount,
  postPeriod
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/description', {
      state: {
        image,
        brand,
        title,
        description,
        platforms,
        recruitmentPeriod,
        announcementDate,
        participantCount,
        postPeriod
      }
    });
  };

  return (
    <Card onClick={handleClick}>
      <CardImage src={image} alt={title} />
      <CardContent>
        <TagContainer>
          {platforms.map((platform, index) => (
            <Tag key={index} platform={platform}>
              {platform}
            </Tag>
          ))}
        </TagContainer>
        <CardTitle>{brand}</CardTitle>
        <CardDescription>{title}</CardDescription>
        <MetricsContainer>
          <Metric>
            <ParticipantIcon />
            {`${metrics.current}/${metrics.target}`}
          </Metric>
        </MetricsContainer>
      </CardContent>
    </Card>
  );
};

export default ProductCard;