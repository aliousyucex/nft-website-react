import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import GameLobby from './pages/GameLobby';
import GameRoom from './pages/GameRoom';
import GameBoard from './pages/GameBoard';
import { useGame } from './hooks/useGame';
import { useSoundEffects } from './hooks/useSoundEffects';
import { Card } from './types';
import { message } from 'antd';
import WalletConnect from '../../wallet/WalletConnect';
import logger from './utils/logger';

interface IceWaterFireGameProps {
  onDisconnect?: () => void;
}

type GamePage = 'lobby' | 'room' | 'playing';

const IceWaterFireGame: React.FC<IceWaterFireGameProps> = ({ onDisconnect }) => {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return (
      <WalletPromptContainer>
        <WalletPromptContent>
          <WalletIcon>👛</WalletIcon>
          <WalletTitle>Connect Your Wallet</WalletTitle>
          <WalletSubtitle>
            Connect your wallet to start playing Ice Water Fire
          </WalletSubtitle>
          <WalletConnect />
        </WalletPromptContent>
      </WalletPromptContainer>
    );
  }

  return (
    <SocketProvider address={address}>
      <GameContainer userAddress={address} onDisconnect={onDisconnect} />
    </SocketProvider>
  );
};

interface GameContainerProps {
  userAddress: string;
  onDisconnect?: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ userAddress }) => {
  const [currentPage, setCurrentPage] = useState<GamePage>('room');
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

  const { playSound, soundsEnabled, volume, setVolume, toggleSounds } = useSoundEffects();

  // Fetch balance periodically
  useEffect(() => {
    if (!userAddress) {
      console.log('⚠️ No userAddress, skipping balance fetch');
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
  }, [userAddress]);

  // Timer countdown - synced with backend timestamp
  useEffect(() => {
    // Timer continues running even after player selects to show opponent's remaining time
    if (currentPage === 'playing' && gameState &&
        gameState.myScore < 3 && gameState.opponentScore < 3 && !waitingForAnimations &&
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
      gameState?.myScore, gameState?.opponentScore, waitingForAnimations, playSound, gameState?.selectedCard]);

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
    // Prevent card selection if game is over OR waiting for animations
    if (gameState && (gameState.myScore >= 3 || gameState.opponentScore >= 3 || waitingForAnimations)) {
      logger.warn('Game is over or waiting for animations, cannot select card');
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
        />
      )}
    </>
  );
};

export default IceWaterFireGame;

const WalletPromptContainer = styled.div`
  min-height: 100vh;
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

