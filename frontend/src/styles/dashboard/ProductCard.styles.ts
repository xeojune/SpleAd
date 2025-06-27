import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  overflow: hidden;
  margin-bottom: 1rem;
  width: calc((100% - 2rem) / 3);
  min-width: 10rem;
  flex-shrink: 0;
  
  @media screen and (max-width: 48rem) {
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    width: calc((100% - 1rem) / 2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
  
  @media screen and (max-width: 48rem) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
`;

export const CardContent = styled.div`
  margin-top: 0.75rem;
  width: 100%;
  
  @media screen and (max-width: 48rem) {
    text-align: center;
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #7D8CAE;
  line-height: 0.75rem;
  
  @media screen and (max-width: 48rem) {
    font-size: 0.875rem;
    display: flex;
    justify-content: flex-start;
  }
`;

export const CardDescription = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #1E293B;
  font-weight: 600;
  line-height: 0.75rem;
  
  @media screen and (max-width: 48rem) {
    font-size: 0.75rem;
    display: flex;
    justify-content: flex-start;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`;

export const Tag = styled.span<{ platform: string }>`
  padding: 0.25rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ platform }) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '#ffebf5';
      case 'lips':
        return '#E2D8FF';
      case 'x':
        return '#c6ddfc';
      case 'loft':
        return '#fff1c1';
      case 'qoo10':
        return '#fee1df';
      default:
        return '#f0f0f0';
    }
  }};
  color: ${({ platform }) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '#d62976';
      case 'lips':
        return '#895FFF';
      case 'x':
        return '#1e4d9b';
      case 'loft':
        return '#d7a00b';
      case 'qoo10':
        return '#fb4136';
      default:
        return '#666666';
    }
  }};
  
  @media screen and (max-width: 48rem) {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  }
`;

export const MetricsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const Metric = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #7D8CAE;
  background: #E2E8F0;
  padding: 0.25rem 0.375rem;
  border-radius: 0.25rem;
  
  @media screen and (max-width: 48rem) {
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
  }
`;

export const ImageContainer = styled.div<{ isEnded?: boolean }>`
  position: relative;
  width: 10rem;
  height: 10rem;
  
  @media screen and (max-width: 48rem) {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
  
  ${props => props.isEnded && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 0.75rem;
    }
  `}
`;

export const StatusTag = styled.div<{ status?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.35rem 0.5rem;
  background-color: ${props => props.status === '募集終了' ? '#FFFFFF' : '#FF6EA5'};
  color: ${props => props.status === '募集終了' ? '#6B7280' : '#FFFFFF'};
  border-radius: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
  
  ${props => props.status === '募集終了' ? `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 600;
    min-width: 6rem;
    padding: 0.35rem 0.5rem;
    
  ` : `
    top: 0.75rem;
    left: 0.75rem;

  `}
`;
