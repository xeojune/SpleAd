import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProfileHeader from '../../components/profile/ProfileHeader';
import AccountSetting from '../../components/profile/AccountSetting';
import { authApi } from '../../apis/masterAuth';
import { useNavigate } from 'react-router';
import PrivacySetting from '../../components/profile/PrivacySetting';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ContentDivider = styled.div`
  height: 0.5rem;
  background-color: #f1f5f9;
  margin: 2rem 0;
`;

interface UserData {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (!user?.name || !user?.email) {
          navigate('/login');
          return;
        }
        setUserData({
          name: user.name,
          email: user.email
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <ProfileHeader name={userData.name} email={userData.email} />
      <ContentDivider />
      <AccountSetting />
      <ContentDivider />
      <PrivacySetting />
    </PageContainer>
  );
};

export default ProfilePage;