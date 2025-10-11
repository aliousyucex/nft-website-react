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
      width={600}
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
  result: 'win' | 'lose';
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
      width={700}
      closable={false}
    >
      <GameResultContainer>
        <GameResultIcon>{result === 'win' ? '🏆' : '😔'}</GameResultIcon>
        
        <GameResultTitle result={result}>
          {result === 'win' ? 'Victory!' : 'Defeat'}
        </GameResultTitle>

        <GameResultSubtitle>
          {result === 'win' ? 'Congratulations! You won the game!' : 'Better luck next time!'}
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
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const ResultTitle = styled.h2<{ result: 'win' | 'lose' | 'draw' }>`
  font-size: 36px;
  margin: 0;
  color: ${(props) =>
    props.result === 'win' ? '#2ECC71' : props.result === 'lose' ? '#E74C3C' : '#3498DB'};
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const CardsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  justify-content: center;
`;

const CardColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const CardLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
`;

const VSText = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.45);
`;

const ScoreDisplay = styled.div`
  padding: 16px 32px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
`;

const ScoreText = styled.div`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
`;

const ScoreValue = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

const ContinueButton = styled(Button)`
  min-width: 200px;
  height: 48px;
  font-size: 18px;
  font-weight: 600;
`;

const GameResultContainer = styled.div`
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const GameResultIcon = styled.div`
  font-size: 120px;
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

const GameResultTitle = styled.h1<{ result: 'win' | 'lose' }>`
  font-size: 48px;
  margin: 0;
  color: ${(props) => (props.result === 'win' ? '#2ECC71' : '#E74C3C')};
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const GameResultSubtitle = styled.p`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  text-align: center;
`;

const FinalScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 48px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(52, 152, 219, 0.2);
`;

const FinalScoreLabel = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const FinalScoreValue = styled.div`
  font-size: 56px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
`;

const PrizeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 48px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(46, 204, 113, 0.3);
  margin-top: 8px;
`;

const PrizeIcon = styled.div`
  font-size: 48px;
`;

const PrizeText = styled.div`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
`;

const PrizeAmount = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #2ECC71;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const ActionButton = styled(Button)`
  min-width: 180px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
`;

