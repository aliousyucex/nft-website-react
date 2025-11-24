import {Flex, message} from 'antd';
import {AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import {useEffect, useState } from 'react';
import styled from 'styled-components';
import PlayerInfo from '../components/PlayerInfo';
import type {Player} from '../types';

interface GameRoomProps {
  roomId: string;
  betAmount: number;
  players: Player[];
  currentUserAddress: string;
  isSinglePlayer?: boolean; // Single player mode with AI opponent
  onReady: () => void;
  onNotReady: () => void;
  onLeave: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({
  roomId,
  betAmount,
  players,
  currentUserAddress,
  isSinglePlayer = false,
  onReady,
  onNotReady,
  onLeave,
}) => {
  const [aiName, setAiName] = useState('');

  // Defensive check for players
  const playersList = players || [];

  // Case-insensitive address comparison
  const currentPlayer = playersList.find(
    (p) => p.address.toLowerCase() === currentUserAddress.toLowerCase()
  );
  const opponent = playersList.find(
    (p) => p.address.toLowerCase() !== currentUserAddress.toLowerCase()
  );
  const bothReady = playersList.every((p) => p.ready);

  // For single player: Don't wait for opponent (AI will be added automatically)
  const waitingForOpponent = isSinglePlayer ? false : playersList.length < 2;

  // In single player mode, we always have an AI opponent
  const isAIOpponent = isSinglePlayer;

  // Use backend ready state instead of local state
  const isReady = currentPlayer?.ready || false;

  // Debug logs - Log whenever players prop changes
  useEffect(() => {
    console.log('🎮 GameRoom Players Updated:', {
      isSinglePlayer,
      rawPlayersCount: players?.length,
      playersList,
      currentUserAddress,
      currentPlayer,
      opponent,
      isReady,
      waitingForOpponent,
      isAIOpponent,
    });
  }, [players, isSinglePlayer]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    message.success('Room ID copied to clipboard!');
  };

  const shareLink = () => {
    const url = `${window.location.origin}/game/${roomId}`;
    navigator.clipboard.writeText(url);
    message.success('Share link copied to clipboard!');
  };

  const handleReady = () => {
    if (currentPlayer?.ready) {
      onNotReady();
      return;
    }
    onReady();
  };

  const getRandomAIName = (): string => {
    const AI_NAMES = ['Satoshi', 'Vitalik', 'CZ', 'Hayden', 'Brian', 'Andre', 'Do Kwon', 'SBF'];

    return AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
  };

  useEffect(() => {
    setAiName(getRandomAIName());
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <Header>
          <Flex gap={10}>
            <BackButton onClick={onLeave}>
              <BackIcon>←</BackIcon>
              Leave Room
            </BackButton>

            <BetInfo>
              <BetLabel>Bet:</BetLabel>
              <BetAmount>{betAmount === 0 ? 'Free' : `${betAmount} MON`}</BetAmount>
            </BetInfo>
          </Flex>

          <RoomInfo>
            <RoomIdContainer>
              <RoomId onClick={copyRoomId}>
                {roomId}
              </RoomId>
            </RoomIdContainer>
            <ShareButton onClick={shareLink}>
              <ShareIcon>🔗</ShareIcon>
              Share
            </ShareButton>
            
          </RoomInfo>

        </Header>

        <GameArea>
          <AnimatePresence mode='wait'>
            {waitingForOpponent ? (
              <WaitingState key='waiting'>
                <WaitingIcon>⏳</WaitingIcon>
                <WaitingTitle
                  as={motion.h2}
                  initial={{y: 20, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: 0.2}}
                >
                  Waiting for opponent...
                </WaitingTitle>
                <WaitingText
                  as={motion.p}
                  initial={{y: 20, opacity: 0}}
                  animate={{y: 0, opacity: 1}}
                  transition={{delay: 0.3}}
                >
                  Share the room ID or link with your friend
                </WaitingText>

                <ShareOptions
                  as={motion.div}
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.4}}
                >
                  <ShareOptionButton onClick={copyRoomId}>📋 Room ID</ShareOptionButton>
                  <ShareOptionButton onClick={shareLink}>🔗 Share Link</ShareOptionButton>
                </ShareOptions>

                <LoadingDots>
                  <Dot
                    as={motion.div}
                    $delay={0}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0,
                    }}
                  />
                  <Dot
                    as={motion.div}
                    $delay={0.2}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  />
                  <Dot
                    as={motion.div}
                    $delay={0.4}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                  />
                </LoadingDots>
              </WaitingState>
            ) : (
              <Flex vertical align='center' justify='center' gap={20}>
                <PlayersContainer key='players'>
                  {/* Current Player */}
                  <PlayerSection>
                    <PlayerLabel>You</PlayerLabel>
                    {currentPlayer && <PlayerInfo player={currentPlayer} />}
                  </PlayerSection>

                  {/* VS Indicator */}
                  <VSContainer>
                    <VSText>VS</VSText>
                    <VSIcon>⚔️</VSIcon>
                  </VSContainer>

                  {/* Opponent */}
                  <PlayerSection>
                    <PlayerLabel>Opponent</PlayerLabel>
                    {isAIOpponent ? (
                      <PlayerInfo
                        player={{
                          address: `${aiName}`,
                          ready: true,
                          roundsWon: 0,
                          handSize: 0,
                          isConnected: true,
                          selectedCard: false,
                        }}
                      />
                    ) : (
                      opponent && <PlayerInfo player={opponent} />
                    )}
                  </PlayerSection>
                </PlayersContainer>
                <AnimatePresence mode='wait'>
                  {isAIOpponent ? (
                    // Single Player - Show "Start" button
                    <StartButton key='start-button' onClick={handleReady}>
                      🎮 Start Game
                    </StartButton>
                  ) : !isReady ? (
                    // Multiplayer - Show "Ready" button
                    <ReadyButton key='ready-button' onClick={handleReady}>
                      Ready!
                    </ReadyButton>
                  ) : (
                    // Multiplayer - Show "Not Ready" button
                    <NotReadyButton key='not-ready-button' onClick={handleReady}>
                      Not Ready!
                    </NotReadyButton>
                  )}
                </AnimatePresence>
              </Flex>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {bothReady && (
              <GameStartingOverlay
                as={motion.div}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
              >
                <StartingText
                  as={motion.div}
                  initial={{scale: 0, y: -50}}
                  animate={{scale: 1, y: 0}}
                  transition={{type: 'spring', stiffness: 200, damping: 15}}
                >
                  Game Starting...
                </StartingText>
                <StartingIcon
                  as={motion.div}
                  animate={{rotate: 360}}
                  transition={{duration: 2, repeat: Infinity, ease: 'linear'}}
                >
                  🎴
                </StartingIcon>
                <Countdown
                  as={motion.div}
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{delay: 0.5}}
                >
                  Get Ready!
                </Countdown>
              </GameStartingOverlay>
            )}
          </AnimatePresence>
        </GameArea>
      </Content>
    </Container>
  );
};

export default GameRoom;

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>');
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const BackIcon = styled.span`
  font-size: 20px;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const RoomIdContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RoomId = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const BetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BetLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const BetAmount = styled.span`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(52, 152, 219, 0.4);
  }
`;

const ShareIcon = styled.span`
  font-size: 20px;
`;

const GameArea = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const WaitingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
`;

const WaitingIcon = styled.div`
  font-size: 80px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const WaitingTitle = styled.h2`
  font-size: 32px;
  color: white;
  margin: 0;
`;

const WaitingText = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const ShareOptions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const ShareOptionButton = styled.button`
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Dot = styled.div<{$delay: number}>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
`;

const PlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const PlayerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const PlayerLabel = styled.div`
  font-size: 20px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ReadyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.4);

  &:hover {
    box-shadow: 0 8px 24px rgba(46, 204, 113, 0.6);
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.4);

  &:hover {
    box-shadow: 0 8px 24px rgba(78, 205, 196, 0.6);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NotReadyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 40px;
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);

  &:hover {
    box-shadow: 0 8px 24px rgba(231, 76, 60, 0.6);
  }
`;

const VSContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VSText = styled.div`
  font-size: 48px;
  color: white;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const VSIcon = styled.div`
  font-size: 40px;
`;

const GameStartingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 10;
`;

const StartingText = styled.div`
  font-size: 40px;
  color: white;
  font-weight: bold;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StartingIcon = styled.div`
  font-size: 80px;
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Countdown = styled.div`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
`;
