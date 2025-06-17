import styled from 'styled-components';

export const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ direction }) => direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: ${({ direction }) => direction === 'left' ? '"←"' : '"→"'};
    font-size: 1.25rem;
  }

  @media screen and (max-width: 48rem) {
    width: 2rem;
    height: 2rem;
    ${({ direction }) => direction === 'left' ? 'left: 0.5rem;' : 'right: 0.5rem;'}
  }
`;

export const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24.5625rem;
  height: 18.75rem;
  flex-shrink: 0;
  overflow: hidden;
  
  &:hover ${ArrowButton} {
    opacity: 1;
  }
  
  @media screen and (max-width: 48rem) {
    max-width: none;
  }
`;

export const BannerImageContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  transition: transform 0.3s ease;
`;

export const BannerImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  flex-shrink: 0;
`;

export const BannerButton = styled.button`
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  z-index: 1;
  
  @media screen and (max-width: 48rem) {
    right: 1rem;
    padding: 0.625rem 1.5rem;
    font-size: 0.875rem;
  }
  
  &::after {
    content: '→';
    margin-left: 8px;
  }
`;



export const BannerTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  
  @media screen and (max-width: 48rem) {
    font-size: 1.25rem;
  }
`;

export const BannerSubtitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 1.25rem 0;
  font-weight: bold;
  line-height: 1.2;
  
  @media screen and (max-width: 48rem) {
    font-size: 1.75rem;
    margin: 0 0 1rem 0;
  }
`;

export const BannerDecoration = styled.span`
  position: absolute;
  font-size: 1.5rem;
  
  &.heart {
    top: 1rem;
    right: 1rem;
  }
  
  &.eyes {
    bottom: 1rem;
    left: 1rem;
  }
  
  @media screen and (max-width: 48rem) {
    font-size: 1.25rem;
  }
`;