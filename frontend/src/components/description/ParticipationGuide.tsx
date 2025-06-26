import React from 'react';
import styled from 'styled-components';
import guideImage from '../../assets/PostCard/IMG_7259.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
`;

const GuideImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e2e8f0;
  margin: 2rem 0;
`;

export const ParticipationGuide: React.FC = () => {
  return (
    <Container>
      <Title>参加方法</Title>
      <GuideImage src={guideImage} alt="参加方法" />
      <Divider />
    </Container>
  );
};