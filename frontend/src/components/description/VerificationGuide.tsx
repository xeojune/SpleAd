import React from 'react'
import styled from 'styled-components';
import verifyGuideImg from '../../assets/PostCard/IMG_7272.png'

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
  margin: 1rem 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: #FF6EA5;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff5994;
  }
`;

const ButtonText = styled.span`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const LinkIcon = styled.span`
  display: inline-flex;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const VerificationGuide: React.FC = () => {
  return (
    <Container>
      <Title>投稿方法（レビュー投稿）</Title>
      <Button>
        <LinkIcon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </LinkIcon>
        <ButtonText>投稿方法を見る</ButtonText>
      </Button>
      <GuideImage src={verifyGuideImg} alt="参加方法" />
      <Divider />
    </Container>
  )
}

export default VerificationGuide