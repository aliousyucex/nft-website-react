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

  @media (max-width: 768px) {
    min-height: 240px;
    max-height: 240px;
    padding: 5px;
  }
`;

const CardsWrapper = styled.div<{$cardCount: number}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => Math.min(props.$cardCount * 125, 600)}px;
  height: 180px;

  @media (max-height: 900px) {
    width: ${(props) => Math.min(props.$cardCount * 125, 525)}px;
    height: 180px;
  }

  @media (max-width: 768px) {
    /* Mobile: use grid for better control */
    position: static;
    display: grid;
    justify-items: center;
    align-items: start;
    gap: 30px;
    width: 100%;
    height: auto;
    padding: 0 10px;
    
    /* 5 cards: 3 top, 2 bottom - use 6 columns for better centering */
    ${(props) => props.$cardCount === 5 && `
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: auto auto;
      min-height: 240px;
      width: 320px;
    `}
    
    /* 4 cards: 2x2 grid */
    ${(props) => props.$cardCount === 4 && `
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, auto);
      min-height: 240px;
      width: 100%;
    `}
    
    /* 3 cards: single row */
    ${(props) => props.$cardCount === 3 && `
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto;
      min-height: 130px;
      width: 100%;
    `}
    
    /* 2 cards: single row */
    ${(props) => props.$cardCount === 2 && `
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
      min-height: 130px;
      width: 100%;
    `}
    
    /* 1 card: centered */
    ${(props) => props.$cardCount === 1 && `
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      min-height: 130px;
      width: 100%;
    `}
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

  @media (max-width: 768px) {
    /* Mobile: reset positioning for grid layout */
    position: static;
    transform: none !important;
    left: auto;
    width: 100%;
    max-width: 100%;
    
    /* 5 cards: position cards in 6-column grid */
    ${(props) => props.$totalCards === 5 && `
      /* First 3 cards: top row, each spans 2 columns */
      &:nth-child(1) {
        grid-column: 1 / 3;
        grid-row: 1;
      }
      &:nth-child(2) {
        grid-column: 3 / 5;
        grid-row: 1;
      }
      &:nth-child(3) {
        grid-column: 5 / 7;
        grid-row: 1;
      }
      /* Last 2 cards: bottom row, centered (columns 2-3 and 4-5) */
      &:nth-child(4) {
        grid-column: 2 / 4;
        grid-row: 2;
      }
      &:nth-child(5) {
        grid-column: 4 / 6;
        grid-row: 2;
      }
    `}
  }
`;
