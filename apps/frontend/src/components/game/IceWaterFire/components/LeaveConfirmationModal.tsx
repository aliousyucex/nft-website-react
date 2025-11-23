import {Button, Modal} from 'antd';
import type React from 'react';
import styled from 'styled-components';

interface LeaveConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isPaidGame: boolean;
  betAmount: number;
}

export const LeaveConfirmationModal: React.FC<LeaveConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  isPaidGame,
  betAmount,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={450}
      closable={false}
    >
      <Container>
        <WarningIcon>⚠️</WarningIcon>
        <Title>Leave Game?</Title>
        
        {isPaidGame && betAmount > 0 ? (
          <Message>
            You will <Highlight>forfeit this game</Highlight> and <Highlight>lose your bet of {betAmount} MON</Highlight>.
            Your opponent will win by forfeit.
          </Message>
        ) : (
          <Message>
            You will <Highlight>forfeit this game</Highlight>. Your opponent will win by forfeit.
          </Message>
        )}

        <Note>
          💡 This action cannot be undone.
        </Note>

        <ButtonGroup>
          <CancelButton onClick={onCancel}>
            Stay in Game
          </CancelButton>
          <LeaveButton onClick={onConfirm}>
            Leave Game
          </LeaveButton>
        </ButtonGroup>
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

const Highlight = styled.span`
  font-weight: 600;
  color: #E74C3C;
`;

const Note = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  padding: 12px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const CancelButton = styled(Button)`
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

const LeaveButton = styled(Button)`
  flex: 1;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  border: none;
  color: white;

  &:hover {
    background: linear-gradient(135deg, #C0392B 0%, #E74C3C 100%);
    color: white;
  }
`;

