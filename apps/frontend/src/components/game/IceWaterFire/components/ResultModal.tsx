import {Button, Modal} from 'antd';
import type React from 'react';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useAccount} from 'wagmi';
import type {Card as CardType} from '../types';
import Card from './Card';

// Auto-redirect timeout: 5 seconds for testing (comment indicates 45 seconds for production)
const AUTO_REDIRECT_TIMEOUT_MS = 30 * 1000; // TODO: Change to 45 * 1000 for production

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
    <Modal open={visible} onCancel={onClose} footer={null} centered width={450} closable={false}>
      <ResultContainer>
        <ResultTitle result={result}>
          {result === 'win' && '🎉 You Won!'}
          {result === 'lose' && '😢 You Lost!'}
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

        <ContinueButton type='primary' size='large' onClick={onClose}>
          Continue
        </ContinueButton>
      </ResultContainer>
    </Modal>
  );
};

interface GameResultProps {
  visible: boolean;
  result: 'win' | 'lose' | 'draw';
  finalScore: {my: number; opponent: number};
  prizeAmount?: number;
  betAmount: number;
  onClose: () => void;
  onReturnToLobby: () => void;
  onPlayAgain?: () => void;
  isPaidGame?: boolean;
  reason?: string; // Reason for game end (e.g. 'both_afk', 'afk_forfeit', etc.)
  isSinglePlayer?: boolean;
  afkPlayerAddresses?: string[];
  currentUserAddress?: string;
}

export const GameResultModal: React.FC<GameResultProps> = ({
  visible,
  result,
  finalScore,
  prizeAmount,
  betAmount,
  onClose: _onClose, // Not used - modal is not closable
  onReturnToLobby,
  onPlayAgain,
  isPaidGame = true,
  isSinglePlayer = false,
  afkPlayerAddresses = [],
  currentUserAddress = '',
}) => {
  const isFreeGame = betAmount === 0 || !isPaidGame;
  const {isConnected} = useAccount();
  const [timeRemaining, setTimeRemaining] = useState(AUTO_REDIRECT_TIMEOUT_MS / 1000);

  // Helper functions to determine AFK status
  const isCurrentUserAfk = afkPlayerAddresses.some(
    (addr) => addr.toLowerCase() === currentUserAddress.toLowerCase()
  );
  const isBothPlayersAfk = !isSinglePlayer && afkPlayerAddresses.length >= 2;
  const isOpponentAfk = afkPlayerAddresses.length > 0 && !isCurrentUserAfk;

  // Determine title color type
  const determineTitleColor = (): 'win' | 'lose' | 'neutral' => {
    if (isBothPlayersAfk) return 'lose'; // Both lose - red
    if (isCurrentUserAfk) return 'lose'; // Current user loses - red
    if (isOpponentAfk) {
      // Opponent AFK, user was behind in paid game = refund scenario = neutral
      if (isPaidGame && finalScore.my < finalScore.opponent) {
        return 'neutral';
      }
      return 'win'; // Otherwise it's a win - green
    }
    // Normal game end
    return result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'neutral';
  };

  // Determine title text
  const determineTitleText = (): string => {
    if (isBothPlayersAfk) return 'Both Players AFK';
    if (isCurrentUserAfk) return 'AFK Forfeit';
    if (isOpponentAfk) return 'Victory!';
    // Normal game end
    return result === 'win' ? 'Victory!' : 'Defeat';
  };

  // Determine subtitle text
  const determineSubtitleText = (): string => {
    // Single Player mode
    if (isSinglePlayer) {
      if (isCurrentUserAfk) return 'You were AFK. Game ended with no winner.';
      if (result === 'win') return 'Great job! Keep practicing!';
      return 'Better luck next time!';
    }

    // Multiplayer mode (free or paid)
    if (isBothPlayersAfk) return 'Both players were repeatedly AFK. Game ended with no winner.';
    if (isCurrentUserAfk) return 'You were AFK. Game ended with no winner.';
    if (isOpponentAfk) return 'Your opponent was AFK. You win by forfeit!';

    // Normal game end
    if (result === 'win') {
      return isPaidGame ? 'Congratulations! You won the game!' : 'Great job! Keep practicing!';
    }
    return 'Better luck next time!';
  };

  const titleColor = determineTitleColor();
  const titleText = determineTitleText();
  const subTitleText = determineSubtitleText();

  // Auto-redirect timer
  useEffect(() => {
    if (!visible) {
      setTimeRemaining(AUTO_REDIRECT_TIMEOUT_MS / 1000);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-redirect to lobby
          onReturnToLobby();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [visible, onReturnToLobby]);

  const handlePlayAgain = () => {
    setTimeRemaining(AUTO_REDIRECT_TIMEOUT_MS / 1000);
    if (onPlayAgain) {
      onPlayAgain();
    }
  };

  const handleReturnToLobby = () => {
    setTimeRemaining(AUTO_REDIRECT_TIMEOUT_MS / 1000);
    onReturnToLobby();
  };

  return (
    <Modal
      open={visible}
      footer={null}
      centered
      width={500}
      closable={false}
      maskClosable={false}
      onCancel={undefined}
    >
      <GameResultContainer>
        <GameResultTitle result={titleColor}>{titleText}</GameResultTitle>

        {isFreeGame && <PracticeGameBadge>⚡ Practice Game</PracticeGameBadge>}

        <GameResultSubtitle>{subTitleText}</GameResultSubtitle>

        {!isFreeGame &&
          !isBothPlayersAfk &&
          !isCurrentUserAfk &&
          (result === 'win' || isOpponentAfk) &&
          prizeAmount !== undefined && <PrizeAmount>+{prizeAmount} MON</PrizeAmount>}
        {!isFreeGame &&
          (isBothPlayersAfk || isCurrentUserAfk || (result === 'lose' && !isOpponentAfk)) &&
          betAmount > 0 && <LoseAmount>-{betAmount} MON</LoseAmount>}

        <FinalScoreDisplay>
          <FinalScoreLabel>Final Score</FinalScoreLabel>
          <FinalScoreValue>
            {finalScore.my} - {finalScore.opponent}
          </FinalScoreValue>
        </FinalScoreDisplay>

        {isFreeGame && !isConnected && (
          <ConnectWalletHint>
            💡 Connect wallet to play for MON and rank on leaderboard
          </ConnectWalletHint>
        )}

        <TimerDisplay>
          Redirecting to lobby in {timeRemaining}s...
        </TimerDisplay>

        <ButtonGroup>
          {onPlayAgain && (
            <ActionButton type='primary' size='large' onClick={handlePlayAgain}>
              Play Again
            </ActionButton>
          )}
          <ActionButton type='default' size='large' onClick={handleReturnToLobby}>
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

const ResultTitle = styled.h2<{result: 'win' | 'lose' | 'draw'}>`
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

const GameResultTitle = styled.h1<{result: 'win' | 'lose' | 'neutral'}>`
  font-size: 32px;
  margin: 0;
  color: ${(props) =>
    props.result === 'win'
      ? '#2ECC71'
      : props.result === 'neutral'
        ? 'rgba(0, 0, 0, 0.85)'
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

const PrizeAmount = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #2ECC71;
`;

const LoseAmount = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #E74C3C;
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

const PracticeGameBadge = styled.div`
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
`;

const ConnectWalletHint = styled.div`
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
`;

const TimerDisplay = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-style: italic;
`;
