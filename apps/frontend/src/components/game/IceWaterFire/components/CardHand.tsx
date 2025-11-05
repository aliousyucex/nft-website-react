import {AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import styled from 'styled-components';
import type {Card as CardType} from '../types';
import Card from './Card';

interface CardHandProps {
  cards: CardType[];
  selectedCard: CardType | null;
  onCardSelect?: (card: CardType) => void;
  disabled?: boolean;
  isOpponent?: boolean;
}

const CardHand: React.FC<CardHandProps> = ({
  cards,
  selectedCard,
  onCardSelect,
  disabled = false,
  isOpponent = false,
}) => {
  const cardCount = cards.length;
  const maxRotation = 20;
  const rotationStep = cardCount > 1 ? (maxRotation * 2) / (cardCount - 1) : 0;

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const cardSlotVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <HandContainer as={motion.div} variants={containerVariants} animate='visible'>
      <CardsWrapper as={motion.div} $cardCount={cardCount}>
        <AnimatePresence mode='popLayout'>
          {cards.map((card, index) => {
            const rotation = cardCount === 1 ? 0 : -maxRotation + index * rotationStep;
            const translateY = Math.abs(rotation) * 0.8;

            return (
              <CardSlot
                as={motion.div}
                key={card.id}
                variants={cardSlotVariants}
                layout
                $rotation={rotation}
                $translateY={translateY}
                $index={index}
                $totalCards={cardCount}
                whileHover={{
                  zIndex: cardCount + 10,
                  transition: {duration: 0.2},
                }}
              >
                <Card
                  card={card}
                  isSelected={selectedCard?.id === card.id}
                  onSelect={onCardSelect}
                  disabled={disabled}
                  isOpponent={isOpponent}
                />
              </CardSlot>
            );
          })}
        </AnimatePresence>
      </CardsWrapper>
    </HandContainer>
  );
};

export default CardHand;

const HandContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  min-height: 200px;
  max-height: 200px;

  @media (max-height: 900px) {
    padding: 8px;
    min-height: 170px;
    max-height: 170px;
  }
`;

const CardsWrapper = styled.div<{$cardCount: number}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => Math.min(props.$cardCount * 120, 600)}px;
  height: 180px;

  @media (max-height: 900px) {
    width: ${(props) => Math.min(props.$cardCount * 120, 525)}px;
    height: 150px;
  }
`;

const CardSlot = styled.div<{
  $rotation: number;
  $translateY: number;
  $index: number;
  $totalCards: number;
}>`
  position: absolute;
  left: ${(props) => (props.$index / (props.$totalCards - 1 || 1)) * 103}%;
  transform: translateX(-50%) rotate(${(props) => props.$rotation}deg)
    translateY(${(props) => props.$translateY}px);
  transform-origin: center bottom;
  z-index: ${(props) => props.$index};
`;
