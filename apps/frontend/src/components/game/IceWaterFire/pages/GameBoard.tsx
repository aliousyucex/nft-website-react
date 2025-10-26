import {Col, Flex, Row} from 'antd';
import {AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import {useEffect, useState } from 'react';
import styled from 'styled-components';
import logo from '../../../../../public/logo.svg';
import Card from '../components/Card';
import CardHand from '../components/CardHand';
import {GameResultModal} from '../components/ResultModal';
import {type Card as CardType, EMOJIS, type GameState, type Player, type RoundHistoryItem, type RoundResult } from '../types';
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
  isPaidGame = true,
  isSinglePlayer = false,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);
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

      console.log('lastRoundResult', lastRoundResult);
      const result = determineResult();

      // Play sounds
      if (onCardReveal) onCardReveal();
      if (onRoundResult) setTimeout(() => onRoundResult(result), 300);

      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        setIsAnimationPlaying(false);
        if (onRoundResultComplete) onRoundResultComplete();
      }, 600); // Match with animation duration

      return () => {
        clearTimeout(timer);
        setIsAnimationPlaying(false);
      };
    }
  }, [lastRoundResult?.round]); // Only depend on round number

  // Handle game finish - Show result modal
  useEffect(() => {
    if (gameState && gameState.gameState === 'finished' && !showGameResult) {
      console.log('🏁 Game finished in GameBoard, showing modal');

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
      });

      // Show modal after a brief delay to let final animations complete naturally
      setTimeout(() => {
        setShowGameResult(true);
      }, 1000);
    }
  }, [gameState?.gameState, currentUserAddress, showGameResult]);

  const handleEmojiSend = (emoji: string) => {
    onSendEmoji(emoji);
    setShowEmojiPanel(false);
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
      {/* Home Button */}
      <HomeButton
        onClick={() => {
          window.location.href = '/';
        }}
        title='Return to Homepage'
      >
        <img src={logo} alt='Home' />
      </HomeButton>

      {/* Round Result Overlay - Key-based rendering for proper animation */}
      <AnimatePresence mode='wait'>
        {lastRoundResult && lastRoundResult.round === lastProcessedRound && (
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
      {showGameResult && gameResult && (
        <GameResultModal
          visible={showGameResult}
          result={gameResult.isDraw ? 'draw' : gameResult.isWinner ? 'win' : 'lose'}
          finalScore={{
            my: gameResult.myScore,
            opponent: gameResult.opponentScore,
          }}
          prizeAmount={gameResult.prizeAmount}
          betAmount={betAmount}
          onClose={() => {
            setShowGameResult(false);
            setGameResult(null);
          }}
          onReturnToLobby={() => {
            setShowGameResult(false);
            setGameResult(null);
            onReturnToLobby();
          }}
          isPaidGame={isPaidGame}
          reason={gameResult.reason}
          afkPlayerAddresses={gameResult.afkPlayerAddresses}
        />
      )}
    </Container>
  );
};

export default GameBoard;

const Container = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;

  @media (max-height: 900px) {
    padding: 5px;
  }
`;

const HomeButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  z-index: 100;
  background: none;
  border: none;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    top: 10px;
    left: 10px;
  }
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  display: grid;
  gap: 10px;
  position: relative;
  overflow: hidden;

  @media (max-height: 900px) {
    gap: 8px;
  }


  @media (max-width: 768px) {
    grid-template-rows: auto auto 1fr;
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
  background: linear-gradient(180deg, transparent 0%, rgba(46, 204, 113, 0.1) 100%);
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
  top: 50%;
  left: 50%;
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
