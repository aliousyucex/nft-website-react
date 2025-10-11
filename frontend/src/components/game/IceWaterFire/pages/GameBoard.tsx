import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CardHand from '../components/CardHand';
import PlayerInfo from '../components/PlayerInfo';
import { Card, Player, EMOJIS } from '../types';

interface GameBoardProps {
  myCards: Card[];
  myPlayer: Player;
  opponentPlayer: Player;
  selectedCard: Card | null;
  opponentSelected: boolean;
  currentRound: number;
  timeRemaining: number;
  onCardSelect: (card: Card) => void;
  onSendEmoji: (emojiId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  myCards,
  myPlayer,
  opponentPlayer,
  selectedCard,
  opponentSelected,
  currentRound,
  timeRemaining,
  onCardSelect,
  onSendEmoji,
}) => {
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [receivedEmoji, setReceivedEmoji] = useState<string | null>(null);

  // Show received emoji temporarily
  useEffect(() => {
    if (receivedEmoji) {
      const timer = setTimeout(() => setReceivedEmoji(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [receivedEmoji]);

  const handleEmojiSend = (emoji: string) => {
    onSendEmoji(emoji);
    setShowEmojiPanel(false);
  };

  const isLowTime = timeRemaining <= 2;
  const canSelectCard = !selectedCard && timeRemaining > 0;

  return (
    <Container>
      <GameContainer>
        {/* Opponent Side (Top) */}
        <OpponentSide>
          <OpponentInfo>
            <PlayerInfo player={opponentPlayer} isOpponent />
          </OpponentInfo>
          
          <OpponentCards>
            <CardBackContainer count={opponentPlayer.handSize}>
              {Array.from({ length: opponentPlayer.handSize }).map((_, i) => (
                <CardBack key={i} index={i}>
                  🎴
                </CardBack>
              ))}
            </CardBackContainer>
          </OpponentCards>

          {opponentSelected && (
            <SelectionIndicator>
              <IndicatorIcon>✓</IndicatorIcon>
              Opponent Selected
            </SelectionIndicator>
          )}

          {receivedEmoji && (
            <EmojiFloat>{receivedEmoji}</EmojiFloat>
          )}
        </OpponentSide>

        {/* Middle Area - Game Info */}
        <MiddleArea>
          <RoundInfo>
            <RoundLabel>Round</RoundLabel>
            <RoundNumber>{currentRound}</RoundNumber>
          </RoundInfo>

          <ScoreBoard>
            <ScoreItem>
              <ScoreName>You</ScoreName>
              <ScoreValue>{myPlayer.roundsWon}</ScoreValue>
            </ScoreItem>
            <ScoreDivider>-</ScoreDivider>
            <ScoreItem>
              <ScoreValue>{opponentPlayer.roundsWon}</ScoreValue>
              <ScoreName>Opponent</ScoreName>
            </ScoreItem>
          </ScoreBoard>

          <TimerContainer isLowTime={isLowTime}>
            <TimerIcon>{isLowTime ? '⚠️' : '⏱️'}</TimerIcon>
            <TimerText>{timeRemaining}s</TimerText>
          </TimerContainer>
        </MiddleArea>

        {/* Player Side (Bottom) */}
        <PlayerSide>
          <PlayerInfoa>
            <PlayerInfo player={myPlayer} />
          </PlayerInfoa>

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
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const GameContainer = styled.div`
  width: 100%;
  max-width: 1920px;
  height: 980px;
  max-height: 90vh;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  gap: 20px;
  position: relative;

  @media (max-width: 1280px) {
    height: 720px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 600px;
  }
`;

const OpponentSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 20px;
  background: linear-gradient(180deg, rgba(231, 76, 60, 0.1) 0%, transparent 100%);
  border-radius: 20px;
`;

const OpponentInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const OpponentCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardBackContainer = styled.div<{ count: number }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => Math.min(props.count * 60, 300)}px;
  height: 100px;
`;

const CardBack = styled.div<{ index: number }>`
  position: absolute;
  left: ${(props) => props.index * 50}px;
  width: 80px;
  height: 120px;
  background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%);
  border: 3px solid #3498DB;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  opacity: 0.8;
  transform: rotate(${(props) => (props.index - 2) * 5}deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
  font-size: 120px;
  animation: floatUp 3s ease-out forwards;
  pointer-events: none;
  z-index: 100;

  @keyframes floatUp {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -200%) scale(0.8);
    }
  }
`;

const MiddleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const RoundInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const RoundLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const RoundNumber = styled.div`
  font-size: 36px;
  color: white;
  font-weight: bold;
`;

const ScoreBoard = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ScoreName = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
`;

const ScoreValue = styled.div`
  font-size: 48px;
  color: white;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const ScoreDivider = styled.div`
  font-size: 36px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
`;

const TimerContainer = styled.div<{ isLowTime: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: ${(props) => (props.isLowTime ? 'rgba(231, 76, 60, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border: 2px solid ${(props) => (props.isLowTime ? '#E74C3C' : 'rgba(255, 255, 255, 0.2)')};
  border-radius: 12px;
  animation: ${(props) => (props.isLowTime ? 'urgentPulse 0.5s infinite' : 'none')};

  @keyframes urgentPulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const TimerIcon = styled.span`
  font-size: 24px;
`;

const TimerText = styled.div`
  font-size: 32px;
  color: white;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  min-width: 60px;
  text-align: center;
`;

const PlayerSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 20px;
  background: linear-gradient(180deg, transparent 0%, rgba(46, 204, 113, 0.1) 100%);
  border-radius: 20px;
`;

const PlayerInfoa = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MyCards = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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

