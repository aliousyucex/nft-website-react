import React, { useState } from 'react';
import styled from 'styled-components';
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

  return (
    <CardWrapper
      onClick={handleClick}
      onMouseEnter={() => !disabled && !isOpponent && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      isHovered={isHovered}
      isSelected={isSelected}
      isOpponent={isOpponent}
      isRevealed={isRevealed}
      disabled={disabled}
      cardColor={getCardColor(card.type)}
    >
      {isOpponent && !isRevealed ? (
        <CardBack>
          <BackPattern>🎴</BackPattern>
        </CardBack>
      ) : (
        <CardFront>
          <CardIcon>{getCardIcon(card.type)}</CardIcon>
          <CardValue>{card.value}</CardValue>
          <CardTypea>{card.type.toUpperCase()}</CardTypea>
        </CardFront>
      )}
      {isSelected && <SelectedIndicator />}
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.div<{
  isHovered: boolean;
  isSelected: boolean;
  isOpponent: boolean;
  isRevealed: boolean;
  disabled: boolean;
  cardColor: string;
}>`
  width: 120px;
  height: 180px;
  border-radius: 12px;
  background: ${(props) => (props.isOpponent && !props.isRevealed ? '#2C3E50' : props.cardColor)};
  box-shadow: ${(props) =>
    props.isSelected
      ? `0 10px 30px ${props.cardColor}80`
      : props.isHovered
      ? '0 8px 20px rgba(0, 0, 0, 0.3)'
      : '0 4px 10px rgba(0, 0, 0, 0.2)'};
  cursor: ${(props) => (props.disabled || props.isOpponent ? 'default' : 'pointer')};
  transition: all 0.3s ease;
  transform: ${(props) =>
    props.isSelected
      ? 'translateY(-20px) scale(1.05)'
      : props.isHovered
      ? 'translateY(-10px)'
      : 'translateY(0)'};
  position: relative;
  user-select: none;

  ${(props) =>
    props.disabled &&
    !props.isSelected &&
    `
    opacity: 0.6;
    cursor: not-allowed;
  `}

  ${(props) =>
    props.isOpponent &&
    `
    transform: ${props.isRevealed ? 'rotateY(0deg)' : 'rotateY(0deg)'};
  `}
`;

const CardFront = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  border: 3px solid #3498DB;
`;

const BackPattern = styled.div`
  font-size: 48px;
  opacity: 0.6;
`;

const CardIcon = styled.div`
  font-size: 56px;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const CardTypea = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.9;
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

  &::after {
    content: '✓';
    color: white;
    font-size: 14px;
    font-weight: bold;
  }
`;

