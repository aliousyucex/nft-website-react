import {Col, Flex, Row} from 'antd';
import {AnimatePresence, motion} from 'framer-motion';
import type React from 'react';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import CardHand from '../components/CardHand';
import {LeaveConfirmationModal} from '../components/LeaveConfirmationModal';
import {GameResultModal} from '../components/ResultModal';
import RoundHistory from '../components/RoundHistory';
import {
  type Card as CardType,
  EMOJIS,
  type GameState,
  type Player,
  type RoundHistoryItem,
  type RoundResult,
} from '../types';
import logger from '../utils/logger';

interface GameBoardProps {
  myCards: CardType[];
  myPlayer: Player;
  betAmount: number;
  opponentPlayer: Player;
  selectedCard: CardType | null;
  opponentSelected: boolean;
  currentRound: number;
  timeRemaining: number;
  lastRoundResult?: RoundResult | null;
  roundHistory?: RoundHistoryItem[];
  receivedEmoji?: string | null;
  gameState: GameState | null;
  currentUserAddress: string;
  onCardSelect: (card: CardType) => void;
  onSendEmoji: (emojiId: string) => void;
  onRoundResultComplete?: () => void;
  onCardReveal?: () => void;
  onRoundResult?: (result: 'win' | 'lose' | 'draw') => void;
  onReturnToLobby: () => void;
  onPlayAgain?: () => void;
  oldRoomId?: string;
  isPaidGame?: boolean;
  isSinglePlayer?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  myCards,
  myPlayer,
  opponentPlayer,
  selectedCard,
  opponentSelected,
  timeRemaining,
  lastRoundResult,
  receivedEmoji: receivedEmojiProp,
  gameState,
  betAmount,
  currentUserAddress,
  onCardSelect,
  onSendEmoji,
  onRoundResultComplete,
  onCardReveal,
  onRoundResult,
  onReturnToLobby,
  onPlayAgain,
  oldRoomId,
  isPaidGame = true,
  isSinglePlayer = false,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false); // Separate state for result modal
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: string | null;
    myScore: number;
    opponentScore: number;
    prizeAmount: number;
    isWinner: boolean;
    isDraw: boolean;
    reason?: string;
    afkPlayerAddresses?: string[];
  } | null>(null);

  // Track the last processed round to avoid duplicate animations
  const [lastProcessedRound, setLastProcessedRound] = useState<number>(0);
  // Track if round result animation is playing
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

  // Emoji spam system - array of active emojis
  const [activeEmojis, setActiveEmojis] = useState<
    Array<{
      id: string;
      emoji: string;
      timestamp: number;
    }>
  >([]);

  // Handle incoming emoji - add to spam array
  useEffect(() => {
    if (receivedEmojiProp) {
      const newEmoji = {
        id: `emoji-${Date.now()}-${Math.random()}`,
        emoji: receivedEmojiProp,
        timestamp: Date.now(),
      };

      setActiveEmojis((prev) => [...prev, newEmoji]);

      // Auto-remove after 2 seconds (animation duration)
      setTimeout(() => {
        setActiveEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
      }, 2000);
    }
  }, [receivedEmojiProp]);

  // Show round result overlay when round completes - ONLY for NEW rounds
  useEffect(() => {
    if (
      lastRoundResult?.myCard &&
      lastRoundResult.myCard &&
      lastRoundResult.opponentCard &&
      lastRoundResult.round > lastProcessedRound
    ) {
      logger.ui('Round result received - NEW ROUND', {
        round: lastRoundResult.round,
        lastProcessedRound,
      });

      // Mark this round as processed
      setLastProcessedRound(lastRoundResult.round);

      // Set animation playing flag
      setIsAnimationPlaying(true);

      const result = determineResult();

      // Play sounds
      if (onCardReveal) onCardReveal();
      if (onRoundResult) setTimeout(() => onRoundResult(result), 300);

      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        setIsAnimationPlaying(false);
        if (onRoundResultComplete) onRoundResultComplete();
      }, 3000); // Extended to 3000ms to wait for backend round processing + buffer

      return () => {
        clearTimeout(timer);
        setIsAnimationPlaying(false);
      };
    }
  }, [lastRoundResult?.round]); // Only depend on round number

  // Handle game finish - Show result modal
  useEffect(() => {
    if (gameState && gameState.gameState === 'finished' && !showResultModal) {
      // Case-insensitive address comparison for winner check
      const isWinner = gameState.winner?.toLowerCase() === currentUserAddress.toLowerCase();
      const isDraw = !gameState.winner; // null winner means draw

      // Set game result and show modal
      setGameResult({
        winner: gameState.winner || null,
        myScore: gameState.myScore || 0,
        opponentScore: gameState.opponentScore || 0,
        prizeAmount: gameState.prizeAmount || 0,
        isWinner,
        isDraw,
        reason: gameState.reason,
        afkPlayerAddresses: gameState.afkPlayerAddresses || [],
      });

      // Show modal after a longer delay to let final round card reveal complete
      // This ensures players see the final cards before the result modal
      setTimeout(() => {
        setShowResultModal(true);
      }, 3000);
    }
  }, [gameState?.gameState, currentUserAddress, showResultModal]);

  const handleEmojiSend = (emoji: string) => {
    onSendEmoji(emoji);
    setShowEmojiPanel(false);
  };

  const handleLeaveGame = () => {
    setShowLeaveConfirmation(false);
    onReturnToLobby();
  };

  const isLowTime = timeRemaining <= 2;
  // Prevent card selection when card is already selected, time is up, or during round result animations
  const canSelectCard = !selectedCard && timeRemaining > 0 && !isAnimationPlaying;

  const determineResult = (): 'win' | 'lose' | 'draw' => {
    if (!lastRoundResult) return 'draw';
    if (lastRoundResult.isDraw) return 'draw';

    // Case-insensitive address comparison (backend uses lowercase, frontend might be checksum)
    const winnerAddress = lastRoundResult.winner?.toLowerCase();
    const myAddress = myPlayer.address.toLowerCase();

    if (winnerAddress === myAddress) return 'win';
    return 'lose';
  };

  return (
    <Container>
      {/* Leave Button - Same as GameRoom */}
      <LeaveButton onClick={() => setShowLeaveConfirmation(true)}>
        <BackIcon>←</BackIcon>
        Leave Room
      </LeaveButton>

      {/* Mobile History Button */}
      <HistoryButton onClick={() => setShowHistoryModal(true)}>
        📋
      </HistoryButton>

      {/* Round Result Overlay - Key-based rendering for proper animation */}
      <AnimatePresence mode='wait'>
        {lastRoundResult && lastRoundResult.round === lastProcessedRound && gameState?.gameState !== 'finished' && (
          <RoundResultOverlay
            key={`round-result-${lastRoundResult.round}`}
            as={motion.div}
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 1.5}}
            transition={{duration: 0.3}}
            onAnimationComplete={() => {
              // Auto-hide after animation completes
              setTimeout(() => {
                setLastProcessedRound((prev) => prev); // Keep processed
              }, 300);
            }}
          >
            <ResultText $result={determineResult().toUpperCase() as 'WIN' | 'LOSE' | 'DRAW'}>
              {determineResult().toUpperCase()}
            </ResultText>
          </RoundResultOverlay>
        )}
      </AnimatePresence>

      <GameContainer>
        {/* Score Board */}
        <Flex vertical justify='center' align='center'>
          <Row gutter={[16, 0]} justify='center' align='middle'>
            <ScoreCol>
              <ScoreName>You</ScoreName>
            </ScoreCol>
            <ScoreCol> </ScoreCol>
            <ScoreCol>
              <ScoreName>Opponent</ScoreName>
            </ScoreCol>
          </Row>
          <Row gutter={[16, 0]} justify='center' align='middle'>
            <ScoreCol>
              <ScoreValue $isLeading={myPlayer.roundsWon > opponentPlayer.roundsWon}>
                {myPlayer.roundsWon}
              </ScoreValue>
            </ScoreCol>
            <ScoreCol>
              <ScoreDivider>-</ScoreDivider>
            </ScoreCol>
            <ScoreCol>
              <ScoreValue $isLeading={opponentPlayer.roundsWon > myPlayer.roundsWon}>
                {opponentPlayer.roundsWon}
              </ScoreValue>
            </ScoreCol>
          </Row>
        </Flex>

        {/* Middle Area - Game Info */}
        <MiddleArea>
          {opponentSelected && (
            <SelectionIndicator>
              <IndicatorIcon>✓</IndicatorIcon>
              Opponent Selected
            </SelectionIndicator>
          )}

          <OpponentCards>
            {lastRoundResult?.opponentCard ? (
              <Flex vertical justify='center' align='center' gap={16}>
                <Row gutter={[16, 0]} justify='center' align='middle'>
                  <RevealCol>
                    <CardRevealWrapper>
                      <Card card={lastRoundResult.myCard} isRevealed />
                    </CardRevealWrapper>
                  </RevealCol>
                  <RevealCol>
                    <ScoreDivider>VS</ScoreDivider>
                  </RevealCol>
                  <RevealCol>
                    <CardRevealWrapper>
                      <Card card={lastRoundResult.opponentCard} isRevealed />
                    </CardRevealWrapper>
                  </RevealCol>
                </Row>
                <Row gutter={[16, 0]} justify='center' align='middle'>
                  <RevealCol>
                    <RevealLabel>Your Card</RevealLabel>
                  </RevealCol>
                  <RevealCol> </RevealCol>
                  <RevealCol>
                    <RevealLabel>Opponent's Card</RevealLabel>
                  </RevealCol>
                </Row>
              </Flex>
            ) : (
              <CardHand
                cards={Array.from({length: opponentPlayer.handSize}).map((_, i) => ({
                  id: `opponent-${i}`,
                  type: 'fire',
                  value: 3,
                  image: '',
                }))}
                selectedCard={null}
                isOpponent={true}
              />
            )}
          </OpponentCards>

          <AnimatePresence>
            {activeEmojis.map((emojiData) => (
              <EmojiFloat
                as={motion.div}
                key={emojiData.id}
                initial={{opacity: 0, scale: 0.5, y: 0, x: -50}}
                animate={{opacity: 1, scale: 1.2, y: -50, x: -50}}
                exit={{opacity: 0, scale: 0.8, y: -100, x: -50}}
                transition={{duration: 2, ease: 'easeOut'}}
              >
                {emojiData.emoji}
              </EmojiFloat>
            ))}
          </AnimatePresence>

          <TimerContainer $isSelected={!!selectedCard} $isLowTime={isLowTime}>
            <TimerIcon>{isLowTime ? '⚠️' : '⏱️'}</TimerIcon>
            <TimerText>{timeRemaining}s</TimerText>
          </TimerContainer>
        </MiddleArea>

        {/* Player Side (Bottom) */}
        <PlayerSide>
          <MyCards>
            <CardHand
              cards={myCards}
              selectedCard={selectedCard}
              onCardSelect={canSelectCard ? onCardSelect : undefined}
              disabled={!canSelectCard}
            />
          </MyCards>

          {!isSinglePlayer && (
            <EmojiButton onClick={() => setShowEmojiPanel(!showEmojiPanel)}>😊</EmojiButton>
          )}

          {showEmojiPanel && (
            <EmojiPanel>
              {EMOJIS.map((emoji) => (
                <EmojiItem key={emoji} onClick={() => handleEmojiSend(emoji)}>
                  {emoji}
                </EmojiItem>
              ))}
            </EmojiPanel>
          )}
        </PlayerSide>
      </GameContainer>

      {/* Game Result Modal */}
      {showResultModal && gameResult && (
        <GameResultModal
          visible={showResultModal}
          result={gameResult.isDraw ? 'draw' : gameResult.isWinner ? 'win' : 'lose'}
          finalScore={{
            my: gameResult.myScore,
            opponent: gameResult.opponentScore,
          }}
          prizeAmount={gameResult.prizeAmount}
          betAmount={betAmount}
          onClose={() => {
            // Modal should not be closable, but keep for compatibility
            setShowResultModal(false);
            setGameResult(null);
          }}
          onReturnToLobby={() => {
            setShowResultModal(false);
            setGameResult(null);
            onReturnToLobby();
          }}
          onPlayAgain={onPlayAgain}
          isPaidGame={isPaidGame}
          isSinglePlayer={isSinglePlayer}
          reason={gameResult.reason}
          afkPlayerAddresses={gameResult.afkPlayerAddresses}
          currentUserAddress={currentUserAddress}
        />
      )}

      {/* Round History Sidebar */}
      <HistorySidebar>
        <HistorySidebarHeader>Round History</HistorySidebarHeader>
        <RoundHistory history={gameState?.roundHistory || []} />
      </HistorySidebar>

      {/* Mobile History Modal */}
      {showHistoryModal && (
        <HistoryModalOverlay onClick={() => setShowHistoryModal(false)}>
          <HistoryModalContent onClick={(e) => e.stopPropagation()}>
            <HistoryModalHeader>
              <span>Round History</span>
              <HistoryCloseButton onClick={() => setShowHistoryModal(false)}>
                ✕
              </HistoryCloseButton>
            </HistoryModalHeader>
            <RoundHistory history={gameState?.roundHistory || []} />
          </HistoryModalContent>
        </HistoryModalOverlay>
      )}

      {/* Leave Confirmation Modal */}
      <LeaveConfirmationModal
        visible={showLeaveConfirmation}
        onCancel={() => setShowLeaveConfirmation(false)}
        onConfirm={() => {
          setShowLeaveConfirmation(false);
          handleLeaveGame();
        }}
        isPaidGame={isPaidGame}
        betAmount={betAmount}
      />
    </Container>
  );
};

export default GameBoard;

const Container = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: grid;
  grid-template-columns: 1fr 300px;
  padding: 10px;
  gap: 10px;
  position: relative;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 250px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-height: 900px) {
    padding: 5px;
  }
`;

const LeaveButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.9) 0%, rgba(192, 57, 43, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
    background: linear-gradient(135deg, rgba(192, 57, 43, 0.95) 0%, rgba(231, 76, 60, 0.95) 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    top: 10px;
    left: 10px;
  }
`;

const BackIcon = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const HistoryButton = styled.button`
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HistoryModalOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HistoryModalContent = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 90%;
  max-width: 400px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const HistoryModalHeader = styled.div`
  padding: 20px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const HistorySidebar = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    display: none;
  }
`;

const HistorySidebarHeader = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  gap: 10px;

  @media (max-height: 900px) {
    gap: 8px;
  }

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const OpponentCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardRevealWrapper = styled.div`
  transform: scale(0.8);
`;

const RevealLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SelectionIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(52, 152, 219, 0.3);
  border: 2px solid #3498DB;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.4);
    }
    50% {
      box-shadow: 0 0 40px rgba(52, 152, 219, 0.8);
    }
  }
`;

const IndicatorIcon = styled.span`
  font-size: 20px;
`;

const EmojiFloat = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  z-index: 10;
  pointer-events: none;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-height: 900px) {
    font-size: 56px;
  }
`;

const MiddleArea = styled.div`
  display: flex;
  width: 50%;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.15);

  @media (max-height: 900px) {
    gap: 12px;
    padding: 12px 20px;
  }

  @media (max-height: 800px) {
    gap: 8px;
    padding: 10px 16px;
  }
`;

const ScoreName = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-height: 900px) {
    font-size: 11px;
  }
`;

const ScoreValue = styled.div<{$isLeading?: boolean}>`
  font-size: 48px;
  color: ${(props) => (props.$isLeading ? '#00FF88' : 'white')};
  font-weight: bold;
  text-shadow: 0 4px 12px ${(props) => (props.$isLeading ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 0, 0, 0.5)')};
  transition: all 0.3s ease;

  @media (max-height: 900px) {
    font-size: 38px;
  }
`;

const ScoreDivider = styled.div`
  font-size: 36px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
  margin-top: 10px;
`;

const TimerContainer = styled.div<{$isSelected: boolean; $isLowTime: boolean}>`
  max-width: 100px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: ${(props) => (props.$isSelected ? 'rgba(46, 204, 113, 0.3)' : props.$isLowTime ? 'rgba(231, 76, 60, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid ${(props) => (props.$isSelected ? '#2ECC71' : props.$isLowTime ? '#E74C3C' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  animation: ${(props) => (props.$isLowTime ? 'urgentPulse 0.5s infinite' : 'none')};
  position: relative;

  @keyframes urgentPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @media (max-height: 900px) {
    padding: 10px 20px;
    gap: 10px;
  }
`;

const TimerIcon = styled.span`
  font-size: 22px;

  @media (max-height: 900px) {
    font-size: 20px;
  }
`;

const TimerText = styled.div`
  font-size: 24px;
  color: white;
  font-weight: bold;
  font-family: 'Poppins', monospace;
  min-width: 45px;
  text-align: center;

  @media (max-height: 900px) {
    font-size: 20px;
    min-width: 40px;
  }
`;

const PlayerSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;

  @media (max-height: 900px) {
    gap: 8px;
    padding: 8px;
  }
`;

const MyCards = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  max-height: 220px;
  overflow: visible;
  margin-left: -110px;

  @media (max-height: 900px) {
    max-height: 180px;
  }

  @media (max-width: 800px) {
    margin-left: -40px;
  }
`;

const EmojiButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%);
  border: none;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 24px rgba(231, 76, 60, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmojiPanel = styled.div`
  position: absolute;
  bottom: 90px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EmojiItem = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  background: transparent;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.2);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const RoundResultOverlay = styled.div`
  position: fixed;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  pointer-events: none;
`;

const ResultText = styled.div<{$result: 'WIN' | 'LOSE' | 'DRAW'}>`
  font-size: 120px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 8px;
  text-shadow: 0 0 40px ${(props) =>
    props.$result === 'WIN'
      ? 'rgba(0, 255, 136, 0.8)'
      : props.$result === 'LOSE'
        ? 'rgba(231, 76, 60, 0.8)'
        : 'rgba(255, 255, 255, 0.5)'};
  color: ${(props) =>
    props.$result === 'WIN' ? '#00FF88' : props.$result === 'LOSE' ? '#E74C3C' : '#FFFFFF'};
  animation: resultPulse 0.5s ease-out;

  @keyframes resultPulse {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-height: 900px) {
    font-size: 100px;
  }

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const ScoreCol = styled(Col)`
  width: 75px;
  justify-items: center;
`;

const RevealCol = styled(Col)`
  width: 100px;
  justify-items: center;
  justify-content: center;
`;
