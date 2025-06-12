import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const MediaImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const MediaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const MediaType = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;

  svg {
    margin-right: 0.25rem;
  }
`;

export const Timestamp = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const Caption = styled.p`
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  overflow-wrap: break-word;
`;

export const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #1976d2;
    background-color: #e3f2fd;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.background};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
`;

export const CarouselBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

export const TaggedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  margin-left: 6px;
  background-color: #e1bee7;
  color: #6a1b9a;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

export const Collaborators = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0;
  padding: 6px 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  color: #666;

  span {
    color: #1976d2;
    font-weight: 500;
  }
`;

export const CollabIcon = styled.span`
  font-size: 16px;
`;

export const Stats = styled.div`
  display: flex;
  gap: 12px;
  margin: 8px 0;
  color: #666;
  font-size: 14px;
`;

export const StatItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 16px;
  }
`;