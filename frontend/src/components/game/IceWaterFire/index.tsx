import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SocketProvider, useSocket } from './context/SocketContext';
import GameLobby from './pages/GameLobby';
import GameRoom from './pages/GameRoom';
import GameBoard from './pages/GameBoard';
import { useGame } from './hooks/useGame';
import { useSoundEffects } from './hooks/useSoundEffects';
import { Card } from './types';
import { message } from 'antd';
import WalletConnect from '../../wallet/WalletConnect';
import { GameModeModal } from './components/GameModeModal';
import logger from './utils/logger';

interface IceWaterFireGameProps {
  onDisconnect?: () => void;
}

type GamePage = 'lobby' | 'room' | 'playing';

const IceWaterFireGame: React.FC<IceWaterFireGameProps> = ({ onDisconnect }) => {
  const { address, isConnected } = useAccount();
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [guestAddress, setGuestAddress] = useState('');
  const [pendingGameMode, setPendingGameMode] = useState<'single' | 'multi' | null>(null);

  // Generate guest address if playing without wallet
  useEffect(() => {
    if (guestMode && !guestAddress) {
      // Generate temporary guest address in valid Ethereum format (0x + 40 hex chars)
      // Use timestamp + random hex to create unique address
      const timestamp = Date.now().toString(16).padStart(12, '0'); // 12 hex chars
      const random = Math.random().toString(16).substring(2, 30).padEnd(28, '0'); // 28 hex chars
      const tempAddress = `0x${timestamp}${random}`;
      console.log('🎮 Generated guest address:', tempAddress);
      setGuestAddress(tempAddress);
    }
  }, [guestMode, guestAddress]);

  // If not connected and not in guest mode, show entry choice
  if (!isConnected && !guestMode) {
    return (
      <WalletPromptContainer>
        <WalletPromptContent
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WalletIcon
            as={motion.div}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🎴
          </WalletIcon>
          <WalletTitle>Ice Water Fire</WalletTitle>
          <WalletSubtitle>
            Choose how you want to play
          </WalletSubtitle>
          
          <ChoiceButtons>
            <ChoiceButton
              as={motion.button}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGameModeModal(true)}
              $primary
            >
              <ButtonIcon>🎮</ButtonIcon>
              <ButtonText>
                <ButtonTitle>Play Right Away</ButtonTitle>
                <ButtonSubtitle>Free practice games</ButtonSubtitle>
              </ButtonText>
            </ChoiceButton>

            <ChoiceButton
              as={motion.button}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              $secondary
            >
              <ButtonIcon>💰</ButtonIcon>
              <ButtonText>
                <ButtonTitle>Connect Wallet</ButtonTitle>
                <ButtonSubtitle>Play for ETH & leaderboard</ButtonSubtitle>
              </ButtonText>
              <WalletConnectWrapper>
                <WalletConnect />
              </WalletConnectWrapper>
            </ChoiceButton>
          </ChoiceButtons>
        </WalletPromptContent>

        <GameModeModal
          visible={showGameModeModal}
          onSinglePlayer={() => {
            console.log('🎮 Modal: Single Player selected, activating guest mode');
            setPendingGameMode('single');
            setGuestMode(true);
            setShowGameModeModal(false);
          }}
          onMultiplayer={() => {
            console.log('👥 Modal: Multiplayer selected, activating guest mode');
            setPendingGameMode('multi');
            setGuestMode(true);
            setShowGameModeModal(false);
          }}
          onCancel={() => setShowGameModeModal(false)}
        />
      </WalletPromptContainer>
    );
  }

  const userAddress = address || guestAddress;

  return (
    <SocketProvider address={userAddress}>
      <GameContainer 
        userAddress={userAddress} 
        onDisconnect={onDisconnect}
        isGuest={guestMode}
        pendingGameMode={pendingGameMode}
        onGameModeHandled={() => setPendingGameMode(null)}
      />
    </SocketProvider>
  );
};

interface GameContainerProps {
  userAddress: string;
  onDisconnect?: () => void;
  isGuest?: boolean;
  pendingGameMode?: 'single' | 'multi' | null;
  onGameModeHandled?: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ userAddress, isGuest, pendingGameMode, onGameModeHandled }) => {
  const { roomId: roomIdFromUrl } = useParams<{ roomId: string }>();
  const [currentPage, setCurrentPage] = useState<GamePage>('lobby');
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [balance, setBalance] = useState<string>('0');
  const [waitingForAnimations, setWaitingForAnimations] = useState(false);

  const {
    availableRooms,
    currentRoom,
    gameState,
    loading,
    error,
    receivedEmoji,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    setReady,
    setNotReady,
    selectCard,
    sendEmoji,
    clearAnimations,
  } = useGame(userAddress);

  const { socket } = useSocket();
  const { playSound, soundsEnabled, volume, setVolume, toggleSounds } = useSoundEffects();

  // Handle pending game mode (auto-create room for guest users)
  useEffect(() => {
    if (!pendingGameMode || !isGuest) return;
    
    console.log('📋 Pending game mode detected:', pendingGameMode);
    console.log('🔌 Socket status:', socket ? 'connected' : 'not connected');
    console.log('👤 User address:', userAddress);

    if (!socket || !userAddress) {
      console.log('⏳ Waiting for socket connection and address...');
      return;
    }

    logger.info('✅ All conditions met, handling pending game mode', { 
      pendingGameMode, 
      userAddress,
      socketId: socket.id 
    });
    
    // Wait a bit for socket to be fully initialized
    const timer = setTimeout(() => {
      console.log('🚀 Creating/joining room...');
      
      if (pendingGameMode === 'single') {
        // Create single player room
        logger.info('Creating single player room');
        createRoom(0, undefined, 'single_player', true);
      } else if (pendingGameMode === 'multi') {
        // Quick join free multiplayer room
        logger.info('Quick joining free multiplayer room');
        quickJoin(0, false);
      }
      
      // Clear pending mode after handling
      if (onGameModeHandled) {
        onGameModeHandled();
      }
    }, 1000); // Increased delay to ensure socket is ready

    return () => clearTimeout(timer);
  }, [pendingGameMode, isGuest, socket, userAddress, createRoom, quickJoin, onGameModeHandled]);

  // Handle auto-join via share link (URL parameter)
  useEffect(() => {
    if (!roomIdFromUrl || !socket || !userAddress) return;
    
    // Check if we're already in a room or have a pending game mode
    if (currentRoom || pendingGameMode) return;
    
    logger.info('Auto-joining room from URL', { roomId: roomIdFromUrl });
    
    // Wait a bit for socket to be fully initialized
    const timer = setTimeout(() => {
      console.log('🔗 Joining room from share link:', roomIdFromUrl);
      joinRoom(roomIdFromUrl);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roomIdFromUrl, socket, userAddress, currentRoom, pendingGameMode, joinRoom]);

  // Fetch balance periodically (skip for guest users)
  useEffect(() => {
    if (!userAddress || isGuest) {
      console.log('⚠️ Guest mode or no userAddress, skipping balance fetch');
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/contract/balance/${userAddress}`);
        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance || '0');
        } else {
          console.error('❌ Balance fetch failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error fetching balance:', error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [userAddress, isGuest]);

  // Timer countdown - synced with backend timestamp
  useEffect(() => {
    // Timer continues running even after player selects to show opponent's remaining time
    // Removed waitingForAnimations check to keep timer running during round result animations
    if (currentPage === 'playing' && gameState &&
        gameState.myScore < 3 && gameState.opponentScore < 3 &&
        gameState.roundStartTime && gameState.timeLimit) {
      
      logger.timer('Starting timer sync', {
        roundStartTime: gameState.roundStartTime,
        timeLimit: gameState.timeLimit,
        currentTime: Date.now(),
        hasSelected: !!gameState.selectedCard
      });
      
      // Calculate time based on server timestamp
      const calculateTimeRemaining = () => {
        const elapsed = (Date.now() - gameState.roundStartTime!) / 1000; // Convert to seconds
        const remaining = Math.max(0, Math.ceil(gameState.timeLimit! - elapsed));
        return remaining;
      };

      // Update immediately
      const initialTime = calculateTimeRemaining();
      setTimeRemaining(initialTime);
      logger.timer('Timer initialized', { initialTime, hasSelected: !!gameState.selectedCard });

      // Track last warning to avoid spamming
      let hasPlayedWarning = false;

      // Then update every 100ms for smooth countdown
      const timer = setInterval(() => {
        const newTime = calculateTimeRemaining();
        
        if (newTime <= 0) {
          logger.warn('Time expired (synced with backend)');
          clearInterval(timer);
          setTimeRemaining(0);
          return;
        }
        
        // Play warning sound at 3 seconds (only if player hasn't selected yet)
        if (newTime <= 3 && !hasPlayedWarning && !gameState.selectedCard) {
          logger.timer('Low time warning', { remaining: newTime });
          playSound('timerWarning');
          hasPlayedWarning = true;
        }
        
        setTimeRemaining(newTime);
      }, 100); // Update every 100ms for smooth countdown

      return () => {
        clearInterval(timer);
        logger.timer('Timer cleanup');
      };
    }
  }, [currentPage, gameState?.roundStartTime, gameState?.timeLimit, 
      gameState?.myScore, gameState?.opponentScore, playSound, gameState?.selectedCard]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Handle room changes (when user joins/creates a room)
  useEffect(() => {
    if (currentRoom && currentPage === 'lobby') {
      playSound('roomJoin');
      setCurrentPage('room');
    } else if (!currentRoom && currentPage === 'room') {
      // Room was left or destroyed
      logger.ui('Navigating back to lobby');
      setCurrentPage('lobby');
    }
  }, [currentRoom, currentPage, playSound]);

  // Handle game state changes
  useEffect(() => {
    if (gameState) {
      if (gameState.gameState === 'waiting') {
        setCurrentPage('room');
      } else if (gameState.gameState === 'playing') {
        setCurrentPage('playing');
      } else if (gameState.gameState === 'finished') {
        // Game finished - stay on playing page, modal will show there
        // Play win/lose/draw sound immediately
        const isWinner = gameState.winner?.toLowerCase() === userAddress.toLowerCase();
        const isDraw = !gameState.winner;
        
        if (isDraw) {
          playSound('gameLose'); // or add a draw sound
        } else {
          playSound(isWinner ? 'gameWin' : 'gameLose');
        }
      }
    }
  }, [gameState?.gameState, userAddress, playSound]);

  const handleLeaveRoom = () => {
    leaveRoom();
    setCurrentPage('lobby');
  };

  const handleReturnToLobby = () => {
    // Clear all game-related states
    setWaitingForAnimations(false);
    clearAnimations();
    setTimeRemaining(10);

    // Leave room and navigate to lobby
    leaveRoom();
    setCurrentPage('lobby');
  };

  const handleCardSelect = (card: Card) => {
    // Prevent card selection if game is over
    if (gameState && (gameState.myScore >= 3 || gameState.opponentScore >= 3)) {
      logger.warn('Game is over, cannot select card');
      return;
    }
    
    logger.game('Card selected', { cardId: card.id });
    playSound('cardSelect');
    selectCard(card);
  };

  // Round results are now handled by CardReveal component in GameBoard

  // Build player objects from game state
  const myPlayer = {
    address: userAddress,
    ready: false,
    roundsWon: gameState?.myScore || 0,
    handSize: gameState?.myCards?.length || 0,
    isConnected: true,
    selectedCard: !!gameState?.selectedCard,
  };

  const opponentPlayer = {
    address: currentRoom?.players?.find((p: any) => p.address.toLowerCase() !== userAddress.toLowerCase())?.address || '0x0000000000000000000000000000000000000000',
    ready: false,
    roundsWon: gameState?.opponentScore || 0,
    handSize: 0, // We don't show opponent's hand
    isConnected: true,
    selectedCard: !!gameState?.opponentSelected,
  };

  // Debug logging for player scores
  useEffect(() => {
    if (gameState && currentPage === 'playing') {
      console.log('🎮 Player Scores Update:', {
        gameStateMyScore: gameState.myScore,
        gameStateOpponentScore: gameState.opponentScore,
        currentRound: gameState.currentRound,
        myPlayerRoundsWon: myPlayer.roundsWon,
        opponentPlayerRoundsWon: opponentPlayer.roundsWon,
        gameState: gameState.gameState,
      });
    } else if (gameState && gameState.gameState === 'finished') {
      console.log('🏁 Game Finished - Final Scores:', {
        gameStateMyScore: gameState.myScore,
        gameStateOpponentScore: gameState.opponentScore,
        winner: gameState.winner,
        finalScores: gameState.finalScores,
        prizeAmount: gameState.prizeAmount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.myScore, gameState?.opponentScore, gameState?.currentRound, gameState?.gameState, currentPage]);

  const mockCards: Card[] = [
    { id: 'fire_3', type: 'fire', value: 3 },
    { id: 'fire_5', type: 'fire', value: 5 },
    { id: 'ice_3', type: 'ice', value: 3 },
    { id: 'water_5', type: 'water', value: 5 },
    { id: 'ice_7', type: 'ice', value: 7 },
  ];

  return (
    <>
      {currentPage === 'lobby' && (
        <GameLobby
          availableRooms={availableRooms}
          loading={loading}
          balance={balance}
          createRoom={createRoom}
          joinRoom={joinRoom}
          quickJoin={quickJoin}
          soundsEnabled={soundsEnabled}
          volume={volume}
          onToggleSounds={toggleSounds}
          onVolumeChange={setVolume}
        />
      )}

      {currentPage === 'room' && currentRoom && (
        <GameRoom
          roomId={currentRoom.roomId}
          betAmount={currentRoom.betAmount}
          players={currentRoom.players}
          currentUserAddress={userAddress}
          isSinglePlayer={currentRoom.isSinglePlayer}
          onReady={() => {
            playSound('ready');
            setReady();
          }}
          onNotReady={() => {
            setNotReady();
          }}
          onLeave={handleLeaveRoom}
        />
      )}

      {currentPage === 'playing' && gameState && (
        <GameBoard
          betAmount={currentRoom?.betAmount || 0}
          myCards={gameState.myCards || mockCards}
          myPlayer={myPlayer}
          opponentPlayer={opponentPlayer}
          selectedCard={gameState.selectedCard}
          opponentSelected={gameState.opponentSelected}
          currentRound={gameState.currentRound || 0}
          timeRemaining={timeRemaining}
          lastRoundResult={gameState.lastRoundResult}
          roundHistory={gameState.roundHistory || []}
          receivedEmoji={receivedEmoji?.emoji || null}
          gameState={gameState}
          currentUserAddress={userAddress}
          onCardSelect={handleCardSelect}
          onSendEmoji={sendEmoji}
          onRoundResultComplete={() => {
            logger.ui('Round result animation complete, ready for next round');
          }}
          onCardReveal={() => playSound('cardReveal')}
          onRoundResult={(result) => {
            if (result === 'win') playSound('roundWin');
            else if (result === 'lose') playSound('roundLose');
            else if (result === 'draw') playSound('roundDraw');
          }}
          onReturnToLobby={handleReturnToLobby}
          isPaidGame={gameState.isPaidGame ?? (currentRoom?.betAmount !== 0)}
          isSinglePlayer={currentRoom?.isSinglePlayer ?? false}
        />
      )}
    </>
  );
};

export default IceWaterFireGame;

const WalletPromptContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const WalletPromptContent = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const WalletIcon = styled.div`
  font-size: 80px;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

const WalletTitle = styled.h1`
  font-size: 36px;
  color: white;
  margin: 0;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const WalletSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  line-height: 1.6;
`;

const ChoiceButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

const ChoiceButton = styled.button<{ $primary?: boolean; $secondary?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 32px;
  background: ${props => 
    props.$primary 
      ? 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
      : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  };
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px ${props =>
    props.$primary
      ? 'rgba(78, 205, 196, 0.4)'
      : 'rgba(255, 215, 0, 0.4)'
  };
  overflow: hidden;

  &:hover {
    box-shadow: 0 12px 32px ${props =>
      props.$primary
        ? 'rgba(78, 205, 196, 0.6)'
        : 'rgba(255, 215, 0, 0.6)'
    };
  }
`;

const ButtonIcon = styled.div`
  font-size: 48px;
  flex-shrink: 0;
`;

const ButtonText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
`;

const ButtonTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ButtonSubtitle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const WalletConnectWrapper = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  
  button {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: all;
  }
`;

