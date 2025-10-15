import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CardHand from '../components/CardHand';
import Card from '../components/Card';
import { Card as CardType, Player, EMOJIS, RoundResult, RoundHistoryItem } from '../types';
import logger from '../utils/logger';
import { Col, Flex, Row } from 'antd';

interface GameBoardProps {
  myCards: CardType[];
  myPlayer: Player;
  opponentPlayer: Player;
  selectedCard: CardType | null;
  opponentSelected: boolean;
  currentRound: number;
  timeRemaining: number;
  lastRoundResult?: RoundResult | null;
  roundHistory?: RoundHistoryItem[];
  receivedEmoji?: string | null;
  onCardSelect: (card: CardType) => void;
  onSendEmoji: (emojiId: string) => void;
  onRoundResultComplete?: () => void;
  onCardReveal?: () => void;
  onRoundResult?: (result: 'win' | 'lose' | 'draw') => void;
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
  onCardSelect,
  onSendEmoji,
  onRoundResultComplete,
  onCardReveal,
  onRoundResult,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  // Track the last processed round to avoid duplicate animations
  const [lastProcessedRound, setLastProcessedRound] = useState<number>(0);

  // Show round result overlay when round completes - ONLY for NEW rounds
  useEffect(() => {
    if (lastRoundResult &&
      lastRoundResult.myCard &&
      lastRoundResult.opponentCard &&
      lastRoundResult.round > lastProcessedRound) {

      logger.ui('Round result received - NEW ROUND', {
        round: lastRoundResult.round,
        lastProcessedRound,
      });

      // Mark this round as processed
      setLastProcessedRound(lastRoundResult.round);

      console.log('lastRoundResult', lastRoundResult);
      const result = determineResult();

      // Play sounds
      if (onCardReveal) onCardReveal();
      if (onRoundResult) setTimeout(() => onRoundResult(result), 300);

      // Auto-hide after animation completes
      const timer = setTimeout(() => {
        if (onRoundResultComplete) onRoundResultComplete();
      }, 600); // Match with animation duration

      return () => clearTimeout(timer);
    }
  }, [lastRoundResult?.round]); // Only depend on round number

  // Game end will be handled by parent component (index.tsx) via GameResultModal

  const handleEmojiSend = (emoji: string) => {
    onSendEmoji(emoji);
    setShowEmojiPanel(false);
  };

  const isLowTime = timeRemaining <= 2;
  const canSelectCard = !selectedCard && timeRemaining > 0;

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
      {/* Round Result Overlay - Key-based rendering for proper animation */}
      <AnimatePresence mode="wait">
        {lastRoundResult && lastRoundResult.round === lastProcessedRound && (
          <RoundResultOverlay
            key={`round-result-${lastRoundResult.round}`}
            as={motion.div}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
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
          <Row gutter={[16, 0]} justify='center'>
            <Col><ScoreName>You</ScoreName></Col>
            <Col><ScoreName>Opponent</ScoreName></Col>
          </Row>
          <Row gutter={[16, 0]} justify='center'>
            <Col><ScoreValue $isLeading={myPlayer.roundsWon > opponentPlayer.roundsWon}>
              {myPlayer.roundsWon}
            </ScoreValue></Col>
            <Col><ScoreDivider>-</ScoreDivider></Col>
            <Col><ScoreValue $isLeading={opponentPlayer.roundsWon > myPlayer.roundsWon}>
              {opponentPlayer.roundsWon}
            </ScoreValue></Col>
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
            {lastRoundResult && lastRoundResult.opponentCard ? (
              <>
                <OpponentRevealedCard>
                  <CardRevealWrapper>
                    <Card card={lastRoundResult.myCard} isRevealed />
                  </CardRevealWrapper>
                  <RevealLabel>Your Card</RevealLabel>
                </OpponentRevealedCard>
                VS
                <OpponentRevealedCard>
                  <CardRevealWrapper>
                    <Card card={lastRoundResult.opponentCard} isRevealed />
                  </CardRevealWrapper>
                  <RevealLabel>Opponent's Card</RevealLabel>
                </OpponentRevealedCard>
              </>
            ) : (
              <CardHand
                cards={Array.from({ length: opponentPlayer.handSize }).map((_, i) => ({
                  id: `opponent-${i}`,
                  type: 'fire',
                  value: 3,
                  image: ''
                }))}
                selectedCard={null}
                disabled={true}
                isOpponent={true}
              />
            )}
          </OpponentCards>

          <AnimatePresence mode="wait">
            {receivedEmojiProp && (
              <EmojiFloat
                as={motion.div}
                key={`emoji-${receivedEmojiProp}`}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1.2, y: -50 }}
                exit={{ opacity: 0, scale: 0.8, y: -100 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                {receivedEmojiProp}
              </EmojiFloat>
            )}
          </AnimatePresence>

          <TimerContainer $isLowTime={isLowTime}>
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

          {selectedCard && (
            <SelectionConfirmation>
              <ConfirmIcon>✓</ConfirmIcon>
              Card Selected! Waiting for opponent...
            </SelectionConfirmation>
          )}

          <EmojiButton onClick={() => setShowEmojiPanel(!showEmojiPanel)}>
            😊
          </EmojiButton>


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

  @media (max-height: 900px) {
    padding: 5px;
  }
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  height: 100%;
  max-height: calc(100vh - 20px);
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

const OpponentRevealedCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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

const ScoreValue = styled.div<{ $isLeading?: boolean }>`
  font-size: 48px;
  color: ${props => props.$isLeading ? '#00FF88' : 'white'};
  font-weight: bold;
  text-shadow: 0 4px 12px ${props => props.$isLeading ? 'rgba(0, 255, 136, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
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

const TimerContainer = styled.div<{ $isLowTime: boolean }>`
  max-width: 100px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: ${(props) => (props.$isLowTime ? 'rgba(231, 76, 60, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid ${(props) => (props.$isLowTime ? '#E74C3C' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  animation: ${(props) => (props.$isLowTime ? 'urgentPulse 0.5s infinite' : 'none')};

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
  position: relative;
  padding: 10px;
  background: linear-gradient(180deg, transparent 0%, rgba(46, 204, 113, 0.1) 100%);
  border-radius: 16px;
  overflow: hidden;

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

  @media (max-height: 900px) {
    max-height: 180px;
  }
`;

const SelectionConfirmation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(46, 204, 113, 0.3);
  border: 2px solid #2ECC71;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  animation: pulse 1.5s infinite;

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

const ConfirmIcon = styled.span`
  font-size: 20px;
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

const ResultText = styled.div<{ $result: 'WIN' | 'LOSE' | 'DRAW' }>`
  font-size: 120px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 8px;
  text-shadow: 0 0 40px ${props =>
    props.$result === 'WIN' ? 'rgba(0, 255, 136, 0.8)' :
      props.$result === 'LOSE' ? 'rgba(231, 76, 60, 0.8)' :
        'rgba(255, 255, 255, 0.5)'
  };
  color: ${props =>
    props.$result === 'WIN' ? '#00FF88' :
      props.$result === 'LOSE' ? '#E74C3C' :
        '#FFFFFF'
  };
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
