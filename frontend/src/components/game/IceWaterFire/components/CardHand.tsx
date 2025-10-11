import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import { Card as CardType } from '../types';

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

  return (
    <HandContainer>
      <CardsWrapper cardCount={cardCount}>
        {cards.map((card, index) => {
          const rotation = cardCount === 1 ? 0 : -maxRotation + index * rotationStep;
          const translateY = Math.abs(rotation) * 0.8;

          return (
            <CardSlot
              key={card.id}
              rotation={rotation}
              translateY={translateY}
              index={index}
              totalCards={cardCount}
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
      </CardsWrapper>
    </HandContainer>
  );
};

export default CardHand;

const HandContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px;
  min-height: 250px;
`;

const CardsWrapper = styled.div<{ cardCount: number }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: ${(props) => Math.min(props.cardCount * 140, 700)}px;
  height: 220px;
`;

const CardSlot = styled.div<{
  rotation: number;
  translateY: number;
  index: number;
  totalCards: number;
}>`
  position: absolute;
  left: ${(props) => (props.index / (props.totalCards - 1 || 1)) * 100}%;
  transform: translateX(-50%) rotate(${(props) => props.rotation}deg)
    translateY(${(props) => props.translateY}px);
  transform-origin: center bottom;
  transition: all 0.3s ease;
  z-index: ${(props) => props.index};

  &:hover {
    z-index: ${(props) => props.totalCards + 1};
  }
`;

