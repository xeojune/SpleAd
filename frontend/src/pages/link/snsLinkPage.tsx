import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getInstagramAuthUrl, exchangeCodeForToken} from '../../apis/instagramAuth';
import { XAuth } from '../../apis/xAuth';
import { TikTokAuth } from '../../apis/tiktokAuth';
import { updateUserLinkedAccounts, authApi } from '../../apis/masterAuth';
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
  likesCount?: number;
  videoCount?: number;
  isVerified?: boolean;
  bio?: string;
  profileUrl?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'Twitter/X', username: '', icon: twitterIcon, url: '', isConnected: false },
    { platform: 'Instagram', username: '', icon: instagramIcon, url: '', isConnected: false },
    { platform: 'Tiktok', username: '', icon: tiktokIcon, url: '', isConnected: false },
  ]);

  useEffect(() => {
    const checkUserSetup = async () => {
      try {
        setIsLoading(true);
        const user = await authApi.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // If user has already completed SNS setup, redirect to dashboard
        if (user.hasCompletedSnsSetup) {
          navigate('/dashboard');
          return;
        }

        // Update social links with existing connections
        const updatedLinks = socialLinks.map(link => {
          const linkedAccount = user.linkedAccounts?.find(
            account => account.platform === link.platform
          );

          if (linkedAccount) {
            return {
              ...link,
              isConnected: linkedAccount.isConnected,
              username: linkedAccount.username,
              profilePictureUrl: linkedAccount.profilePictureUrl,
              followersCount: linkedAccount.followersCount,
              followsCount: linkedAccount.followsCount,
              mediaCount: linkedAccount.mediaCount,
              tweetCount: linkedAccount.tweetCount,
              videoCount: linkedAccount.videoCount,
            };
          }
          return link;
        });

        setSocialLinks(updatedLinks);
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSetup();
  }, [navigate]);

  // Don't render anything while checking user status
  if (isLoading) {
    return null;
  }

  const handleOAuthConnect = async (platform: string) => {
    try {
      setIsProcessing(true);
      const user = await authApi.getCurrentUser();
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('No valid user ID found');
        navigate('/login');
        return;
      }
      
      localStorage.setItem('lastAttemptedPlatform', platform);
      
      if (platform === 'Instagram') {
        const authUrl = getInstagramAuthUrl(userId);
        window.location.href = authUrl;
      } else if (platform === 'Twitter/X') {
        console.log('🔄 Starting X OAuth flow...');
        await XAuth.initiateLogin(userId);  
      } else if (platform === 'Tiktok') {
        console.log('🔄 Starting TikTok OAuth flow...');
        await TikTokAuth.initiateLogin(userId);  
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

  const updateLinkedAccounts = async (updatedLinks: typeof socialLinks) => {
    try {
      const user = await authApi.getCurrentUser();
      const userId = user?._id || user?.id;
      if (!userId) return;

      await updateUserLinkedAccounts({
        userId,
        linkedAccounts: updatedLinks
          .filter(link => link.isConnected)
          .map(link => ({
            platform: link.platform,
            username: link.username,
            profilePictureUrl: link.profilePictureUrl || '',
            isConnected: link.isConnected,
            followersCount: link.followersCount || 0,
            followsCount: link.followsCount || 0,
            mediaCount: link.mediaCount,
            tweetCount: link.tweetCount,
            videoCount: link.videoCount,
            lastUpdated: new Date(),
          }))
      });

      // Refresh user data after update
      const updatedUser = await authApi.getCurrentUser();
      if (updatedUser?.linkedAccounts) {
        const newLinks = socialLinks.map(link => {
          const updatedAccount = updatedUser.linkedAccounts.find(
            account => account.platform === link.platform
          );
          return updatedAccount ? { ...link, ...updatedAccount } : link;
        });
        setSocialLinks(newLinks);
      }
    } catch (error) {
      console.error('Failed to update linked accounts:', error);
    }
  };

  const handleOAuthCallback = async () => {
    // Prevent multiple executions
    if (isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const errorReason = params.get('error_reason');
      const state = params.get('state');
      const platform = params.get('platform');
      
      // Clear URL parameters immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Get user data first
      const user = await authApi.getCurrentUser();
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('No user ID found');
        navigate('/login');
        return;
      }

      if (error || errorReason) {
        console.log('Auth was denied or failed:', error, errorReason);
        setIsProcessing(false);
        return;
      }

      if (code && !isProcessing) {
        setIsProcessing(true);
        try {
          const lastAttemptedPlatform = localStorage.getItem('lastAttemptedPlatform');

          if (lastAttemptedPlatform === 'Instagram') {
            const instagramResponse = await exchangeCodeForToken(code, userId);
            const updatedLinks = socialLinks.map(link =>
              link.platform === 'Instagram'
                ? {
                    ...link,
                    isConnected: true,
                    username: instagramResponse?.username || 'Instagram User',
                    profilePictureUrl: instagramResponse?.profile_picture_url || '',
                    followersCount: instagramResponse?.followers_count || 0,
                    followsCount: instagramResponse?.follows_count || 0,
                    mediaCount: instagramResponse?.media_count || 0
                  }
                : link
            );
            setSocialLinks(updatedLinks);
            await updateLinkedAccounts(updatedLinks);
          } else if (lastAttemptedPlatform === 'Twitter/X' && state) {
            const xResponse = await XAuth.handleCallback(code, state, userId);
            const userData = xResponse?.userData?.data || {};  
            const metrics = userData?.public_metrics || {};
            const updatedLinks = socialLinks.map(link =>
              link.platform === 'Twitter/X'
                ? {
                    ...link,
                    isConnected: true,
                    username: userData.username || 'X User',  
                    profilePictureUrl: userData.profile_image_url || '',
                    followersCount: metrics?.followers_count || 0,
                    followsCount: metrics?.following_count || 0,
                    tweetCount: metrics?.tweet_count || 0
                  }
                : link
            );
            setSocialLinks(updatedLinks);
            await updateLinkedAccounts(updatedLinks);
          } else if (lastAttemptedPlatform === 'Tiktok' && state) {
            const tiktokResponse = await TikTokAuth.handleCallback(code, state, userId);
            const userData = tiktokResponse?.tokenData?.userData || {};
            const stats = userData?.stats || {};
            
            const updatedLinks = socialLinks.map(link =>
              link.platform === 'Tiktok'
                ? {
                    ...link,
                    isConnected: true,
                    username: userData?.display_name || 'TikTok User',
                    profilePictureUrl: userData?.avatar_url || '',
                    followersCount: stats?.follower_count || 0,
                    followsCount: stats?.following_count || 0,
                    videoCount: stats?.video_count || 0
                  }
                : link
            );
            setSocialLinks(updatedLinks);
            await updateLinkedAccounts(updatedLinks);
          }
        } catch (error) {
          console.error('Failed to process OAuth callback:', error);
        } finally {
          setIsProcessing(false);
          localStorage.removeItem('lastAttemptedPlatform');
        }
      }
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
    }
  };

  const handleDisconnect = async (platform: string) => {
    const updatedLinks = socialLinks.map(link =>
      link.platform === platform
        ? {
            ...link,
            isConnected: false,
            username: '',
            profilePictureUrl: '',
            followersCount: 0,
            followsCount: 0,
            mediaCount: 0,
            tweetCount: 0,
            videoCount: 0
          }
        : link
    );
    setSocialLinks(updatedLinks);
    await updateLinkedAccounts(updatedLinks);
  };

  const handleComplete = async (skip: boolean = false) => {
    try {
      const user = await authApi.getCurrentUser();
      const userId = user?._id || user?.id;
      
      if (!userId) {
        console.error('No valid user ID found');
        navigate('/login');
        return;
      }

      // Mark SNS setup as completed
      await authApi.completeSnsSetup();
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete SNS setup:', error);
    }
  };

  const activeLinks = socialLinks.filter(link => link.isConnected);

  const renderSocialLink = (link: SocialLink) => {
    return (
      <div key={link.platform} className="social-link-card">
        <div className="profile-header">
          {link.profilePictureUrl && (
            <img src={link.profilePictureUrl} alt={`${link.platform} profile`} className="profile-picture" />
          )}
          <div className="profile-info">
            <h3>{link.username || link.platform}</h3>
            {link.isVerified && <span className="verified-badge">✓</span>}
            {link.bio && <p className="bio">{link.bio}</p>}
          </div>
        </div>
        
        {link.isConnected && (
          <div className="stats-container">
            <div className="stat">
              <span className="stat-value">{link.followersCount?.toLocaleString()}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{link.followsCount?.toLocaleString()}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat">
              <span className="stat-value">{link.videoCount?.toLocaleString()}</span>
              <span className="stat-label">Videos</span>
            </div>
            {link.likesCount !== undefined && (
              <div className="stat">
                <span className="stat-value">{link.likesCount.toLocaleString()}</span>
                <span className="stat-label">Likes</span>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => handleOAuthConnect(link.platform)}
          className={`connect-button ${link.isConnected ? 'connected' : ''}`}
          disabled={isProcessing}
        >
          {link.isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>
    );
  };

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
          <SkipButton onClick={() => handleComplete(true)}>건너뛰기</SkipButton>
          <NextButton onClick={() => handleComplete(false)}>다음</NextButton>
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
                {link.platform === 'Tiktok' && link.followersCount !== undefined && (
                  <PreviewStats>
                    <StatItem>
                      <StatValue>{formatCount(link.videoCount || 0)}</StatValue>
                      <StatLabel>영상</StatLabel>
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