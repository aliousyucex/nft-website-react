import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isOpponent?: boolean;
  isRevealed?: boolean;
  onSelect?: (card: CardType) => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  isSelected = false,
  isOpponent = false,
  isRevealed = false,
  onSelect,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [backImageError, setBackImageError] = useState(false);

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

  const handleClick = () => {
    if (!disabled && !isOpponent && onSelect) {
      onSelect(card);
    }
  };

  const cardVariants = {
    initial: { 
      scale: 0,
    },
    animate: { 
      scale: 1,
      opacity: 1,
      rotateY: 0,
    },
    hover: {
      y: -20,
      scale: 1.05,
      boxShadow: `0 15px 35px ${getCardColor(card.type)}60`,
    },
    selected: {
      y: -30,
      scale: 1.1,
      boxShadow: `0 20px 40px ${getCardColor(card.type)}90`,
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <CardWrapper
      as={motion.div}
      variants={cardVariants}
      initial="initial"
      animate={isSelected ? "selected" : "animate"}
      whileHover={!disabled && !isOpponent ? "hover" : undefined}
      whileTap={!disabled && !isOpponent ? "tap" : undefined}
      onClick={handleClick}
      onMouseEnter={() => !disabled && !isOpponent && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      $isHovered={isHovered}
      $isSelected={isSelected}
      $isOpponent={isOpponent}
      $isRevealed={isRevealed}
      $disabled={disabled}
      $cardColor={getCardColor(card.type)}
    >
      {isOpponent && !isRevealed ? (
        <CardBack
          $hasImage={!backImageError}
        >
          {!backImageError ? (
            <CardBackImage
              src="/cards/card_back.jpg"
              alt="Card back"
              onError={() => setBackImageError(true)}
            />
          ) : (
            <BackPattern>
              🎴
            </BackPattern>
          )}
        </CardBack>
      ) : (
        <CardFront
          $hasImage={!imageError}
          $cardType={card.type}
          $cardValue={card.value}
        >
          {!imageError && (
            <CardFrontImage
              src={`/cards/${card.type}_${card.value}.jpg`}
              alt={`${card.type} ${card.value}`}
              onError={() => setImageError(true)}
            />
          )}
          <CardOverlay />
          <CardContent>
            {imageError && (
              <CardIcon>
                {getCardIcon(card.type)}
              </CardIcon>
            )}
            <CardValue>
              {card.value}
            </CardValue>
            <CardTypea>
              {card.type.toUpperCase()}
            </CardTypea>
          </CardContent>
        </CardFront>
      )}
      {isSelected && (
        <SelectedIndicator />
      )}
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.div<{
  $isHovered: boolean;
  $isSelected: boolean;
  $isOpponent: boolean;
  $isRevealed: boolean;
  $disabled: boolean;
  $cardColor: string;
}>`
  width: 100px;
  height: 150px;
  border-radius: 12px;
  background: ${(props) => (props.$isOpponent && !props.$isRevealed ? '#8B0000' : props.$cardColor)};
  cursor: ${(props) => (props.$disabled || props.$isOpponent ? 'default' : 'pointer')};
  position: relative;
  user-select: none;
  perspective: 1000px;
  transform-style: preserve-3d;

  @media (max-height: 900px) {
    width: 85px;
    height: 128px;
  }

  ${(props) =>
    props.$disabled &&
    !props.$isSelected &&
    `
    cursor: not-allowed;
  `}
`;

const CardFront = styled.div<{
  $hasImage?: boolean;
  $cardType?: string;
  $cardValue?: number;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  border-radius: 12px;
`;

const CardBack = styled.div<{ $hasImage?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #8B0000 0%, #B22222 100%)'};
  border: 3px solid #DC143C;
  position: relative;
  border-radius: 12px;
`;

const BackPattern = styled.div`
  font-size: 48px;
  opacity: 0.6;
`;

const CardIcon = styled.div`
  font-size: 48px;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

  @media (max-height: 900px) {
    font-size: 40px;
    margin-bottom: 4px;
  }
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;

  @media (max-height: 900px) {
    font-size: 24px;
    margin-bottom: 2px;
  }
`;

const CardTypea = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.9;

  @media (max-height: 900px) {
    font-size: 10px;
  }
`;

const CardFrontImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
`;

const CardBackImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2ECC71;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &::after {
    content: '✓';
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
`;

