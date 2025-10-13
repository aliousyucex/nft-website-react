import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType, RoundHistoryItem } from '../types';

interface RoundHistoryProps {
  history: RoundHistoryItem[];
}

const RoundHistory: React.FC<RoundHistoryProps> = ({ history}) => {
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

  const getResultIcon = (result: 'win' | 'lose' | 'draw') => {
    switch (result) {
      case 'win':
        return '✓';
      case 'lose':
        return '✗';
      case 'draw':
        return '=';
    }
  };

  const getResultColor = (result: 'win' | 'lose' | 'draw') => {
    switch (result) {
      case 'win':
        return '#2ECC71';
      case 'lose':
        return '#E74C3C';
      case 'draw':
        return '#F39C12';
    }
  };

  return (
    <AnimatePresence>
            <Content>
              {history.length === 0 ? (
                <EmptyState
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <EmptyIcon>📋</EmptyIcon>
                  <EmptyText>No rounds played yet</EmptyText>
                </EmptyState>
              ) : (
                <HistoryList>
                  {history.map((item, index) => {
                    // Skip items with missing card data
                    if (!item.myCard || !item.opponentCard) {
                      return null;
                    }
                    
                    return (
                      <HistoryItem
                        key={item.round}
                        as={motion.div}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, x: -5 }}
                        $result={item.result}
                      >
                        <RoundNumber $result={item.result}>
                          Round {item.round}
                        </RoundNumber>

                        <CardsDisplay>
                          <MiniCard $color={getCardColor(item.myCard.type)}>
                            <CardIcon>{getCardIcon(item.myCard.type)}</CardIcon>
                            <CardValue>{item.myCard.value}</CardValue>
                          </MiniCard>

                          <VSText>vs</VSText>

                          <MiniCard $color={getCardColor(item.opponentCard.type)}>
                            <CardIcon>{getCardIcon(item.opponentCard.type)}</CardIcon>
                            <CardValue>{item.opponentCard.value}</CardValue>
                          </MiniCard>
                        </CardsDisplay>

                      <ResultBadge $color={getResultColor(item.result)}>
                        <ResultIcon>{getResultIcon(item.result)}</ResultIcon>
                        <ResultText>{item.result.toUpperCase()}</ResultText>
                      </ResultBadge>
                    </HistoryItem>
                    );
                  })}
                </HistoryList>
              )}
            </Content>
    </AnimatePresence>
  );
};

export default RoundHistory;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryItem = styled.div<{ $result: 'win' | 'lose' | 'draw' }>`
  background: ${(props) =>
    props.$result === 'win'
      ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.15) 0%, rgba(46, 204, 113, 0.05) 100%)'
      : props.$result === 'lose'
      ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.15) 0%, rgba(231, 76, 60, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(243, 156, 18, 0.15) 0%, rgba(243, 156, 18, 0.05) 100%)'};
  border: 1px solid
    ${(props) =>
      props.$result === 'win'
        ? 'rgba(46, 204, 113, 0.3)'
        : props.$result === 'lose'
        ? 'rgba(231, 76, 60, 0.3)'
        : 'rgba(243, 156, 18, 0.3)'};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: default;
  transition: all 0.2s ease;
`;

const RoundNumber = styled.div<{ $result: 'win' | 'lose' | 'draw' }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) =>
    props.$result === 'win' ? '#2ECC71' : props.$result === 'lose' ? '#E74C3C' : '#F39C12'};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardsDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const MiniCard = styled.div<{ $color: string }>`
  flex: 1;
  background: ${(props) => props.$color};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const CardIcon = styled.div`
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const CardValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const VSText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
`;

const ResultBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${(props) => props.$color}20;
  border: 1px solid ${(props) => props.$color};
  border-radius: 8px;
  align-self: flex-start;
`;

const ResultIcon = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const ResultText = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

