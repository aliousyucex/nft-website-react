import {motion} from 'framer-motion';
import type React from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import type {Card as CardType} from '../types';

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
      y: -8,
    },
    selected: {
      y: -15,
      scale: 1,
    },
  };

  return (
    <CardWrapper
      as={motion.div}
      variants={cardVariants}
      initial='initial'
      animate={isSelected ? 'selected' : 'animate'}
      whileHover={!disabled && !isOpponent ? 'hover' : undefined}
      whileTap={!disabled && !isOpponent ? 'tap' : undefined}
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
      <CardFront>
            <CardFrontImage
              src={`/cards/${card.type}_${card.value}.jpg`}
              alt={`${card.type} ${card.value}`}
            />
        </CardFront>
      {isSelected && <SelectedIndicator />}
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
  width: 120px;
  height: 180px;
  border-radius: 12px;
  cursor: ${(props) => (props.$disabled || props.$isOpponent ? 'default' : 'pointer')};
  position: relative;
  user-select: none;
  perspective: 1000px;
  transform-style: preserve-3d;

  @media (max-height: 900px) {
    width: 100px;
    height: 150px;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 120px;
    border-radius: 10px;
  }

  ${(props) =>
    props.$disabled &&
    !props.$isSelected &&
    `
    cursor: not-allowed;
  `}
`;

const CardFront = styled.div`
  width: 120px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  position: relative;

  @media (max-width: 768px) {
    width: 80px;
    height: 120px;
  }
`;

const CardFrontImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 180px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 80px;
    height: 120px;
  }
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
