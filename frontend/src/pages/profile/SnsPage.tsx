import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import SnsCard from '../../components/profile/Sns/SnsCard';
import SnsModal from '../../components/profile/Sns/SnsModal';
import ArrowIcon from '../../components/icons/ArrowIcon';
import { authApi, updateUserLinkedAccounts } from '../../apis/masterAuth';
import { getInstagramAuthUrl, exchangeCodeForToken } from '../../apis/instagramAuth';
import { XAuth } from '../../apis/xAuth';
import { TikTokAuth } from '../../apis/tiktokAuth';

// Import SNS logos
import instagramLogo from '../../assets/instagram.png';
import tiktokLogo from '../../assets/tiktok.svg';
import xLogo from '../../assets/X.png';
import lipsLogo from '../../assets/lips.png';
import cosmeLogo from '../../assets/cosme.png';

const PageWrapper = styled.div`
  min-height: 100vh;
  position: relative;
`;

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: #1e293b;
`;

const RotatedArrow = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`;

interface ModalState {
  isOpen: boolean;
  platform: string;
  logo: string;
}

interface LinkedAccount {
  platform: string;
  username: string;
  isConnected: boolean;
  profilePictureUrl?: string;
  followersCount?: number;
  followsCount?: number;
  mediaCount?: number;
  tweetCount?: number;
  videoCount?: number;
}

const SnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    platform: '',
    logo: ''
  });
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateLinkedAccounts = useCallback(async (updatedAccounts: LinkedAccount[]) => {
    try {
      const user = await authApi.getCurrentUser();
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error('No user ID found');
        navigate('/login');
        return;
      }

      await updateUserLinkedAccounts({
        userId,
        linkedAccounts: updatedAccounts
          .filter(account => account.isConnected)
          .map(account => ({
            platform: account.platform,
            username: account.username,
            profilePictureUrl: account.profilePictureUrl || '',
            isConnected: account.isConnected,
            followersCount: account.followersCount || 0,
            followsCount: account.followsCount || 0,
            mediaCount: account.mediaCount,
            tweetCount: account.tweetCount,
            videoCount: account.videoCount,
            lastUpdated: new Date(),
          }))
      });

      // Refresh user data after update
      const updatedUser = await authApi.getCurrentUser();
      if (updatedUser?.linkedAccounts) {
        setLinkedAccounts(updatedUser.linkedAccounts);
      }
    } catch (error) {
      console.error('Failed to update linked accounts:', error);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (user?.linkedAccounts) {
          setLinkedAccounts(user.linkedAccounts);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const state = params.get('state');
      
      if (!code || error) {
        setIsProcessing(false);
        return;
      }

      try {
        const lastAttemptedPlatform = localStorage.getItem('lastAttemptedPlatform');
        if (!lastAttemptedPlatform) return;

        const user = await authApi.getCurrentUser();
        const userId = user?._id || user?.id;
        if (!userId) {
          console.error('No user ID found');
          navigate('/login');
          return;
        }

        let updatedAccount = null;

        if (lastAttemptedPlatform === 'Instagram') {
          const instagramResponse = await exchangeCodeForToken(code, userId);
          updatedAccount = {
            platform: 'Instagram',
            isConnected: true,
            username: instagramResponse?.username || 'Instagram User',
            profilePictureUrl: instagramResponse?.profile_picture_url || '',
            followersCount: instagramResponse?.followers_count || 0,
            followsCount: instagramResponse?.follows_count || 0,
            mediaCount: instagramResponse?.media_count || 0
          };
        } else if (lastAttemptedPlatform === 'Tiktok' && state) {
          const tiktokResponse = await TikTokAuth.handleCallback(code, state, userId);
          const userData = tiktokResponse?.tokenData?.userData || {};
          const stats = userData?.stats || {};
          
          updatedAccount = {
            platform: 'Tiktok',  // Match the platform name used in localStorage
            isConnected: true,
            username: userData?.display_name || 'TikTok User',
            profilePictureUrl: userData?.avatar_url || '',
            followersCount: stats?.follower_count || 0,
            followsCount: stats?.following_count || 0,
            videoCount: stats?.video_count || 0
          };
        }

        if (updatedAccount) {
          const updatedAccounts = linkedAccounts.map(account =>
            account.platform === updatedAccount.platform ? { ...account, ...updatedAccount } : account
          );
          setLinkedAccounts(updatedAccounts);
          await updateLinkedAccounts(updatedAccounts);
        }

        // Clear URL parameters and lastAttemptedPlatform
        window.history.replaceState({}, document.title, window.location.pathname);
        localStorage.removeItem('lastAttemptedPlatform');
      } catch (error) {
        console.error('Failed to process OAuth callback:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [linkedAccounts, navigate, updateLinkedAccounts]);

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
      
      // Store platform name consistently for callback
      const normalizedPlatform = platform === 'TikTok' ? 'Tiktok' : platform;
      localStorage.setItem('lastAttemptedPlatform', normalizedPlatform);
      
      if (platform === 'Instagram') {
        const authUrl = getInstagramAuthUrl(userId);
        window.location.href = authUrl;
      } else if (platform === 'Twitter/X') {
        console.log('🔄 Starting X OAuth flow...');
        await XAuth.initiateLogin(userId);  
      } else if (platform === 'TikTok') {
        console.log('🔄 Starting TikTok OAuth flow...');
        await TikTokAuth.initiateLogin(userId);  
      }
    } catch (error) {
      console.error(`❌ Failed to connect to ${platform}:`, error);
      setIsProcessing(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    const updatedAccounts = linkedAccounts.map(account =>
      account.platform === platform
        ? {
            ...account,
            isConnected: false,
            username: '',
            profilePictureUrl: '',
            followersCount: 0,
            followsCount: 0,
            mediaCount: 0,
            tweetCount: 0,
            videoCount: 0
          }
        : account
    );
    setLinkedAccounts(updatedAccounts);
    await updateLinkedAccounts(updatedAccounts);
  };

  const handleConnect = (platform: string, logo: string, needsId: boolean) => {
    const account = linkedAccounts.find(acc => acc.platform === platform);
    
    if (account?.isConnected) {
      handleDisconnect(platform);
    } else if (needsId) {
      setModalState({
        isOpen: true,
        platform,
        logo
      });
    } else {
      handleOAuthConnect(platform);
    }
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      platform: '',
      logo: ''
    });
  };

  const handleModalSubmit = (id: string) => {
    console.log(`Submitting ID: ${id} for platform: ${modalState.platform}`);
    // Implement ID submission logic here
    handleModalClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate('/profile')}>
            <RotatedArrow>
              <ArrowIcon />
            </RotatedArrow>
          </BackButton>
          <Title>SNSアカウント連携</Title>
        </Header>
        <ContentContainer>
          <SnsCard
            logo={instagramLogo}
            title="Instagram"
            onConnect={() => handleConnect('Instagram', instagramLogo, false)}
            isConnected={linkedAccounts.some(acc => acc.platform === 'Instagram' && acc.isConnected)}
            username={linkedAccounts.find(acc => acc.platform === 'Instagram')?.username}
          />
          <SnsCard
            logo={tiktokLogo}
            title="TikTok"
            onConnect={() => handleConnect('TikTok', tiktokLogo, false)}
            isConnected={linkedAccounts.some(acc => acc.platform === 'Tiktok' && acc.isConnected)}
            username={linkedAccounts.find(acc => acc.platform === 'Tiktok')?.username}
          />
          <SnsCard
            logo={xLogo}
            title="X (旧Twitter)"
            onConnect={() => handleConnect('X (旧Twitter)', xLogo, true)}
            isIdInput
            isConnected={linkedAccounts.some(acc => acc.platform === 'X (旧Twitter)' && acc.isConnected)}
            username={linkedAccounts.find(acc => acc.platform === 'X (旧Twitter)')?.username}
          />
          <SnsCard
            logo={lipsLogo}
            title="LIPS"
            onConnect={() => handleConnect('LIPS', lipsLogo, true)}
            isIdInput
            isConnected={linkedAccounts.some(acc => acc.platform === 'LIPS' && acc.isConnected)}
            username={linkedAccounts.find(acc => acc.platform === 'LIPS')?.username}
          />
          <SnsCard
            logo={cosmeLogo}
            title="@cosme"
            onConnect={() => handleConnect('@cosme', cosmeLogo, true)}
            isIdInput
            isConnected={linkedAccounts.some(acc => acc.platform === '@cosme' && acc.isConnected)}
            username={linkedAccounts.find(acc => acc.platform === '@cosme')?.username}
          />
        </ContentContainer>
      </PageContainer>

      <SnsModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        platform={modalState.platform}
        logo={modalState.logo}
        onSubmit={handleModalSubmit}
      />
    </PageWrapper>
  );
};

export default SnsPage;