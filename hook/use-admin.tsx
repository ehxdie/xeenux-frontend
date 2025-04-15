import { Address } from "viem";
import {
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTransactor,
} from "./scaffold-eth";
import { useContractsInfo } from "./use-contract";

export function useIsAdmin(_address?: Address) {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "isAdmin",
    args: [_address!],
    query: {
      enabled: !!_address,
    },
  });
}

export function useIncomeDistributionData() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "getIncomeDistData",
    args: [],
  });
}

export function useWeeklyTurnOver() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "weeklyTurnover",
    args: [],
  });
}

export function useTotalUsers() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "totalUsers",
    args: [],
  });
}
export function useWeeklyTurnover() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "weeklyTurnover",
    args: [],
  });
}
export function useTotalTurnover() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "totalTurnover",
    args: [],
  });
}

export function useDistributeIncome() {
  const { xeenuxContractInfo } = useContractsInfo();
  const { writeContractAsync: writeXenuxContractAsync } =
    useScaffoldWriteContract({
      contractName: xeenuxContractInfo.name,
    });
  const distributeROI = async () => {
    try {
      const distributeHash = await writeXenuxContractAsync({
        functionName: "distributeROI",
        args: [],
      });
      return distributeHash;
    } catch (e) {
      console.error(e);
    }
  };
  const distributeBinaryIncome = async () => {
    try {
      const distributeHash = await writeXenuxContractAsync({
        functionName: "distributeBinaryIncome",
        args: [],
      });
      return distributeHash;
    } catch (e) {
      console.error(e);
    }
  };
  const distributeWeeklyReward = async () => {
    try {
      const distributeHash = await writeXenuxContractAsync({
        functionName: "distributeWeeklyReward",
        args: [],
      });
      return distributeHash;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    distributeROI,
    distributeBinaryIncome,
    distributeWeeklyReward,
  };
}

export function useBurnTokens() {
  const { xeenuxContractInfo } = useContractsInfo();
  const { writeContractAsync: writeXenuxContractAsync } =
    useScaffoldWriteContract({
      contractName: xeenuxContractInfo.name,
    });
  const burnTokens = async (amount: bigint) => {
    try {
      const burnHash = await writeXenuxContractAsync({
        functionName: "burnXeenux",
        args: [amount],
      });
      return burnHash;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    burnTokens,
  };
}

export function useTotalTokensBurnt() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "xeenuxBurnt",
    args: [],
  });
}
