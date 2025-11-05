import {Modal} from 'antd';
import {motion} from 'framer-motion';
import type React from 'react';
import styled from 'styled-components';

interface GameModeModalProps {
  visible: boolean;
  loading?: boolean;
  onSinglePlayer: () => void;
  onMultiplayer: () => void;
  onCancel: () => void;
}

export const GameModeModal: React.FC<GameModeModalProps> = ({
  visible,
  loading = false,
  onSinglePlayer,
  onMultiplayer,
  onCancel,
}) => {
  const handleSinglePlayer = () => {
    if (loading) return;
    console.log('🎮 Single Player selected');
    onSinglePlayer();
  };

  const handleMultiplayer = () => {
    if (loading) return;
    console.log('👥 Multiplayer selected');
    onMultiplayer();
  };

  return (
    <Modal
      open={visible}
      onCancel={loading ? undefined : onCancel}
      footer={null}
      centered
      width={600}
      closable={!loading}
      styles={{
        content: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: '40px',
        },
      }}
    >
      <ModalContent>
        {loading ? (
          <>
            <LoadingSpinner
              as={motion.div}
              animate={{rotate: 360}}
              transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
            >
              ⚡
            </LoadingSpinner>
            <Title>Setting up your game...</Title>
            <LoadingText>Please wait a moment</LoadingText>
          </>
        ) : (
          <>
            <Title>Choose Game Mode</Title>
            <Subtitle>Select how you want to play</Subtitle>

            <ModesContainer>
              <ModeCard
                as={motion.div}
                whileHover={{scale: 1.05, y: -10}}
                whileTap={{scale: 0.95}}
                onClick={handleSinglePlayer}
              >
                <ModeIcon>🤖</ModeIcon>
                <ModeTitle>Single Player</ModeTitle>
                <ModeDescription>Practice against AI opponent</ModeDescription>
                <ModeFeatures>
                  <Feature>✓ No wallet required</Feature>
                  <Feature>✓ Practice game mechanics</Feature>
                  <Feature>✓ Instant start</Feature>
                </ModeFeatures>
              </ModeCard>

              <ModeCard
                as={motion.div}
                whileHover={{scale: 1.05, y: -10}}
                whileTap={{scale: 0.95}}
                onClick={handleMultiplayer}
              >
                <ModeIcon>👥</ModeIcon>
                <ModeTitle>Multiplayer</ModeTitle>
                <ModeDescription>Play with other players</ModeDescription>
                <ModeFeatures>
                  <Feature>✓ Free or paid games</Feature>
                  <Feature>✓ Real opponents</Feature>
                  <Feature>✓ Leaderboard rankings</Feature>
                </ModeFeatures>
              </ModeCard>
            </ModesContainer>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin: 0;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
`;

const ModesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ModeCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ModeIcon = styled.div`
  font-size: 64px;
  margin-bottom: 8px;
`;

const ModeTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
  text-align: center;
`;

const ModeDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

const ModeFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
`;

const Feature = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  padding-left: 8px;
`;

const LoadingSpinner = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  text-align: center;
`;
