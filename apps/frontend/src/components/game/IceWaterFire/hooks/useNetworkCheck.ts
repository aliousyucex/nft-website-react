import {useAccount, useChainId, useSwitchChain} from 'wagmi';
import {monadTestnet} from '../../../../config/wagmi';

export const useNetworkCheck = () => {
  const {isConnected} = useAccount();
  const chainId = useChainId();
  const {switchChain} = useSwitchChain();

  const isCorrectNetwork = chainId === monadTestnet.id;
  const currentChainId = chainId;

  const switchToCorrectNetwork = () => {
    if (switchChain) {
      switchChain({chainId: monadTestnet.id});
    }
  };

  return {
    isConnected,
    isCorrectNetwork,
    currentChainId,
    switchToCorrectNetwork,
    requiredChainId: monadTestnet.id,
    requiredNetworkName: monadTestnet.name,
  };
};

