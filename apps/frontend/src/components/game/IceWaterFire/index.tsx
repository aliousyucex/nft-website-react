import {message} from 'antd';
import type React from 'react';
import {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {formatEther} from 'viem';
import {useAccount, useBalance} from 'wagmi';
import {GameModeModal} from './components/GameModeModal';
import { NetworkWarningModal } from './components/NetworkWarningModal';
import TutorialModal from './components/TutorialModal';
import {SocketProvider, useSocket} from './context/SocketContext';
import {useGame} from './hooks/useGame';
import { useNetworkCheck } from './hooks/useNetworkCheck';
import {useSoundEffects} from './hooks/useSoundEffects';
import GameBoard from './pages/GameBoard';
import GameLobby from './pages/GameLobby';
import GameRoom from './pages/GameRoom';
import type {Card, Player} from './types';
import logger from './utils/logger';

interface IceWaterFireGameProps {
  onDisconnect?: () => void;
}

type GamePage = 'lobby' | 'room' | 'playing';
const IceWaterFireGame: React.FC<IceWaterFireGameProps> = ({onDisconnect}) => {
  const {address, isConnected} = useAccount();
  const [showGameModeModal, setShowGameModeModal] = useState(false);
  const [gameModeLoading, setGameModeLoading] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [guestAddress, setGuestAddress] = useState('');
  const [pendingGameMode, setPendingGameMode] = useState<'single' | 'multi' | null>(null);

  // Generate guest address if playing without wallet
  useEffect(() => {
    if (!isConnected && !guestAddress) {
      // Generate temporary guest address in valid Ethereum format (0x + 40 hex chars)
      // Use timestamp + random hex to create unique address
      const timestamp = Date.now().toString(16).padStart(12, '0'); // 12 hex chars
      const random = Math.random().toString(16).substring(2, 30).padEnd(28, '0'); // 28 hex chars
      const tempAddress = `0x${timestamp}${random}`;
      setGuestAddress(tempAddress);
    }
  }, [guestMode, guestAddress]);

  const userAddress = address || guestAddress;

  return (
    <>
      <SocketProvider address={userAddress}>
        <GameContainer
          userAddress={userAddress}
          onDisconnect={onDisconnect}
          isGuest={guestMode}
          pendingGameMode={pendingGameMode}
          onGameModeHandled={() => setPendingGameMode(null)}
          onRoomReady={() => {
            setGameModeLoading(false);
            setShowGameModeModal(false);
          }}
        />
      </SocketProvider>

      <TutorialModal
        visible={tutorialVisible}
        onClose={() => {
          setTutorialVisible(false);
        }}
      />

      <GameModeModal
        visible={showGameModeModal}
        loading={gameModeLoading}
        onSinglePlayer={() => {
          setPendingGameMode('single');
          setGuestMode(true);
          setGameModeLoading(true);
        }}
        onMultiplayer={() => {
          setPendingGameMode('multi');
          setGuestMode(true);
          setGameModeLoading(true);
        }}
        onCancel={() => {
          setShowGameModeModal(false);
          setGameModeLoading(false);
        }}
      />
    </>
  );
};

interface GameContainerProps {
  userAddress: string;
  onDisconnect?: () => void;
  isGuest?: boolean;
  pendingGameMode?: 'single' | 'multi' | null;
  onGameModeHandled?: () => void;
  onRoomReady?: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({
  userAddress,
  isGuest,
  pendingGameMode,
  onGameModeHandled,
  onRoomReady,
}) => {
  const {roomId: roomIdFromUrl} = useParams<{roomId: string}>();
  const [currentPage, setCurrentPage] = useState<GamePage>('lobby');
  const [timeRemaining, setTimeRemaining] = useState(10);
  
  // Track if game finished sound has been played (prevent duplicate sounds)
  const gameFinishedSoundPlayed = useRef(false);
  const [balance, setBalance] = useState<string>('0');
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [hasCalledRoomReady, setHasCalledRoomReady] = useState(false);
  const [oldRoomId, setOldRoomId] = useState<string | undefined>(undefined);

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
    playAgain,
    setReady,
    setNotReady,
    selectCard,
    sendEmoji,
    clearAnimations,
  } = useGame(userAddress);

  const {socket} = useSocket();
  const {isConnected, address} = useAccount();
  const {playSound, soundsEnabled, volume, setVolume, toggleSounds} = useSoundEffects();
  const {isCorrectNetwork, currentChainId, switchToCorrectNetwork, requiredChainId, requiredNetworkName} = useNetworkCheck();
  const [showNetworkWarning, setShowNetworkWarning] = useState(false);
  
  // Get wallet balance (MetaMask ETH balance)
  // Note: Balance will be automatically updated when refetched in DepositModal/WithdrawModal
  // due to Wagmi's shared cache mechanism
  const {data: walletBalanceData} = useBalance({
    address: address as `0x${string}` | undefined,
  });

  // Update wallet balance when it changes
  useEffect(() => {
    if (walletBalanceData) {
      setBalance(formatEther(walletBalanceData.value));
    }
  }, [walletBalanceData]);

  // Check network when wallet connects (only for non-guest users)
  useEffect(() => {
    if (isConnected && !isGuest && !isCorrectNetwork) {
      setShowNetworkWarning(true);
    }
  }, [isConnected, isGuest, isCorrectNetwork]);

  // Handle pending game mode (auto-create room for guest users)
  useEffect(() => {
    if (!pendingGameMode || !isGuest) return;

    if (!socket || !userAddress) {
      return;
    }

    logger.info('Handling pending game mode');

    // Wait a bit for socket to be fully initialized
    const timer = setTimeout(() => {

      if (pendingGameMode === 'single') {
        // Create single player room
        logger.info('Creating single player room');
        createRoom(0, undefined, 'single_player', true);
      } else if (pendingGameMode === 'multi') {
        // Quick join free multiplayer room
        logger.info('Quick joining free multiplayer room');
        quickJoin(0, false);
      }
    }, 1000); // Increased delay to ensure socket is ready

    return () => clearTimeout(timer);
  }, [pendingGameMode, isGuest, socket, userAddress, createRoom, quickJoin]);

  // Handle room ready - switch to room page and close modal (only once for pending game mode)
  useEffect(() => {
    if (currentRoom && pendingGameMode && !hasCalledRoomReady) {
      setCurrentPage('room');
      setHasCalledRoomReady(true);

      // Clear pending mode and close loading modal
      if (onGameModeHandled) {
        onGameModeHandled();
      }
      if (onRoomReady) {
        onRoomReady();
      }
    }
  }, [currentRoom, pendingGameMode, hasCalledRoomReady, onRoomReady, onGameModeHandled]);

  // Reset hasCalledRoomReady when leaving room
  useEffect(() => {
    if (!currentRoom) {
      setHasCalledRoomReady(false);
    }
  }, [currentRoom]);


  // Handle auto-join via share link (URL parameter)
  useEffect(() => {
    if (!roomIdFromUrl || !socket || !userAddress) return;

    // Check if we're already in a room or have a pending game mode
    if (currentRoom || pendingGameMode) return;

    logger.info('Auto-joining room from URL', {roomId: roomIdFromUrl});

    // Wait a bit for socket to be fully initialized
    const timer = setTimeout(() => {
      joinRoom(roomIdFromUrl);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roomIdFromUrl, socket, userAddress, currentRoom, pendingGameMode, joinRoom]);

  // Fetch contract balance periodically (skip for guest users)
  useEffect(() => {
    if (!userAddress || isGuest) {
      return;
    }

    const fetchContractBalance = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/api/contract/balance/${userAddress}`);
        if (response.ok) {
          const data = await response.json();
          setContractBalance(data.balance || '0');
        } else {
          console.error('❌ Contract balance fetch failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error fetching contract balance:', error);
      }
    };

    fetchContractBalance();
    const interval = setInterval(fetchContractBalance, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [userAddress, isGuest]);

  // Timer countdown - synced with backend timestamp
  useEffect(() => {
    // Timer continues running even after player selects to show opponent's remaining time
    // Removed waitingForAnimations check to keep timer running during round result animations
    if (
      currentPage === 'playing' &&
      gameState &&
      gameState.myScore < 3 &&
      gameState.opponentScore < 3 &&
      gameState.roundStartTime &&
      gameState.timeLimit
    ) {
      // Calculate time based on server timestamp
      const calculateTimeRemaining = () => {
        const elapsed = (Date.now() - gameState.roundStartTime!) / 1000; // Convert to seconds
        const remaining = Math.max(0, Math.ceil(gameState.timeLimit! - elapsed));
        return remaining;
      };

      // Update immediately
      const initialTime = calculateTimeRemaining();
      setTimeRemaining(initialTime);

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
          playSound('timerWarning');
          hasPlayedWarning = true;
        }

        setTimeRemaining(newTime);
      }, 100); // Update every 100ms for smooth countdown

      return () => {
        clearInterval(timer);
      };
    }
  }, [
    currentPage,
    gameState?.roundStartTime,
    gameState?.timeLimit,
    gameState?.myScore,
    gameState?.opponentScore,
    playSound,
    gameState?.selectedCard,
  ]);

  // Handle errors
  useEffect(() => {
    if (error) {
      message.error(error);
      // If insufficient balance error, redirect to lobby and clear states
      if (error.toLowerCase().includes('insufficient balance')) {
        logger.info('Insufficient balance error - redirecting to lobby');
        // Clear all game-related states
        clearAnimations();
        setTimeRemaining(10);
        gameFinishedSoundPlayed.current = false;
        setOldRoomId(undefined);
        // Ensure we're on lobby page
        setCurrentPage('lobby');
        // Leave room if we're still in one
        if (currentRoom) {
          leaveRoom();
        }
      }
    }
  }, [error, currentRoom, leaveRoom, clearAnimations]);

  // Handle room changes (when user joins/creates a room)
  useEffect(() => {
    if (currentRoom) {
      // Clear oldRoomId when successfully joined a new room (from play again)
      if (oldRoomId && currentRoom.roomId !== oldRoomId) {
        logger.info('Successfully joined new room from play again', {
          oldRoomId,
          newRoomId: currentRoom.roomId,
        });
        setOldRoomId(undefined);
      }

      if (currentRoom.gameState === 'waiting') {
        // Navigate to room page if game is waiting
        if (currentPage === 'lobby' || currentPage === 'playing') {
          playSound('roomJoin');
          setCurrentPage('room');
        }
      } else if (currentRoom.gameState === 'playing') {
        // Navigate to playing page if game started (regardless of current page)
        if (currentPage === 'room' || currentPage === 'lobby') {
          setCurrentPage('playing');
        }
      }
    } else if (!currentRoom && (currentPage === 'room' || currentPage === 'playing')) {
      // Room was left or destroyed - navigate back to lobby
      logger.ui('Navigating back to lobby - room no longer exists');
      setCurrentPage('lobby');
    }
  }, [currentRoom, currentPage, playSound, oldRoomId]);

  // Handle game state changes
  useEffect(() => {
    if (gameState) {
      if (gameState.gameState === 'waiting') {
        setCurrentPage('room');
        // Reset sound flag when game restarts
        gameFinishedSoundPlayed.current = false;
      } else if (gameState.gameState === 'playing') {
        setCurrentPage('playing');
        // Reset sound flag when game starts
        gameFinishedSoundPlayed.current = false;
      } else if (gameState.gameState === 'finished') {
        // 🛡️ Guard: Only play sound once per game
        if (!gameFinishedSoundPlayed.current) {
          gameFinishedSoundPlayed.current = true;
          
          // Game finished - stay on playing page, modal will show there
          // Play win/lose/draw sound immediately
          const isWinner = gameState.winner?.toLowerCase() === userAddress.toLowerCase();
          
          playSound(isWinner ? 'gameWin' : 'gameLose');
          
          // Store old room ID for play again
          if (currentRoom?.roomId) {
            setOldRoomId(currentRoom.roomId);
          }
        }
      }
    } else if (!gameState && currentRoom?.gameState === 'playing') {
      // If we have a room with playing state but no gameState, 
      // we're probably waiting for game_started or cards_dealt event
      // Don't change page here, let room_updated handler manage it
    }
  }, [gameState?.gameState, userAddress, playSound, currentRoom?.roomId, currentRoom?.gameState]);

  const handleLeaveRoom = () => {
    leaveRoom();
    setCurrentPage('lobby');
    setOldRoomId(undefined);
  };

  const handlePlayAgain = () => {
    if (oldRoomId) {
      // Don't reset currentPage here - let playAgain handle navigation
      // If playAgain fails, error handler will redirect to lobby
      playAgain(oldRoomId);
      // Don't reset oldRoomId immediately - keep it in case we need to retry
      // It will be cleared on success or error
    }
  };

  const handleReturnToLobby = () => {
    setOldRoomId(undefined);
    logger.info('Returning to lobby - clearing states');
    
    // Clear all game-related states
    clearAnimations();
    setTimeRemaining(10);
    
    // Reset sound flag
    gameFinishedSoundPlayed.current = false;
    
    // Leave room (will clear currentRoom, gameState, localStorage immediately)
    leaveRoom();
    
    // Navigate to lobby
    setCurrentPage('lobby');
    
    logger.info('Navigated to lobby page');
  };

  const handleCardSelect = (card: Card) => {
    // Prevent card selection if game is over
    if (gameState && (gameState.myScore >= 3 || gameState.opponentScore >= 3)) {
      logger.warn('Game is over, cannot select card');
      return;
    }

    logger.game('Card selected', {cardId: card.id});
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
    address:
      currentRoom?.players?.find(
        (p: Player) => p.address.toLowerCase() !== userAddress.toLowerCase()
      )?.address || '0x0000000000000000000000000000000000000000',
    ready: false,
    roundsWon: gameState?.opponentScore || 0,
    handSize: 0, // We don't show opponent's hand
    isConnected: true,
    selectedCard: !!gameState?.opponentSelected,
  };


  const mockCards: Card[] = [
    {id: 'fire_3', type: 'fire', value: 3},
    {id: 'fire_5', type: 'fire', value: 5},
    {id: 'ice_3', type: 'ice', value: 3},
    {id: 'water_5', type: 'water', value: 5},
    {id: 'ice_7', type: 'ice', value: 7},
  ];

  return (
    <>
      {currentPage === 'lobby' && !pendingGameMode && (
        <GameLobby
          availableRooms={availableRooms}
          loading={loading}
          balance={balance}
          contractBalance={contractBalance}
          userAddress={userAddress}
          createRoom={createRoom}
          joinRoom={joinRoom}
          quickJoin={quickJoin}
          soundsEnabled={soundsEnabled}
          volume={volume}
          onToggleSounds={toggleSounds}
          onVolumeChange={setVolume}
          walletConnected={isConnected}
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

      {currentPage === 'playing' && (gameState || currentRoom?.gameState === 'playing') && (
        <GameBoard
          betAmount={currentRoom?.betAmount || 0}
          myCards={gameState?.myCards || mockCards}
          myPlayer={myPlayer}
          opponentPlayer={opponentPlayer}
          selectedCard={gameState?.selectedCard || null}
          opponentSelected={gameState?.opponentSelected || false}
          currentRound={gameState?.currentRound || 0}
          timeRemaining={timeRemaining}
          lastRoundResult={gameState?.lastRoundResult || null}
          roundHistory={gameState?.roundHistory || []}
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
          onPlayAgain={handlePlayAgain}
          oldRoomId={oldRoomId}
          isPaidGame={gameState?.isPaidGame ?? currentRoom?.betAmount !== 0}
          isSinglePlayer={currentRoom?.isSinglePlayer ?? false}
        />
      )}

      {/* Network Warning Modal */}
      <NetworkWarningModal
        visible={showNetworkWarning}
        onClose={() => setShowNetworkWarning(false)}
        onSwitchNetwork={() => {
          switchToCorrectNetwork();
          setShowNetworkWarning(false);
        }}
        currentNetworkId={currentChainId}
        requiredNetworkName={requiredNetworkName}
        requiredNetworkId={requiredChainId}
      />
    </>
  );
};

export default IceWaterFireGame;