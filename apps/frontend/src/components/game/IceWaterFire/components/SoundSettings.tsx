import {motion} from 'framer-motion';
import type React from 'react';
import styled from 'styled-components';

interface SoundSettingsProps {
  soundsEnabled: boolean;
  volume: number;
  onToggleSounds: () => void;
  onVolumeChange: (volume: number) => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({
  soundsEnabled,
  volume,
  onToggleSounds,
  onVolumeChange,
}) => {
  return (
    <Container>
      <SettingItem>
        <SettingLabel>
          <SettingIcon>{soundsEnabled ? '🔊' : '🔇'}</SettingIcon>
          Sound Effects
        </SettingLabel>
        <ToggleSwitch
          as={motion.button}
          whileTap={{scale: 0.95}}
          onClick={onToggleSounds}
          $isActive={soundsEnabled}
        >
          <ToggleSlider $isActive={soundsEnabled} />
        </ToggleSwitch>
      </SettingItem>

      {soundsEnabled && (
        <SettingItem
          as={motion.div}
          initial={{opacity: 0, height: 0}}
          animate={{opacity: 1, height: 'auto'}}
          exit={{opacity: 0, height: 0}}
        >
          <SettingLabel>
            <SettingIcon>🎚️</SettingIcon>
            Volume
          </SettingLabel>
          <VolumeControl>
            <VolumeSlider
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            />
            <VolumeValue>{Math.round(volume * 100)}%</VolumeValue>
          </VolumeControl>
        </SettingItem>
      )}
    </Container>
  );
};

export default SoundSettings;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;

const SettingIcon = styled.span`
  font-size: 20px;
`;

const ToggleSwitch = styled.button<{$isActive: boolean}>`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  background: ${(props) => (props.$isActive ? '#4ECDC4' : 'rgba(255, 255, 255, 0.2)')};
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.3s ease;
  padding: 0;

  &:hover {
    background: ${(props) => (props.$isActive ? '#45B7D1' : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const ToggleSlider = styled.div<{$isActive: boolean}>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: ${(props) => (props.$isActive ? '25px' : '3px')};
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 200px;
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4ecdc4;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #45b7d1;
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4ecdc4;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #45b7d1;
    }
  }
`;

const VolumeValue = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  min-width: 40px;
  text-align: right;
`;
