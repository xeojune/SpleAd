import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ButtonPanelContainer, NavButton } from '../../styles/dashboard/ButtonPanel.styles';
import HomeIcon from '../icons/HomeIcon';
import CampaignIcon from '../icons/CampaignIcon';
import SearchIcon from '../icons/SearchIcon';
import ProfileIcon from '../icons/ProfileIcon';

const ButtonPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isDashboard = isActive('/dashboard');
  const isCampaign = isActive('/dashboard/campaign');
  const isSearch = isActive('/dashboard/search');
  const isProfile = isActive('/dashboard/profile');

  return (
    <ButtonPanelContainer>
      <NavButton active={isDashboard} onClick={() => navigate('/dashboard')} aria-label="Home">
        <HomeIcon width="2.1875rem" height="2.1875rem" active={isDashboard} />
        <p>ホーム</p>
      </NavButton>
      <NavButton active={isCampaign} onClick={() => navigate('/dashboard/campaign')} aria-label="Campaign">
        <CampaignIcon width="2.1875rem" height="2.1875rem" active={isCampaign} />
        <p>キャンペーン</p>
      </NavButton>
      <NavButton active={isSearch} onClick={() => navigate('/dashboard/search')} aria-label="Search">
        <SearchIcon width="2.1875rem" height="2.1875rem" active={isSearch} />
        <p>検索</p>
      </NavButton>
      <NavButton active={isProfile} onClick={() => navigate('/dashboard/profile')} aria-label="Profile">
        <ProfileIcon width="2.1875rem" height="2.1875rem" active={isProfile} />
        <p>プロフィール</p>
      </NavButton>
    </ButtonPanelContainer>
  );
};

export default ButtonPanel;