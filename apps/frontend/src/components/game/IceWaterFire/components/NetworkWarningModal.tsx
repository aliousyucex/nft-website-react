import {Button, Modal} from 'antd';
import type React from 'react';
import styled from 'styled-components';

interface NetworkWarningModalProps {
  visible: boolean;
  onClose: () => void;
  onSwitchNetwork: () => void;
  currentNetworkId: number;
  requiredNetworkName: string;
  requiredNetworkId: number;
}

export const NetworkWarningModal: React.FC<NetworkWarningModalProps> = ({
  visible,
  onClose,
  onSwitchNetwork,
  currentNetworkId,
  requiredNetworkName,
  requiredNetworkId,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      closable={true}
    >
      <Container>
        <WarningIcon>⚠️</WarningIcon>
        <Title>Wrong Network</Title>
        <Message>
          You're connected to the wrong network. Please switch to <NetworkName>{requiredNetworkName}</NetworkName> to continue playing.
        </Message>
        
        <NetworkInfo>
          <InfoRow>
            <InfoLabel>Current Network:</InfoLabel>
            <InfoValue>Chain ID {currentNetworkId}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Required Network:</InfoLabel>
            <InfoValue>{requiredNetworkName} (Chain ID {requiredNetworkId})</InfoValue>
          </InfoRow>
        </NetworkInfo>

        <ButtonGroup>
          <SwitchButton onClick={onSwitchNetwork}>
            Switch Network
          </SwitchButton>
          <DismissButton onClick={onClose}>
            Dismiss
          </DismissButton>
        </ButtonGroup>

        <Note>
          💡 You can still play free practice games on any network, but paid games require the correct network.
        </Note>
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const WarningIcon = styled.div`
  font-size: 64px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #E74C3C;
  margin: 0;
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  margin: 0;
  line-height: 1.6;
`;

const NetworkName = styled.span`
  font-weight: 600;
  color: #667eea;
`;

const NetworkInfo = styled.div`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const SwitchButton = styled(Button)`
  flex: 1;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    color: white;
  }
`;

const DismissButton = styled(Button)`
  flex: 1;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
`;

const Note = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  padding: 12px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

