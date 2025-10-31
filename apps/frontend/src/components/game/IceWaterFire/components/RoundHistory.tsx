import {AnimatePresence, motion} from 'framer-motion';
import type React from 'react';
import styled from 'styled-components';
import type {RoundHistoryItem} from '../types';

interface RoundHistoryProps {
  history: RoundHistoryItem[];
}

// round number desc şekilde sıralanmalı last round first olacak.

const RoundHistory: React.FC<RoundHistoryProps> = ({history}) => {
  return (
    <AnimatePresence>
      <Content>
        {history.length === 0 ? (
          <EmptyState as={motion.div} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>No rounds played yet</EmptyText>
          </EmptyState>
        ) : (
          <HistoryList>
            {[...history].reverse().map((item, index) => {
              // Skip items with missing card data
              if (!item.myCard || !item.opponentCard) {
                return null;
              }

              return (
                <HistoryItem
                  key={item.round}
                  as={motion.div}
                  initial={{opacity: 0, x: 50}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: index * 0.05}}
                  whileHover={{scale: 1.02, x: -5}}
                  $result={item.result}
                >
                  <RoundNumber $result={item.result}>Round {item.round}</RoundNumber>

                  <CardsDisplay>
                    <MiniCard>
                      <CardFrontImage
                        src={`/cards/${item.myCard.type}_${item.myCard.value}.jpg`}
                        alt={`${item.myCard.type} ${item.myCard.value}`}
                      />
                    </MiniCard>

                    <VSText>vs</VSText>

                    <MiniCard>
                    <CardFrontImage
                        src={`/cards/${item.opponentCard.type}_${item.opponentCard.value}.jpg`}
                        alt={`${item.opponentCard.type} ${item.opponentCard.value}`}
                      />
                    </MiniCard>
                  </CardsDisplay>
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

const CardFrontImage = styled.img`
  height: 100px;
  width: 66px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
`;

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

const HistoryItem = styled.div<{$result: 'win' | 'lose' | 'draw'}>`
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

const RoundNumber = styled.div<{$result: 'win' | 'lose' | 'draw'}>`
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

const MiniCard = styled.div`
  flex: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VSText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: bold;
`;
