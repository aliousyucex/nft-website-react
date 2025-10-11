import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import { SocketProvider } from './context/SocketContext';
import GameLobby from './pages/GameLobby';
import GameRoom from './pages/GameRoom';
import GameBoard from './pages/GameBoard';
import { RoundResultModal, GameResultModal } from './components/ResultModal';
import { useGame } from './hooks/useGame';
import { Card } from './types';
import { message } from 'antd';
import WalletConnect from '../../wallet/WalletConnect';

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
  const [currentPage, setCurrentPage] = useState<GamePage>('lobby');
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);
  const [lastRoundResult] = useState<any>(null);
  const [gameResult] = useState<any>(null);
  console.log(userAddress);

  const {
    availableRooms,
    currentRoom,
    gameState,
    loading,
    error,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    setReady,
    selectCard,
    sendEmoji,
  } = useGame(userAddress);

  // Timer countdown
  useEffect(() => {
    if (currentPage === 'playing' && gameState) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPage, gameState]);

  // Reset timer when card is selected
  useEffect(() => {
    if (gameState?.selectedCard) {
      setTimeRemaining(5);
    }
  }, [gameState?.selectedCard]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Handle room changes (when user joins/creates a room)
  useEffect(() => {
    console.log('Room change detected:', { currentRoom, currentPage });
    if (currentRoom && currentPage === 'lobby') {
      message.success('Joined room successfully!');
      console.log('Navigating to room page');
      setCurrentPage('room');
    } else if (!currentRoom && currentPage === 'room') {
      // Room was left or destroyed
      console.log('Navigating back to lobby');
      setCurrentPage('lobby');
    }
  }, [currentRoom, currentPage]);

  // Handle game state changes
  useEffect(() => {
    if (gameState) {
      if (gameState.gameState === 'waiting') {
        setCurrentPage('room');
      } else if (gameState.gameState === 'playing') {
        setCurrentPage('playing');
      } else if (gameState.gameState === 'finished') {
        setShowGameResult(true);
      }
    }
  }, [gameState]);

  const handleLeaveRoom = () => {
    leaveRoom();
    setCurrentPage('lobby');
  };

  const handleReturnToLobby = () => {
    setShowGameResult(false);
    setCurrentPage('lobby');
    leaveRoom();
  };

  const handleCardSelect = (card: Card) => {
    selectCard(card);
    message.info('Card selected! Waiting for opponent...');
  };

  // Mock data for testing (remove when integrating with backend)
  const mockPlayer = {
    address: userAddress,
    ready: false,
    roundsWon: 0,
    handSize: 5,
    isConnected: true,
    selectedCard: false,
  };

  const mockOpponent = {
    address: '0x' + '1'.repeat(40),
    ready: false,
    roundsWon: 0,
    handSize: 5,
    isConnected: true,
    selectedCard: false,
  };

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
          createRoom={createRoom}
          joinRoom={joinRoom}
          quickJoin={quickJoin}
        />
      )}

      {currentPage === 'room' && currentRoom && (
        <GameRoom
          roomId={currentRoom.roomId}
          betAmount={currentRoom.betAmount}
          players={currentRoom.players}
          currentUserAddress={userAddress}
          onReady={setReady}
          onLeave={handleLeaveRoom}
        />
      )}

      {currentPage === 'playing' && gameState && (
        <GameBoard
          myCards={gameState.myCards || mockCards}
          myPlayer={{
            ...mockPlayer,
            roundsWon: gameState.myScore,
            handSize: gameState.myCards?.length || 5,
            selectedCard: !!gameState.selectedCard,
          }}
          opponentPlayer={{
            ...mockOpponent,
            roundsWon: gameState.opponentScore,
            handSize: gameState.opponentHandSize,
            selectedCard: gameState.opponentSelected,
          }}
          selectedCard={gameState.selectedCard}
          opponentSelected={gameState.opponentSelected}
          currentRound={gameState.currentRound}
          timeRemaining={timeRemaining}
          onCardSelect={handleCardSelect}
          onSendEmoji={sendEmoji}
        />
      )}

      {/* Round Result Modal */}
      {showRoundResult && lastRoundResult && (
        <RoundResultModal
          visible={showRoundResult}
          myCard={lastRoundResult.myCard}
          opponentCard={lastRoundResult.opponentCard}
          result={
            lastRoundResult.isDraw
              ? 'draw'
              : lastRoundResult.winner === userAddress
              ? 'win'
              : 'lose'
          }
          myScore={lastRoundResult.myScore}
          opponentScore={lastRoundResult.opponentScore}
          onClose={() => setShowRoundResult(false)}
        />
      )}

      {/* Game Result Modal */}
      {showGameResult && gameResult && (
        <GameResultModal
          visible={showGameResult}
          result={gameResult.winner === userAddress ? 'win' : 'lose'}
          finalScore={{
            my: gameResult.myScore,
            opponent: gameResult.opponentScore,
          }}
          prizeAmount={gameResult.prizeAmount}
          onClose={() => setShowGameResult(false)}
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

