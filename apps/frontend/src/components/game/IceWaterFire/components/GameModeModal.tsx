import {Modal} from 'antd';
import {motion} from 'framer-motion';
import type React from 'react';
import {useState} from 'react';
import styled from 'styled-components';

interface GameModeModalProps {
  visible: boolean;
  onSinglePlayer: () => void;
  onMultiplayer: () => void;
  onCancel: () => void;
}

export const GameModeModal: React.FC<GameModeModalProps> = ({
  visible,
  onSinglePlayer,
  onMultiplayer,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSinglePlayer = () => {
    console.log('🎮 Single Player selected');
    setLoading(true);
    // Don't create room here - let the parent component handle it via pendingGameMode
    onSinglePlayer();
    setTimeout(() => setLoading(false), 100);
  };

  const handleMultiplayer = () => {
    console.log('👥 Multiplayer selected');
    setLoading(true);
    // Don't create room here - let the parent component handle it via pendingGameMode
    onMultiplayer();
    setTimeout(() => setLoading(false), 100);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
      styles={{
        content: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: '40px',
        },
      }}
    >
      <ModalContent>
        <Title>Choose Game Mode</Title>
        <Subtitle>Select how you want to play</Subtitle>

        <ModesContainer>
          <ModeCard
            as={motion.div}
            whileHover={{scale: 1.05, y: -10}}
            whileTap={{scale: 0.95}}
            onClick={handleSinglePlayer}
            style={{opacity: loading ? 0.6 : 1}}
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
            style={{opacity: loading ? 0.6 : 1}}
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
