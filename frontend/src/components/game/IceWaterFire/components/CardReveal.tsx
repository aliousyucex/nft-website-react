import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../types';
import logger from '../utils/logger';

interface CardRevealProps {
  myCard: CardType;
  opponentCard: CardType;
  result: 'win' | 'lose' | 'draw';
  myNewScore: number;
  opponentNewScore: number;
  onComplete: () => void;
}

const CardReveal: React.FC<CardRevealProps> = ({
  myCard,
  opponentCard,
  result,
  myNewScore,
  opponentNewScore,
  onComplete,
}) => {
  const [animationPhase, setAnimationPhase] = useState<
    'entering' | 'revealing' | 'result' | 'score' | 'complete'
  >('entering');

  useEffect(() => {
    logger.animation('Card reveal started', { result });

    // Animation sequence
    const timings = {
      entering: 800,    // Cards slide in
      revealing: 1000,  // Cards flip
      result: 800,      // Winner highlighted
      score: 800,       // Score counting
      complete: 500,    // Fade out
    };

    const sequence = async () => {
      // Phase 1: Entering
      await new Promise(resolve => setTimeout(resolve, timings.entering));
      setAnimationPhase('revealing');

      // Phase 2: Revealing (flip)
      await new Promise(resolve => setTimeout(resolve, timings.revealing));
      setAnimationPhase('result');

      // Phase 3: Result highlight
      await new Promise(resolve => setTimeout(resolve, timings.result));
      setAnimationPhase('score');

      // Phase 4: Score update
      await new Promise(resolve => setTimeout(resolve, timings.score));
      setAnimationPhase('complete');

      // Phase 5: Complete and callback
      await new Promise(resolve => setTimeout(resolve, timings.complete));
      logger.animation('Card reveal complete');
      onComplete();
    };

    sequence();
  }, [myCard, opponentCard, result, onComplete]);

  const getCardIcon = (type: CardType['type']) => {
    switch (type) {
      case 'fire':
        return '🔥';
      case 'ice':
        return '❄️';
      case 'water':
        return '💧';
      default:
        return '?';
    }
  };

  const getCardColor = (type: CardType['type']) => {
    switch (type) {
      case 'fire':
        return '#FF6B6B';
      case 'ice':
        return '#4ECDC4';
      case 'water':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return 'You Win!';
      case 'lose':
        return 'You Lose';
      case 'draw':
        return 'Draw!';
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'win':
        return '#2ECC71';
      case 'lose':
        return '#E74C3C';
      case 'draw':
        return '#F39C12';
    }
  };

  const isMyCardWinner = result === 'win';
  const isOpponentCardWinner = result === 'lose';
  const isDraw = result === 'draw';

  return (
    <AnimatePresence>
      <Overlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Container>
          {/* Cards */}
          <CardsContainer>
            {/* My Card */}
            <CardWrapper
              as={motion.div}
              initial={{ x: -300, y: 200, scale: 0.5, opacity: 0 }}
              animate={{
                x: 0,
                y: 0,
                scale: animationPhase === 'result' && isMyCardWinner ? 1.15 : 1,
                opacity: animationPhase === 'complete' ? 0 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
            >
              <RevealCard
                as={motion.div}
                $cardColor={getCardColor(myCard.type)}
                $isWinner={isMyCardWinner}
                $isDraw={isDraw}
                $phase={animationPhase}
                animate={{
                  rotateY: animationPhase === 'revealing' || animationPhase === 'result' || animationPhase === 'score' ? 0 : 180,
                  boxShadow:
                    animationPhase === 'result' && isMyCardWinner
                      ? `0 0 40px ${getCardColor(myCard.type)}CC, 0 0 80px ${getCardColor(myCard.type)}66`
                      : `0 8px 24px rgba(0, 0, 0, 0.3)`,
                }}
                transition={{ duration: 0.6 }}
              >
                <CardIcon>{getCardIcon(myCard.type)}</CardIcon>
                <CardValue>{myCard.value}</CardValue>
                <CardTypeLabel>{myCard.type.toUpperCase()}</CardTypeLabel>
              </RevealCard>
              <PlayerLabel>You</PlayerLabel>
            </CardWrapper>

            {/* VS Divider */}
            <VSDivider
              as={motion.div}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <VSText
                as={motion.div}
                animate={{
                  scale: animationPhase === 'result' ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: animationPhase === 'result' ? 2 : 0 }}
              >
                VS
              </VSText>
            </VSDivider>

            {/* Opponent Card */}
            <CardWrapper
              as={motion.div}
              initial={{ x: 300, y: 200, scale: 0.5, opacity: 0 }}
              animate={{
                x: 0,
                y: 0,
                scale: animationPhase === 'result' && isOpponentCardWinner ? 1.15 : 1,
                opacity: animationPhase === 'complete' ? 0 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
            >
              <RevealCard
                as={motion.div}
                $cardColor={getCardColor(opponentCard.type)}
                $isWinner={isOpponentCardWinner}
                $isDraw={isDraw}
                $phase={animationPhase}
                animate={{
                  rotateY: animationPhase === 'revealing' || animationPhase === 'result' || animationPhase === 'score' ? 0 : 180,
                  boxShadow:
                    animationPhase === 'result' && isOpponentCardWinner
                      ? `0 0 40px ${getCardColor(opponentCard.type)}CC, 0 0 80px ${getCardColor(opponentCard.type)}66`
                      : `0 8px 24px rgba(0, 0, 0, 0.3)`,
                }}
                transition={{ duration: 0.6 }}
              >
                <CardIcon>{getCardIcon(opponentCard.type)}</CardIcon>
                <CardValue>{opponentCard.value}</CardValue>
                <CardTypeLabel>{opponentCard.type.toUpperCase()}</CardTypeLabel>
              </RevealCard>
              <PlayerLabel>Opponent</PlayerLabel>
            </CardWrapper>
          </CardsContainer>

          {/* Result Message */}
          <AnimatePresence>
            {animationPhase === 'result' && (
              <ResultMessage
                as={motion.div}
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                $color={getResultColor()}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {getResultMessage()}
              </ResultMessage>
            )}
          </AnimatePresence>

          {/* Score Update */}
          <AnimatePresence>
            {animationPhase === 'score' && (
              <ScoreUpdate
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ScoreItem>
                  <ScoreLabel>Your Score</ScoreLabel>
                  <ScoreValue
                    as={motion.div}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {myNewScore}
                  </ScoreValue>
                </ScoreItem>
                <ScoreDivider>-</ScoreDivider>
                <ScoreItem>
                  <ScoreLabel>Opponent</ScoreLabel>
                  <ScoreValue
                    as={motion.div}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {opponentNewScore}
                  </ScoreValue>
                </ScoreItem>
              </ScoreUpdate>
            )}
          </AnimatePresence>
        </Container>
      </Overlay>
    </AnimatePresence>
  );
};

export default CardReveal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
  perspective: 1000px;

  @media (max-width: 768px) {
    gap: 40px;
    flex-direction: column;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const RevealCard = styled.div<{
  $cardColor: string;
  $isWinner: boolean;
  $isDraw: boolean;
  $phase: string;
}>`
  width: 160px;
  height: 240px;
  border-radius: 16px;
  background: ${(props) => props.$cardColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  border: ${(props) =>
    props.$phase === 'result'
      ? props.$isWinner
        ? '4px solid #2ECC71'
        : props.$isDraw
        ? '4px solid #F39C12'
        : '4px solid transparent'
      : '4px solid rgba(255, 255, 255, 0.2)'};
  opacity: ${(props) => (props.$phase === 'result' && !props.$isWinner && !props.$isDraw ? 0.5 : 1)};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
    height: 180px;
  }
`;

const CardIcon = styled.div`
  font-size: 72px;
  margin-bottom: 12px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));

  @media (max-width: 768px) {
    font-size: 56px;
  }
`;

const CardValue = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const CardTypeLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PlayerLabel = styled.div`
  font-size: 20px;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const VSDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const VSText = styled.div`
  font-size: 36px;
  color: white;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ResultMessage = styled.div<{ $color: string }>`
  font-size: 56px;
  font-weight: bold;
  color: ${(props) => props.$color};
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 3px solid ${(props) => props.$color};
  box-shadow: 0 0 40px ${(props) => props.$color}66;

  @media (max-width: 768px) {
    font-size: 40px;
    padding: 16px 32px;
  }
`;

const ScoreUpdate = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 48px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    gap: 20px;
    padding: 16px 32px;
  }
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ScoreLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ScoreValue = styled.div`
  font-size: 48px;
  color: white;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const ScoreDivider = styled.div`
  font-size: 36px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

