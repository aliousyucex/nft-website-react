import React from 'react';
import styled from 'styled-components';
import { Player } from '../types';

interface PlayerInfoProps {
  player: Player;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <InfoContainer>
      <PlayerHeader>
        <StatusIndicator $isConnected={player.isConnected} />
        <AddressText>{formatAddress(player.address)}</AddressText>
        {player.ready && <ReadyBadge>READY</ReadyBadge>}
      </PlayerHeader>

      <StatsRow>
        <StatItem>
          <StatLabel>Score</StatLabel>
          <StatValue>{player.roundsWon}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Cards</StatLabel>
          <StatValue>{player.handSize}</StatValue>
        </StatItem>
        {player.selectedCard && (
          <StatItem>
            <SelectedIndicator>✓ Selected</SelectedIndicator>
          </StatItem>
        )}
      </StatsRow>
    </InfoContainer>
  );
};

export default PlayerInfo;

const InfoContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 280px;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatusIndicator = styled.div<{ $isConnected: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.$isConnected ? '#2ECC71' : '#E74C3C')};
  box-shadow: 0 0 8px ${(props) => (props.$isConnected ? '#2ECC71' : '#E74C3C')};
  animation: ${(props) => (props.$isConnected ? 'pulse 2s infinite' : 'none')};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const AddressText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: white;
  font-family: 'Courier New', monospace;
`;

const ReadyBadge = styled.span`
  background: #2ECC71;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-left: auto;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const StatValue = styled.span`
  font-size: 28px;
  font-weight: bold;
  color: white;
`;

const SelectedIndicator = styled.span`
  background: #3498DB;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  animation: glow 1.5s ease-in-out infinite;

  @keyframes glow {
    0%,
    100% {
      box-shadow: 0 0 10px #3498DB;
    }
    50% {
      box-shadow: 0 0 20px #3498DB;
    }
  }
`;

