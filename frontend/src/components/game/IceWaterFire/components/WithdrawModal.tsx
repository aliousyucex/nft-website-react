import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, InputNumber, Button, message, Spin } from 'antd';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  contractAddress: string;
}

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getWithdrawableUserBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const WithdrawModal: React.FC<WithdrawModalProps> = ({ visible, onClose, contractAddress }) => {
  const { address } = useAccount();
  const [withdrawAmount, setWithdrawAmount] = useState(0.01);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get wallet balance
  const { data: walletBalance } = useBalance({
    address: address,
  });

  // Write contract (withdraw)
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful withdraw
  useEffect(() => {
    if (isSuccess) {
      message.success('Withdrawal successful!');
      refreshContractBalance();
    }
  }, [isSuccess]);

  // Fetch contract balance
  const refreshContractBalance = async () => {
    if (!address) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contract/balance/${address}`
      );
      const data = await response.json();
      setContractBalance(data.balance || '0');
    } catch (error) {
      console.error('Error fetching contract balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (visible && address) {
      refreshContractBalance();
    }
  }, [visible, address]);

  const handleWithdraw = async () => {
    if (!address) {
      message.error('Please connect your wallet');
      return;
    }

    if (withdrawAmount <= 0) {
      message.error('Amount must be greater than 0');
      return;
    }

    const maxBalance = parseFloat(contractBalance);
    if (withdrawAmount > maxBalance) {
      message.error('Insufficient contract balance');
      return;
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'withdraw',
        args: [parseEther(withdrawAmount.toString())],
      });
    } catch (error: any) {
      console.error('Withdraw error:', error);
      message.error(error?.message || 'Withdrawal failed');
    }
  };

  const withdrawAll = () => {
    const balance = parseFloat(contractBalance);
    if (balance > 0) {
      setWithdrawAmount(balance);
    }
  };

  const presetPercentages = [25, 50, 75, 100];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      title={null}
      centered
    >
      <Container>
        <Header>
          <Icon>💸</Icon>
          <Title>Withdraw ETH</Title>
          <Subtitle>Withdraw ETH from your game balance</Subtitle>
        </Header>

        <BalanceSection>
          <BalanceCard highlight>
            <BalanceLabel>
              Contract Balance
              <RefreshButton onClick={refreshContractBalance} disabled={isRefreshing}>
                {isRefreshing ? '⟳' : '🔄'}
              </RefreshButton>
            </BalanceLabel>
            <BalanceValue>{contractBalance} ETH</BalanceValue>
          </BalanceCard>

          <BalanceCard>
            <BalanceLabel>Wallet Balance</BalanceLabel>
            <BalanceValue>
              {walletBalance ? formatEther(walletBalance.value) : '0'} ETH
            </BalanceValue>
          </BalanceCard>
        </BalanceSection>

        <InputSection>
          <LabelRow>
            <Label>Withdraw Amount (ETH)</Label>
            <MaxButton onClick={withdrawAll}>Max</MaxButton>
          </LabelRow>
          <InputNumber
            min={0.001}
            max={parseFloat(contractBalance)}
            step={0.001}
            value={withdrawAmount}
            onChange={(val) => setWithdrawAmount(val || 0.001)}
            style={{ width: '100%', marginBottom: '12px' }}
          />

          <PresetButtons>
            {presetPercentages.map((percentage) => {
              const amount = (parseFloat(contractBalance) * percentage) / 100;
              return (
                <PresetButton
                  key={percentage}
                  onClick={() => setWithdrawAmount(amount)}
                  active={withdrawAmount === amount}
                  disabled={parseFloat(contractBalance) === 0}
                >
                  {percentage}%
                </PresetButton>
              );
            })}
          </PresetButtons>
        </InputSection>

        <InfoBox>
          <InfoIcon>ℹ️</InfoIcon>
          <InfoText>
            Withdrawn ETH will be sent to your wallet. Make sure you have enough ETH for gas
            fees (~0.0001-0.0005 ETH).
          </InfoText>
        </InfoBox>

        <ActionButtons>
          <CancelButton onClick={onClose} disabled={isPending || isConfirming}>
            Cancel
          </CancelButton>
          <WithdrawButton
            onClick={handleWithdraw}
            disabled={
              isPending || isConfirming || withdrawAmount <= 0 || parseFloat(contractBalance) === 0
            }
          >
            {isPending || isConfirming ? (
              <>
                <Spin size="small" style={{ marginRight: '8px' }} />
                {isPending ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              `Withdraw ${withdrawAmount} ETH`
            )}
          </WithdrawButton>
        </ActionButtons>
      </Container>
    </Modal>
  );
};

export default WithdrawModal;

const Container = styled.div`
  padding: 8px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const BalanceSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const BalanceCard = styled.div<{ highlight?: boolean }>`
  background: ${(props) =>
    props.highlight
      ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
      : '#f5f5f5'};
  padding: 16px;
  border-radius: 12px;
  color: ${(props) => (props.highlight ? 'white' : '#1a1a1a')};
`;

const BalanceLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 1;
    transform: rotate(180deg);
  }

  &:disabled {
    cursor: not-allowed;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BalanceValue = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const InputSection = styled.div`
  margin-bottom: 20px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
`;

const MaxButton = styled.button`
  background: none;
  border: 1px solid #52c41a;
  color: #52c41a;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #52c41a;
    color: white;
  }
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const PresetButton = styled.button<{ active?: boolean }>`
  padding: 8px;
  border: 2px solid ${(props) => (props.active ? '#52c41a' : '#e0e0e0')};
  background: ${(props) => (props.active ? '#52c41a' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #52c41a;
    background: ${(props) => (props.active ? '#73d13d' : '#f0f0f0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const InfoIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #ad6800;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
`;

const CancelButton = styled(Button)`
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
`;

const WithdrawButton = styled(Button)`
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;

