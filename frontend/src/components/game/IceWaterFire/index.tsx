import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import GameLobby from './pages/GameLobby';
import GameRoom from './pages/GameRoom';
import GameBoard from './pages/GameBoard';
import { GameResultModal } from './components/ResultModal';
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
  const [showGameResult, setShowGameResult] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isShownGameResult, setIsShownGameResult] = useState(false);
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

  // Timer countdown - runs during playing phase
  useEffect(() => {
    // Add check for game over condition
    if (currentPage === 'playing' && gameState && !gameState.selectedCard &&
        gameState.myScore < 3 && gameState.opponentScore < 3 && !waitingForAnimations) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            logger.warn('Time expired, auto-selecting card');
            clearInterval(timer);
            return 0;
          }
          if (newTime === 2) {
            logger.timer('Low time warning', { remaining: newTime });
            playSound('timerWarning');
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPage, gameState, gameState?.selectedCard, waitingForAnimations, playSound]);

  // Reset timer when new round starts (from backend event)
  useEffect(() => {
    if (gameState?.currentRound) {
      logger.timer('Timer reset for new round', { round: gameState.currentRound });
      setTimeRemaining(10); // Updated to 10 seconds
    }
  }, [gameState?.currentRound]);

  // Reset timer when both players select and round ends
  useEffect(() => {
    if (gameState?.lastRoundResult) {
      logger.timer('Round ended, will reset timer after animation');
      // Timer will reset when new_round_started event is received
    }
  }, [gameState?.lastRoundResult]);

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
      } else if (gameState.gameState === 'finished' && !isShownGameResult && !showGameResult) {
        // Mark that we've shown the result to prevent re-triggering
        setIsShownGameResult(true);
        
        // Set waiting flag to let animations complete
        setWaitingForAnimations(true);
        
        // Case-insensitive address comparison for winner check
        const isWinner = gameState.winner?.toLowerCase() === userAddress.toLowerCase();
        const isDraw = !gameState.winner; // null winner means draw

        // Set game result (but don't show modal yet)
        setGameResult({
          winner: gameState.winner || null,
          myScore: gameState.myScore || 0,
          opponentScore: gameState.opponentScore || 0,
          prizeAmount: gameState.prizeAmount || 0,
          isWinner, // Store the winner check result
          isDraw,
        });
        
        // Play win/lose/draw sound immediately
        if (isDraw) {
          playSound('gameLose'); // or add a draw sound
        } else {
          playSound(isWinner ? 'gameWin' : 'gameLose');
        }
        
        // Wait for animations to complete before showing modal
        // CardReveal total time: ~4 seconds (entering 800ms + revealing 1000ms + result 800ms + score 800ms + complete 500ms)
        // GameBoard timer: 600ms already waited, add extra buffer
        setTimeout(() => {
          console.log('Showing game result MODAL ULAN');
          clearAnimations();
          setWaitingForAnimations(false);
          setShowGameResult(true);
        }, 4500); // Total animation time + small buffer
      }
    }
  }, [gameState?.gameState, isShownGameResult, showGameResult, userAddress, clearAnimations, playSound]);

  const handleLeaveRoom = () => {
    leaveRoom();
    setCurrentPage('lobby');
  };

  const handleReturnToLobby = () => {
    // Clear all game-related states immediately
    setShowGameResult(false);
    setGameResult(null);
    setIsShownGameResult(false); // Reset flag so next game can show result
    setWaitingForAnimations(false); // Reset animation wait flag
    clearAnimations();
    setTimeRemaining(10);

    // Leave room and navigate
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
        />
      )}

      {/* Game Result Modal */}
      {showGameResult && gameResult && (
        <GameResultModal
          visible={showGameResult}
          result={
            gameResult.isDraw
              ? 'draw'
              : (gameResult.isWinner ? 'win' : 'lose')
          }
          finalScore={{
            my: gameResult.myScore,
            opponent: gameResult.opponentScore,
          }}
          prizeAmount={gameResult.prizeAmount}
          onClose={() => {
            setShowGameResult(false);
            setIsShownGameResult(false);
            setWaitingForAnimations(false);
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

