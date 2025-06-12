import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

export const LeftPanel = styled.div`
  flex: 1;
  padding: 40px;
  border-right: 1px solid #eee;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const RightPanel = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

export const RightPanelTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  padding: 0 20px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 32px;
`;

export const SocialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
`;

export const SocialInput = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const SocialButton = styled.button<{ connected?: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ connected }) => (connected === 'true' ? '#0095F6' : '#e0e0e0')};
  border-radius: 8px;
  background-color: ${({ connected }) => (connected === 'true' ? '#F0F9FF' : 'white')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ connected }) => (connected === 'true' ? '#E1F3FF' : '#f8f9fa')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background-color: #f5f5f5;
  }

  img {
    width: 24px;
    height: 24px;
  }

  span {
    flex: 1;
    text-align: left;
    color: ${({ connected }) => (connected === 'true' ? '#0095F6' : '#1a1a1a')};
    font-weight: ${({ connected }) => (connected === 'true' ? '600' : 'normal')};
  }

  .checkmark {
    flex-shrink: 0;
    margin-left: 8px;
  }
`;

export const UsernameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .checkmark {
    margin-left: -4px;
    margin-right: 4px;
  }
`;

export const RemoveButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ff4444;
  }
`;

export const PreviewSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  padding: 20px;
`;

export const PreviewCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 280px;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-picture {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .platform-name {
    font-weight: 600;
    font-size: 16px;
    color: #1a1a1a;
  }

  .username {
    font-size: 14px;
    color: #666;
  }
`;

export const PreviewStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #eee;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const StatValue = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

export const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

export const NextButton = styled(Button)`
  background-color: #000;
  color: white;
  border: none;
  &:hover {
    background-color: #333;
  }
`;

export const SkipButton = styled(Button)`
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  &:hover {
    background-color: #f5f5f5;
  }
`;