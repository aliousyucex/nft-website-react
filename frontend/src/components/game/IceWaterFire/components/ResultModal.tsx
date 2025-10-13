import React from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'antd';
import Card from './Card';
import { Card as CardType } from '../types';

interface RoundResultProps {
  visible: boolean;
  myCard: CardType;
  opponentCard: CardType;
  result: 'win' | 'lose' | 'draw';
  myScore: number;
  opponentScore: number;
  onClose: () => void;
}

export const RoundResultModal: React.FC<RoundResultProps> = ({
  visible,
  myCard,
  opponentCard,
  result,
  myScore,
  opponentScore,
  onClose,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      closable={false}
    >
      <ResultContainer>
        <ResultTitle result={result}>
          {result === 'win' && '🎉 You Won!'}
          {result === 'lose' && '😢 You Lost!'}
          {result === 'draw' && '🤝 Draw!'}
        </ResultTitle>

        <CardsDisplay>
          <CardColumn>
            <CardLabel>Your Card</CardLabel>
            <Card card={myCard} isRevealed />
          </CardColumn>

          <VSText>VS</VSText>

          <CardColumn>
            <CardLabel>Opponent's Card</CardLabel>
            <Card card={opponentCard} isRevealed isOpponent />
          </CardColumn>
        </CardsDisplay>

        <ScoreDisplay>
          <ScoreText>
            Score: <ScoreValue>{myScore}</ScoreValue> - <ScoreValue>{opponentScore}</ScoreValue>
          </ScoreText>
        </ScoreDisplay>

        <ContinueButton type="primary" size="large" onClick={onClose}>
          Continue
        </ContinueButton>
      </ResultContainer>
    </Modal>
  );
};

interface GameResultProps {
  visible: boolean;
  result: 'win' | 'lose' | 'draw';
  finalScore: { my: number; opponent: number };
  prizeAmount?: number;
  onClose: () => void;
  onReturnToLobby: () => void;
}

export const GameResultModal: React.FC<GameResultProps> = ({
  visible,
  result,
  finalScore,
  prizeAmount,
  onClose,
  onReturnToLobby,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      closable={false}
    >
      <GameResultContainer>
        <GameResultIcon>
          {result === 'win' ? '🏆' : result === 'draw' ? '🤝' : '😔'}
        </GameResultIcon>
        
        <GameResultTitle result={result}>
          {result === 'win' ? 'Victory!' : result === 'draw' ? 'Draw!' : 'Defeat'}
        </GameResultTitle>

        <GameResultSubtitle>
          {result === 'win' 
            ? 'Congratulations! You won the game!' 
            : result === 'draw'
            ? 'The game ended in a draw!'
            : 'Better luck next time!'}
        </GameResultSubtitle>

        <FinalScoreDisplay>
          <FinalScoreLabel>Final Score</FinalScoreLabel>
          <FinalScoreValue>
            {finalScore.my} - {finalScore.opponent}
          </FinalScoreValue>
        </FinalScoreDisplay>

        {result === 'win' && prizeAmount !== undefined && (
          <PrizeDisplay>
            <PrizeIcon>💰</PrizeIcon>
            <PrizeText>You won</PrizeText>
            <PrizeAmount>{prizeAmount} ETH</PrizeAmount>
          </PrizeDisplay>
        )}

        <ButtonGroup>
          <ActionButton type="default" size="large" onClick={onReturnToLobby}>
            Return to Lobby
          </ActionButton>
        </ButtonGroup>
      </GameResultContainer>
    </Modal>
  );
};

const ResultContainer = styled.div`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ResultTitle = styled.h2<{ result: 'win' | 'lose' | 'draw' }>`
  font-size: 24px;
  margin: 0;
  color: ${(props) =>
    props.result === 'win' ? '#2ECC71' : props.result === 'lose' ? '#E74C3C' : '#3498DB'};
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CardsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transform: scale(0.7);
`;

const CardLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`;

const VSText = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.45);
`;

const ScoreDisplay = styled.div`
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
`;

const ScoreText = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
`;

const ScoreValue = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const ContinueButton = styled(Button)`
  min-width: 140px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
`;

const GameResultContainer = styled.div`
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const GameResultIcon = styled.div`
  font-size: 64px;
  animation: bounceIn 0.6s ease-out;

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const GameResultTitle = styled.h1<{ result: 'win' | 'lose' | 'draw' }>`
  font-size: 32px;
  margin: 0;
  color: ${(props) => 
    props.result === 'win' ? '#2ECC71' 
    : props.result === 'draw' ? '#3498DB'
    : '#E74C3C'};
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const GameResultSubtitle = styled.p`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  text-align: center;
`;

const FinalScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(52, 152, 219, 0.2);
`;

const FinalScoreLabel = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FinalScoreValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
`;

const PrizeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%);
  border-radius: 12px;
  border: 2px solid rgba(46, 204, 113, 0.3);
  margin-top: 8px;
`;

const PrizeIcon = styled.div`
  font-size: 28px;
`;

const PrizeText = styled.div`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.65);
`;

const PrizeAmount = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #2ECC71;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const ActionButton = styled(Button)`
  min-width: 140px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
`;

