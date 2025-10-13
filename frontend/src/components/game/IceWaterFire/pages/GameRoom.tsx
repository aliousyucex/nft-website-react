import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { message } from 'antd';
import PlayerInfo from '../components/PlayerInfo';
import { Player } from '../types';

interface GameRoomProps {
  roomId: string;
  betAmount: number;
  players: Player[];
  currentUserAddress: string;
  onReady: () => void;
  onLeave: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({
  roomId,
  betAmount,
  players,
  currentUserAddress,
  onReady,
  onLeave,
}) => {
  const [copied, setCopied] = useState(false);

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
  const waitingForOpponent = playersList.length < 2;
  
  // Use backend ready state instead of local state
  const isReady = currentPlayer?.ready || false;
  
  // Debug logs - Log whenever players prop changes
  useEffect(() => {
    console.log('🎮 GameRoom Players Updated:', {
      rawPlayersCount: players?.length,
      playersList,
      currentUserAddress,
      currentPlayer,
      opponent,
      isReady,
      waitingForOpponent,
    });
  }, [players]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    message.success('Room ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const url = `${window.location.origin}/game/${roomId}`;
    navigator.clipboard.writeText(url);
    message.success('Share link copied to clipboard!');
  };

  const handleReady = () => {
    onReady();
    message.success('You are ready! Waiting for opponent...');
  };

  useEffect(() => {
    // Only show "Game starting" if both ready AND we have 2 players
    if (bothReady && !waitingForOpponent) {
      message.info('Game starting in 3 seconds...');
    }
  }, [bothReady, waitingForOpponent]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Container
      as={motion.div}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Background />

      <Content
        as={motion.div}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Header
          as={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BackButton
            as={motion.button}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLeave}
          >
            <BackIcon>←</BackIcon>
            Leave Room
          </BackButton>

          <RoomInfo
            as={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <RoomIdContainer>
              <RoomIdLabel>Room ID:</RoomIdLabel>
              <RoomId
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyRoomId}
              >
                {roomId}
                {copied ? ' ✓' : ' 📋'}
              </RoomId>
            </RoomIdContainer>
            <BetInfo>
              <BetLabel>Bet:</BetLabel>
              <BetAmount
                as={motion.span}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {betAmount} ETH
              </BetAmount>
            </BetInfo>
          </RoomInfo>

          <ShareButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareLink}
          >
            <ShareIcon>🔗</ShareIcon>
            Share Link
          </ShareButton>
        </Header>

        <GameArea
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {waitingForOpponent ? (
              <WaitingState
                as={motion.div}
                key="waiting"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <WaitingIcon
                  as={motion.div}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ⏳
                </WaitingIcon>
                <WaitingTitle
                  as={motion.h2}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Waiting for opponent...
                </WaitingTitle>
                <WaitingText
                  as={motion.p}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Share the room ID or link with your friend
                </WaitingText>
                
                <ShareOptions
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ShareOptionButton
                    as={motion.button}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyRoomId}
                  >
                    📋 Copy Room ID
                  </ShareOptionButton>
                  <ShareOptionButton
                    as={motion.button}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareLink}
                  >
                    🔗 Copy Share Link
                  </ShareOptionButton>
                </ShareOptions>

                <LoadingDots>
                  <Dot 
                    as={motion.div}
                    $delay={0}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0
                    }}
                  />
                  <Dot 
                    as={motion.div}
                    $delay={0.2}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0.2
                    }}
                  />
                  <Dot 
                    as={motion.div}
                    $delay={0.4}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                      duration: 1.4,
                      repeat: Infinity,
                      delay: 0.4
                    }}
                  />
                </LoadingDots>
              </WaitingState>
            ) : (
              <PlayersContainer
                as={motion.div}
                key="players"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                {/* Current Player */}
                <PlayerSection
                  as={motion.div}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <PlayerLabel>You</PlayerLabel>
                  {currentPlayer && (
                    <>
                      <PlayerInfo player={currentPlayer} />
                      <AnimatePresence mode="wait">
                        {!isReady ? (
                          <ReadyButton
                            as={motion.button}
                            key="ready-button"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ 
                              scale: 1.1,
                              boxShadow: "0 8px 24px rgba(46, 204, 113, 0.6)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={handleReady}
                          >
                            <ReadyIcon>✓</ReadyIcon>
                            I'm Ready!
                          </ReadyButton>
                        ) : (
                          <ReadyIndicator
                            as={motion.div}
                            key="ready-indicator"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <CheckIcon
                              as={motion.span}
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 1
                              }}
                            >
                              ✓
                            </CheckIcon>
                            Ready!
                          </ReadyIndicator>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </PlayerSection>

                {/* VS Indicator */}
                <VSContainer
                  as={motion.div}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <VSText
                    as={motion.div}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    VS
                  </VSText>
                  <VSIcon
                    as={motion.div}
                    animate={{ 
                      rotate: [0, 20, -20, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ⚔️
                  </VSIcon>
                </VSContainer>

                {/* Opponent */}
                <PlayerSection
                  as={motion.div}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <PlayerLabel>Opponent</PlayerLabel>
                  {opponent && <PlayerInfo player={opponent} />}
                </PlayerSection>
              </PlayersContainer>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {bothReady && (
              <GameStartingOverlay
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StartingText
                  as={motion.div}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  Game Starting...
                </StartingText>
                <StartingIcon
                  as={motion.div}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🎴
                </StartingIcon>
                <Countdown
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
    transform: translateX(-4px);
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

const RoomIdLabel = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
`;

const RoomId = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
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

const Dot = styled.div<{ $delay: number }>`
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
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(46, 204, 113, 0.6);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ReadyIcon = styled.span`
  font-size: 24px;
`;

const ReadyIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: rgba(46, 204, 113, 0.3);
  border: 2px solid #2ECC71;
  border-radius: 12px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(46, 204, 113, 0.4);
    }
    50% {
      box-shadow: 0 0 40px rgba(46, 204, 113, 0.8);
    }
  }
`;

const CheckIcon = styled.span`
  font-size: 24px;
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

const Instructions = styled.div`
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const InstructionTitle = styled.h3`
  font-size: 20px;
  color: white;
  margin-bottom: 16px;
  text-align: center;
`;

const InstructionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InstructionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
`;

const ItemIcon = styled.span`
  font-size: 24px;
`;

