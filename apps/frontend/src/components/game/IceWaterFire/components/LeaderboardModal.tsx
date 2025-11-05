import {Modal, Spin} from 'antd';
import type React from 'react';
import {useEffect, useState } from 'react';
import styled from 'styled-components';

interface PlayerStats {
  address: string;
  totalPoints: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  rank?: number;
}

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
}

// Format address to show first 5 and last 3 characters
const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
};

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({visible, onClose}) => {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      fetchLeaderboard();
    }
  }, [visible]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${VITE_API_URL}/api/leaderboard`);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setPlayers(data.data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      title={null}
      closable={true}
    >
      <Container>
        <Header>
          <Title>Leaderboard</Title>
        </Header>

        {loading && (
          <LoadingContainer>
            <Spin size='large' />
            <LoadingText>Loading leaderboard...</LoadingText>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{error}</ErrorText>
            <RetryButton onClick={fetchLeaderboard}>Try Again</RetryButton>
          </ErrorContainer>
        )}

        {!loading && !error && players.length === 0 && (
          <EmptyContainer>
            <EmptyIcon>🎮</EmptyIcon>
            <EmptyText>No players yet</EmptyText>
            <EmptySubtext>Be the first to play!</EmptySubtext>
          </EmptyContainer>
        )}

        {!loading && !error && players.length > 0 && (
          <PlayersContainer>
            <TableHeader>
              <RankHeader>Rank</RankHeader>
              <PlayerHeader>Player</PlayerHeader>
              <StatsHeader>W / L</StatsHeader>
              <PointsHeader>Points</PointsHeader>
            </TableHeader>

            <PlayersList>
              {players.map((player, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;

                return (
                  <PlayerRow key={player.address} $isTop3={isTop3}>
                    <RankCell $isTop3={isTop3}>
                      {rank === 1 && '🥇'}
                      {rank === 2 && '🥈'}
                      {rank === 3 && '🥉'}
                      {rank > 3 && `#${rank}`}
                    </RankCell>

                    <PlayerCell>
                      <PlayerAddress>{formatAddress(player.address)}</PlayerAddress>
                      <PlayerGames>{player.totalGames} games</PlayerGames>
                    </PlayerCell>

                    <StatsCell>
                      <WinStat>{player.wins}</WinStat>
                      <span>/</span>
                      <LoseStat>{player.losses}</LoseStat>
                    </StatsCell>

                    <PointsCell $isTop3={isTop3}>{player.totalPoints}</PointsCell>
                  </PlayerRow>
                );
              })}
            </PlayersList>
          </PlayersContainer>
        )}

        <Footer>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </Footer>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 32px;
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
`;

const RetryButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Bakbak One', sans-serif;
`;

const RankHeader = styled.div``;
const PlayerHeader = styled.div``;
const StatsHeader = styled.div`
  text-align: center;
`;
const PointsHeader = styled.div`
  text-align: right;
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const PlayerRow = styled.div<{$isTop3: boolean}>`
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  gap: 12px;
  padding: 12px 16px;
  background: ${(props) => (props.$isTop3 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)' : 'rgba(0, 0, 0, 0.02)')};
  border-radius: 8px;
  transition: all 0.2s ease;
  border: ${(props) => (props.$isTop3 ? '1px solid rgba(255, 193, 7, 0.3)' : '1px solid transparent')};

  &:hover {
    background: ${(props) => (props.$isTop3 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)' : 'rgba(0, 0, 0, 0.05)')};
    transform: translateX(4px);
  }
`;

const RankCell = styled.div<{$isTop3: boolean}>`
  font-size: ${(props) => (props.$isTop3 ? '24px' : '16px')};
  font-weight: bold;
  color: ${(props) => (props.$isTop3 ? '#FFC107' : 'rgba(0, 0, 0, 0.65)')};
  display: flex;
  align-items: center;
`;

const PlayerCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
`;

const PlayerAddress = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  font-family: 'Bakbak One', sans-serif;
`;

const PlayerGames = styled.div`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  font-family: 'Bakbak One', sans-serif;
  font-weight: 300;
`;

const StatsCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`;

const WinStat = styled.span`
  color: #2ECC71;
`;

const LoseStat = styled.span`
  color: #E74C3C;
`;

const PointsCell = styled.div<{$isTop3: boolean}>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: ${(props) => (props.$isTop3 ? '18px' : '16px')};
  font-weight: bold;
  color: #292826;
  font-family: 'Bakbak One', sans-serif;
  font-weight: 300;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;
