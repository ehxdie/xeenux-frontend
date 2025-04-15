import { useAccount } from "wagmi";
import { Address } from "viem";
import {
  useDeployedContractInfo,
  useScaffoldReadContract,
  useSelectedNetwork,
} from "./scaffold-eth";
import { AllowedChainIds } from "@/utils/scaffold-eth";

const xeenuxContractName: "XeenuxInvestment" = "XeenuxInvestment";
const xeeContractName: "XEE" = "XEE";
const usdtContractName: "USDT" = "USDT";
export function useContractsInfo() {
  const { id: chainId } = useSelectedNetwork();
  const { data: xeenuxContractInfo } = useDeployedContractInfo({
    chainId: chainId as AllowedChainIds,
    contractName: xeenuxContractName,
  });
  const { data: xeeTokenInfo } = useDeployedContractInfo({
    chainId: chainId as AllowedChainIds,
    contractName: xeeContractName,
  });
  const { data: usdtTokenInfo } = useDeployedContractInfo({
    chainId: chainId as AllowedChainIds,
    contractName: usdtContractName,
  });
  return {
    xeenuxContractInfo: { ...xeenuxContractInfo, name: xeenuxContractName },
    xeeTokenInfo: { ...xeeTokenInfo, name: xeeContractName },
    usdtTokenInfo: { ...usdtTokenInfo, name: usdtContractName },
    chainId,
  };
}

// Hook for 'getUserId' function
export function useUserId(userAddress: Address) {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "id",
    args: [userAddress],
  });
}

// Hook for 'getUserInfo' function
// export function useUserInfo(_id: BigInt) {
//     return useReadContract({
//         address: xeenuxContractAddress,
//         abi: contractsConfig.contract.abi,
//         functionName: 'getUserInfo',
//         args: [_id],
//     });
// }

// Hook for 'getUserInfo' function
export function useTokenInfo() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "getTokenInfo",
  });
}
export function useSwapPrice() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "swapPrice",
  });
}
export function useTokensToBeBurnt() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "xeenuxToBeBurned",
  });
}

export function useXeeBalance() {
  const { address } = useAccount();
  const { xeeTokenInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeeTokenInfo.name,
    functionName: "balanceOf",
    args: [address as Address],
  });
}
export function useUsdtBalance() {
  const { address } = useAccount();
  const { usdtTokenInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: usdtTokenInfo.name,
    functionName: "balanceOf",
    args: [address as Address],
  });
}

export function useNextPrice() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "nextPrice",
  });
}

export function useLastBurnDate() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "lastBurnTimestamp",
  });
}
