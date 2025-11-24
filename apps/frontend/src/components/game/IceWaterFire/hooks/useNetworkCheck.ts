import {useAccount, useChainId, useSwitchChain} from 'wagmi';
import {monadMainnet} from '../../../../config/wagmi';

export const useNetworkCheck = () => {
  const {isConnected} = useAccount();
  const chainId = useChainId();
  const {switchChain} = useSwitchChain();

  const isCorrectNetwork = chainId === monadMainnet.id;
  const currentChainId = chainId;

  const switchToCorrectNetwork = () => {
    if (switchChain) {
      switchChain({chainId: monadMainnet.id});
    }
  };

  return {
    isConnected,
    isCorrectNetwork,
    currentChainId,
    switchToCorrectNetwork,
    requiredChainId: monadMainnet.id,
    requiredNetworkName: monadMainnet.name,
  };
};

