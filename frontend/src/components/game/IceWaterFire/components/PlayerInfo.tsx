import React from 'react';
import styled from 'styled-components';
import { Player } from '../types';

interface PlayerInfoProps {
  player: Player;
}

// Format address to show first 5 and last 3 characters
const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player }) => {
  return (
    <InfoContainer $isReady={player.ready}>
      <PlayerHeader>
        <StatusIndicator $isConnected={player.isConnected} />
        <StatusText>{formatAddress(player.address)}</StatusText>
      </PlayerHeader>
    </InfoContainer>
  );
};

export default PlayerInfo;

const InfoContainer = styled.div<{ $isReady: boolean }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: ${(props) => (props.$isReady ? '#2ECC7188' : 'transparent')};

  @media (max-height: 900px) {
    padding: 10px 16px;
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusIndicator = styled.div<{ $isConnected: boolean }>`
  width: 10px;
  height: 10px;
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

const StatusText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-height: 900px) {
    font-size: 12px;
  }
`;

