import React, { useState } from 'react';
import {
  BannerContainer,
  BannerImage,
  BannerImageContainer,
  ArrowButton,
} from '../../styles/dashboard/Banner.styles';
import DottedNav from './DottedNav';
import arenciaBanner from '../../assets/arenciaBanner.png';
import arenciaBanner2 from '../../assets/arenciaBanner2.png';

const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerImages = [arenciaBanner, arenciaBanner2];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <BannerContainer>
      <BannerImageContainer style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {bannerImages.map((image, index) => (
          <BannerImage key={index} src={image} alt={`Arencia Banner ${index + 1}`} />
        ))}
      </BannerImageContainer>
      <ArrowButton direction="left" onClick={handlePrev} aria-label="Previous banner" />
      <ArrowButton direction="right" onClick={handleNext} aria-label="Next banner" />
      <DottedNav
        total={bannerImages.length}
        current={currentIndex}
        onDotClick={handleDotClick}
      />
    </BannerContainer>
  );
};

export default Banner;