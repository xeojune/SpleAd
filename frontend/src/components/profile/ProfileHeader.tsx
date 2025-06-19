import React from 'react';
import {
  HeaderContainer,
  Title,
  WelcomeText,
  EmailText,
  HighlightedName
} from '../../styles/profile/ProfileHeader.styles';

interface ProfileHeaderProps {
  name: string;
  email: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, email }) => {
  return (
    <HeaderContainer>
      <Title>マイページ</Title>
      <WelcomeText>
        こんにちは、<br />
        <HighlightedName>{name}</HighlightedName>さん
      </WelcomeText>
      <EmailText>{email}</EmailText>
    </HeaderContainer>
  );
};

export default ProfileHeader;