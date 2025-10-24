import {AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import {useState} from 'react';
import styled from 'styled-components';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({visible, onClose}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: '🎴 Welcome to Ice Water Fire!',
      description: 'A strategic card game where you battle with 9 unique cards.',
      content: (
        <ContentWrapper>
          <HighlightBox>
            <HighlightTitle>🎯 Goal</HighlightTitle>
            <HighlightText>Be the first to win 3 rounds!</HighlightText>
          </HighlightBox>
          <InfoText>
            Each player has their own deck of 9 cards with different types and values.
          </InfoText>
        </ContentWrapper>
      ),
    },
    {
      title: '⚔️ Card Types & Rules',
      description: 'Learn the type advantages',
      content: (
        <ContentWrapper>
          <RulesGrid>
            <RuleCard $color='#FF6B6B'>
              <RuleIcon>🔥</RuleIcon>
              <RuleText>Fire beats Ice</RuleText>
            </RuleCard>
            <RuleCard $color='#45B7D1'>
              <RuleIcon>💧</RuleIcon>
              <RuleText>Water beats Fire</RuleText>
            </RuleCard>
            <RuleCard $color='#4ECDC4'>
              <RuleIcon>❄️</RuleIcon>
              <RuleText>Ice beats Water</RuleText>
            </RuleCard>
          </RulesGrid>
          <InfoText>If both players choose the same type, the higher value wins!</InfoText>
          <ExampleBox>
            <ExampleTitle>Example:</ExampleTitle>
            <ExampleText>🔥 Fire 7 beats 🔥 Fire 3</ExampleText>
          </ExampleBox>
        </ContentWrapper>
      ),
    },
    {
      title: '🎲 How Cards Work',
      description: 'Card distribution and usage',
      content: (
        <ContentWrapper>
          <StepList>
            <StepItem>
              <StepNumber>1</StepNumber>
              <StepText>Start with 5 random cards from your 9-card deck</StepText>
            </StepItem>
            <StepItem>
              <StepNumber>2</StepNumber>
              <StepText>Select one card each round (10 seconds timer)</StepText>
            </StepItem>
            <StepItem>
              <StepNumber>3</StepNumber>
              <StepText>Used cards are removed from your deck</StepText>
            </StepItem>
            <StepItem>
              <StepNumber>4</StepNumber>
              <StepText>After using 5 cards, you receive your remaining 4 cards</StepText>
            </StepItem>
            <StepItem>
              <StepNumber>5</StepNumber>
              <StepText>After all 9 cards are used, the deck reshuffles</StepText>
            </StepItem>
          </StepList>
          <WarningBox>
            <WarningIcon>⚠️</WarningIcon>
            <WarningText>
              In case of a draw, cards are still consumed but no points are awarded!
            </WarningText>
          </WarningBox>
        </ContentWrapper>
      ),
    },
    {
      title: '⏱️ Time & Penalties',
      description: 'Stay active and strategic',
      content: (
        <ContentWrapper>
          <TimerBox>
            <TimerIcon>⏰</TimerIcon>
            <TimerText>10 seconds per round</TimerText>
          </TimerBox>
          <PenaltyList>
            <PenaltyItem>
              <PenaltyIcon>🔴</PenaltyIcon>
              <PenaltyText>
                <strong>AFK Penalty:</strong> 3 consecutive timeouts = automatic forfeit
              </PenaltyText>
            </PenaltyItem>
            <PenaltyItem>
              <PenaltyIcon>⏳</PenaltyIcon>
              <PenaltyText>
                <strong>Disconnect:</strong> 10 seconds to reconnect, or you forfeit and lose your
                bet
              </PenaltyText>
            </PenaltyItem>
            <PenaltyItem>
              <PenaltyIcon>🎯</PenaltyIcon>
              <PenaltyText>
                <strong>Round Limit:</strong> Game ends after 15 rounds - highest score wins
              </PenaltyText>
            </PenaltyItem>
          </PenaltyList>
        </ContentWrapper>
      ),
    },
    {
      title: '💰 Betting & Rewards',
      description: 'Stakes and winnings',
      content: (
        <ContentWrapper>
          <BetBox>
            <BetIcon>💎</BetIcon>
            <BetTitle>Minimum Bet: 0.001 ETH</BetTitle>
            <BetText>No maximum limit - bet what you want!</BetText>
          </BetBox>
          <CommissionBox>
            <CommissionIcon>📊</CommissionIcon>
            <CommissionText>3% commission is deducted from winnings</CommissionText>
          </CommissionBox>
          <RewardList>
            <RewardItem>
              <RewardIcon>🏆</RewardIcon>
              <RewardText>Winner takes the pot (minus 3% commission)</RewardText>
            </RewardItem>
            <RewardItem>
              <RewardIcon>💪</RewardIcon>
              <RewardText>Earn leaderboard points: 7 (3-0), 5 (3-1), 3 (3-2)</RewardText>
            </RewardItem>
          </RewardList>
        </ContentWrapper>
      ),
    },
    {
      title: '🎮 Ready to Play!',
      description: 'Good luck and have fun!',
      content: (
        <ContentWrapper>
          <FinalBox>
            <FinalIcon>✨</FinalIcon>
            <FinalTitle>You're all set!</FinalTitle>
            <FinalText>
              Create a room, set your bet, and challenge your friends. May the best strategist win!
            </FinalText>
          </FinalBox>
          <QuickTips>
            <TipTitle>💡 Quick Tips:</TipTitle>
            <TipItem>• Use emojis to communicate with your opponent</TipItem>
            <TipItem>• Check round history during the game</TipItem>
            <TipItem>• Save your high-value cards for crucial moments</TipItem>
            <TipItem>• Watch the timer - don't let it run out!</TipItem>
          </QuickTips>
          <CheckboxWrapper>
            <Checkbox
              type='checkbox'
              id='dontShowAgain'
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <CheckboxLabel htmlFor='dontShowAgain'>Don't show this tutorial again</CheckboxLabel>
          </CheckboxWrapper>
        </ContentWrapper>
      ),
    },
  ];

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorialCompleted', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <Overlay
          as={motion.div}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          onClick={handleClose}
        >
          <Modal
            as={motion.div}
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            transition={{type: 'spring', damping: 25, stiffness: 200}}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton
              as={motion.button}
              whileHover={{scale: 1.1, rotate: 90}}
              whileTap={{scale: 0.9}}
              onClick={handleClose}
            >
              ✕
            </CloseButton>

            <ProgressBar>
              <ProgressFill
                as={motion.div}
                initial={{width: 0}}
                animate={{width: `${progress}%`}}
                transition={{duration: 0.3}}
              />
            </ProgressBar>

            <Content>
              <AnimatePresence mode='wait'>
                <StepContent
                  key={currentStep}
                  as={motion.div}
                  initial={{opacity: 0, x: 50}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -50}}
                  transition={{duration: 0.3}}
                >
                  <StepTitle>{steps[currentStep].title}</StepTitle>
                  <StepDescription>{steps[currentStep].description}</StepDescription>
                  {steps[currentStep].content}
                </StepContent>
              </AnimatePresence>
            </Content>

            <Footer>
              <StepIndicator>
                {currentStep + 1} / {steps.length}
              </StepIndicator>
              <ButtonGroup>
                {currentStep > 0 && (
                  <NavButton
                    as={motion.button}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={handlePrev}
                    $variant='secondary'
                  >
                    ← Previous
                  </NavButton>
                )}
                <NavButton
                  as={motion.button}
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  onClick={handleNext}
                  $variant='primary'
                >
                  {currentStep < steps.length - 1 ? 'Next →' : 'Start Playing! 🚀'}
                </NavButton>
              </ButtonGroup>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 0;
  
  @media (min-height: 900px) {
    align-items: center;
    padding: 20px 0;
  }
`;

const Modal = styled.div`
  position: relative;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(30, 34, 42, 0.98) 0%, rgba(20, 24, 32, 0.98) 100%);
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: auto 0;
  
  @media (max-height: 800px) {
    max-height: 95vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.3);
    border-color: #e74c3c;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4 0%, #45b7d1 100%);
  border-radius: 0 4px 4px 0;
`;

const Content = styled.div`
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  min-height: 0;

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

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
  
  @media (max-height: 800px) {
    padding: 24px 32px;
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StepTitle = styled.h2`
  font-size: 32px;
  color: white;
  margin: 0;
  text-align: center;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StepDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(69, 183, 209, 0.2) 100%);
  border: 2px solid rgba(78, 205, 196, 0.5);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const HighlightTitle = styled.h3`
  font-size: 20px;
  color: #4ecdc4;
  margin: 0 0 8px 0;
`;

const HighlightText = styled.p`
  font-size: 18px;
  color: white;
  margin: 0;
  font-weight: 600;
`;

const InfoText = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0;
  line-height: 1.6;
`;

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const RuleCard = styled.div<{$color: string}>`
  background: ${(props) => props.$color}20;
  border: 2px solid ${(props) => props.$color};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const RuleIcon = styled.div`
  font-size: 48px;
`;

const RuleText = styled.div`
  font-size: 14px;
  color: white;
  font-weight: 600;
  text-align: center;
`;

const ExampleBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
`;

const ExampleTitle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ExampleText = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 600;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StepText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const WarningBox = styled.div`
  background: rgba(243, 156, 18, 0.15);
  border: 2px solid #f39c12;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WarningIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const WarningText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
`;

const TimerBox = styled.div`
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.2) 0%, rgba(230, 126, 34, 0.2) 100%);
  border: 2px solid #f39c12;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const TimerIcon = styled.div`
  font-size: 48px;
`;

const TimerText = styled.div`
  font-size: 24px;
  color: white;
  font-weight: bold;
`;

const PenaltyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PenaltyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
`;

const PenaltyIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const PenaltyText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;

  strong {
    color: white;
    font-weight: 600;
  }
`;

const BetBox = styled.div`
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(142, 68, 173, 0.2) 100%);
  border: 2px solid #9b59b6;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const BetIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const BetTitle = styled.h3`
  font-size: 20px;
  color: white;
  margin: 0 0 8px 0;
`;

const BetText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const CommissionBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CommissionIcon = styled.div`
  font-size: 24px;
`;

const CommissionText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const RewardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 12px;
  padding: 16px;
`;

const RewardIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const RewardText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
`;

const FinalBox = styled.div`
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(39, 174, 96, 0.2) 100%);
  border: 2px solid #2ecc71;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
`;

const FinalIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const FinalTitle = styled.h3`
  font-size: 24px;
  color: white;
  margin: 0 0 12px 0;
`;

const FinalText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
`;

const QuickTips = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
`;

const TipTitle = styled.h4`
  font-size: 16px;
  color: white;
  margin: 0 0 12px 0;
`;

const TipItem = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 16px 24px;
    flex-direction: column;
    gap: 16px;
  }
`;

const StepIndicator = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const NavButton = styled.button<{$variant: 'primary' | 'secondary'}>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${(props) =>
    props.$variant === 'primary'
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: ${(props) => (props.$variant === 'primary' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)')};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${(props) => (props.$variant === 'primary' ? 'rgba(78, 205, 196, 0.4)' : 'rgba(255, 255, 255, 0.1)')};
  }
`;
