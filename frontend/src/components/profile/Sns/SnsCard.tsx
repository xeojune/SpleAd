import React from 'react';
import {
  CardContainer,
  LogoContainer,
  InfoContainer,
  TitleRow,
  Logo,
  Title,
  Username,
  ConnectedTag,
  ConnectButton
} from '../../../styles/profile/Sns/SnsCard.styles';

interface SnsCardProps {
  logo: string;
  title: string;
  onConnect: () => void;
  isIdInput?: boolean;
  isConnected?: boolean;
  username?: string;
}

const SnsCard: React.FC<SnsCardProps> = ({ 
  logo, 
  title, 
  onConnect, 
  isIdInput = false,
  isConnected = false,
  username
}) => {
  return (
    <CardContainer>
      <LogoContainer>
        <Logo src={logo} alt={title} />
        <InfoContainer>
          <TitleRow>
            <Title>{title}</Title>
            {isConnected && <ConnectedTag>連携済み</ConnectedTag>}
          </TitleRow>
          {isConnected && username && (
            <Username>{username}</Username>
          )}
        </InfoContainer>
      </LogoContainer>
      <ConnectButton onClick={onConnect} isConnected={isConnected}>
        {isConnected ? '連携を解除する' : (isIdInput ? 'IDを登録する' : '連携する')}
      </ConnectButton>
    </CardContainer>
  );
};

export default SnsCard;