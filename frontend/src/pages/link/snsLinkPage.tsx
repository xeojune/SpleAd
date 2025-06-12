import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getInstagramAuthUrl, exchangeCodeForToken } from '../../apis/instagramAuth';
import { XAuth } from '../../apis/xAuth';
import CheckmarkIcon from '../../components/icons/CheckmarkIcon';
import {
  PageContainer,
  LeftPanel,
  RightPanel,
  RightPanelTitle,
  EmptyState,
  Title,
  SocialList,
  SocialInput,
  SocialButton,
  PreviewSection,
  PreviewCard,
  PreviewHeader,
  ButtonGroup,
  NextButton,
  SkipButton,
  RemoveButton,
  PreviewStats,
  StatItem,
  StatValue,
  StatLabel,
} from '../../styles/link/snsLinkPage.styles';

import twitterIcon from '../../assets/X.png';
import instagramIcon from '../../assets/instagram.png';
import tiktokIcon from '../../assets/tiktok.svg';
import youtubeIcon from '../../assets/youtube.png';
import lemon8Icon from '../../assets/lemon.png';

interface SocialLink {
  platform: string;
  username: string;
  icon: string;
  url: string;
  isConnected: boolean;
  profilePictureUrl?: string;
  followersCount?: number;
  followsCount?: number;
  mediaCount?: number;
  tweetCount?: number;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const SnsLinkPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => {
    // Try to load from localStorage first
    const savedLinks = localStorage.getItem('socialLinks');
    return savedLinks ? JSON.parse(savedLinks) : [
      { platform: 'Twitter/X', username: '', icon: twitterIcon, url: '', isConnected: false },
      { platform: 'Instagram', username: '', icon: instagramIcon, url: '', isConnected: false },
      { platform: 'Tiktok', username: '', icon: tiktokIcon, url: '', isConnected: false },
      { platform: 'YouTube', username: '', icon: youtubeIcon, url: '', isConnected: false },
      { platform: 'Lemon8', username: '', icon: lemon8Icon, url: '', isConnected: false },
    ];
  });

  // Save to localStorage whenever socialLinks changes
  useEffect(() => {
    localStorage.setItem('socialLinks', JSON.stringify(socialLinks));
  }, [socialLinks]);

  const handleOAuthConnect = async (platform: string) => {
    try {
      setIsProcessing(true);
      localStorage.setItem('lastAttemptedPlatform', platform);
      if (platform === 'Instagram') {
        const authUrl = getInstagramAuthUrl();
        window.location.href = authUrl;
      } else if (platform === 'Twitter/X') {
        console.log('🔄 Starting X OAuth flow...');
        await XAuth.initiateLogin();  // This will handle the redirect
      }
    } catch (error) {
      console.error(`❌ Failed to connect to ${platform}:`, error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Check if this is a callback from OAuth
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code) {
      handleOAuthCallback();
    }
  }, []);  

  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const errorReason = params.get('error_reason');
    const state = params.get('state');

    // Clear URL parameters immediately
    window.history.replaceState({}, document.title, window.location.pathname);

    if (error || errorReason) {
      console.log('Auth was denied or failed:', error, errorReason);
      setIsProcessing(false);
      return;
    }

    if (code && !isProcessing) {
      setIsProcessing(true);
      const lastPlatform = localStorage.getItem('lastAttemptedPlatform');
      
      try {
        if (lastPlatform === 'Instagram') {
          const instagramData = await exchangeCodeForToken(code);
          
          // Handle Instagram data...
          console.log('💾 Saving Instagram user ID to localStorage:', {
            id: instagramData.id,
            username: instagramData.username
          });
          localStorage.setItem('instagram_user_id', instagramData.id);
          
          const updatedLinks = socialLinks.map(link => 
            link.platform === 'Instagram' 
              ? { 
                  ...link, 
                  isConnected: true, 
                  username: instagramData.username,
                  profilePictureUrl: instagramData.profile_picture_url,
                  followersCount: instagramData.followers_count,
                  followsCount: instagramData.follows_count,
                  mediaCount: instagramData.media_count
                } 
              : link
          );
          setSocialLinks(updatedLinks);
          
        } else if (lastPlatform === 'Twitter/X' && state) {
          console.log('🔄 Processing X callback with code:', code);
          const storedState = localStorage.getItem('x_auth_state');
          
          if (state !== storedState) {
            throw new Error('Invalid state parameter');
          }
          
          const xData = await XAuth.handleCallback(code, state);
          console.log('✅ X auth successful:', xData);
          
          if (!('success' in xData) || !xData.success) {
            throw new Error('success' in xData ? xData.error : 'Failed to authenticate with X');
          }

          const userData = xData.userData.data;  // Access the nested data property
          const updatedLinks = socialLinks.map(link =>
            link.platform === 'Twitter/X'
              ? {
                  ...link,
                  isConnected: true,
                  username: userData.username,
                  profilePictureUrl: userData.profile_image_url,
                  followersCount: userData.public_metrics?.followers_count || 0,
                  followsCount: userData.public_metrics?.following_count || 0,
                  tweetCount: userData.public_metrics?.tweet_count || 0
                }
              : link
          );
          setSocialLinks(updatedLinks);
        }
      } catch (error) {
        console.error('Failed to process OAuth callback:', error);
      } finally {
        setIsProcessing(false);
        localStorage.removeItem('lastAttemptedPlatform');
        localStorage.removeItem('x_auth_state');
      }
    }
  };

  const handleDisconnect = (platform: string) => {
    const updatedLinks = socialLinks.map(link =>
      link.platform === platform
        ? { ...link, isConnected: false, username: '' }
        : link
    );
    setSocialLinks(updatedLinks);
  };

  const activeLinks = socialLinks.filter(link => link.isConnected);

  return (
    <PageContainer>
      <LeftPanel>
        <Title>SNS 계정을 연동해주세요</Title>
        <SocialList>
          {socialLinks.map((link) => (
            <SocialInput key={link.platform}>
              {link.isConnected ? (
                <>
                  <SocialButton connected={link.isConnected.toString()}>
                    <img src={link.icon} alt={link.platform} />
                    <span>@{link.username}</span>
                    <CheckmarkIcon className="checkmark" />
                  </SocialButton>
                  <RemoveButton onClick={() => handleDisconnect(link.platform)}>
                    ✕
                  </RemoveButton>
                </>
              ) : (
                <SocialButton 
                  onClick={() => !isProcessing && handleOAuthConnect(link.platform)}
                  disabled={isProcessing}
                >
                  <img src={link.icon} alt={link.platform} />
                  <span>{link.platform} 연동하기</span>
                </SocialButton>
              )}
            </SocialInput>
          ))}
        </SocialList>
        <ButtonGroup>
          <SkipButton onClick={() => navigate('/media')}>건너뛰기</SkipButton>
          <NextButton onClick={() => navigate('/media')}>다음</NextButton>
        </ButtonGroup>
      </LeftPanel>
      <RightPanel>
        <RightPanelTitle>페이지 미리보기</RightPanelTitle>
        {activeLinks.length > 0 ? (
          <PreviewSection>
            {activeLinks.map((link) => (
              <PreviewCard key={link.platform}>
                <PreviewHeader>
                  {link.profilePictureUrl ? (
                    <img 
                      src={link.profilePictureUrl} 
                      alt={link.platform} 
                      className="profile-picture"
                    />
                  ) : (
                    <img src={link.icon} alt={link.platform} />
                  )}
                  <div>
                    <div className="platform-name">{link.platform}</div>
                    <div className="username">@{link.username}</div>
                  </div>
                </PreviewHeader>
                {(link.platform === 'Instagram' || link.platform === 'Twitter/X') && link.followersCount !== undefined && (
                  <PreviewStats>
                    <StatItem>
                      <StatValue>{formatCount(link.platform === 'Twitter/X' ? (link.tweetCount || 0) : (link.mediaCount || 0))}</StatValue>
                      <StatLabel>{link.platform === 'Twitter/X' ? '트윗' : '게시물'}</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{formatCount(link.followersCount)}</StatValue>
                      <StatLabel>팔로워</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>{formatCount(link.followsCount || 0)}</StatValue>
                      <StatLabel>팔로잉</StatLabel>
                    </StatItem>
                  </PreviewStats>
                )}
              </PreviewCard>
            ))}
          </PreviewSection>
        ) : (
          <EmptyState>연동된 SNS가 없습니다</EmptyState>
        )}
      </RightPanel>
    </PageContainer>
  );
};

export default SnsLinkPage;