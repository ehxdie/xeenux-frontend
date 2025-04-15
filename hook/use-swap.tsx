import { WalletNotConnectedException } from "@/lib/exceptions";
import { useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "./scaffold-eth";
import { useContractsInfo } from "./use-contract";

export const useSwapUsdtToXee = () => {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<"idle" | "approving" | "swapping">(
    "idle"
  );
  const { xeenuxContractInfo, usdtTokenInfo, xeeTokenInfo } =
    useContractsInfo();
  const [error, setError] = useState<Error | null>(null);

  // Read USDT balance
  const {
    data: usdtBalanceData,
    isLoading: isUsdtBalanceLoading,
    isError: isUsdtBalanceError,
  } = useScaffoldReadContract({
    contractName: usdtTokenInfo.name,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: address !== undefined,
    },
  });
  const { data: allowanceData } = useScaffoldReadContract({
    contractName: usdtTokenInfo.name,
    functionName: "allowance",
    args: [address as Address, xeenuxContractInfo?.address],
    query: {
      enabled: address !== undefined,
    },
  });
  const { writeContractAsync: writeUsdtContractAsync } =
    useScaffoldWriteContract({
      contractName: usdtTokenInfo.name,
    });
  const { writeContractAsync: writeXeenuxContractAsync } =
    useScaffoldWriteContract({
      contractName: xeenuxContractInfo.name,
    });
  const approveUsdt = async (amount: bigint): Promise<Address> => {
    setStatus("approving");
    try {
      if (allowanceData && allowanceData >= amount) {
        setStatus("idle");
        return "0x0";
      }
      const approvalHash = await writeUsdtContractAsync(
        {
          functionName: "approve",
          args: [xeenuxContractInfo.address, amount],
        },
        { showSuccessToast: false }
      );
      return approvalHash as Address;
    } catch (error) {
      setStatus("idle");
      setError(
        error instanceof Error ? error : new Error("USDT approval failed")
      );
      throw error;
    }
  };

  const swap = async (amount: bigint) => {
    try {
      if (!isConnected) {
        throw new WalletNotConnectedException();
      }

      // Verify USDT balance
      if (!usdtBalanceData || usdtBalanceData < amount) {
        throw new Error("Insufficient USDT balance");
      }

      // First approve USDT
      await approveUsdt(amount);

      // Then perform swap
      setStatus("swapping");
      const swapHash = await writeXeenuxContractAsync(
        {
          functionName: "swapUSDTToXeenux",
          args: [amount],
        },
        { successToastMessage: "Swap successful" }
      );
      setStatus("idle");
      return swapHash as Address;
    } catch (error) {
      setStatus("idle");
      setError(error instanceof Error ? error : new Error("Swap failed"));
      throw error;
    }
  };

  return {
    swap,
    status,
    error,
    usdtBalanceData,
    isUsdtBalanceLoading,
    isUsdtBalanceError,
  };
};

export const useSwapXeeToUsdt = () => {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<"idle" | "approving" | "swapping">(
    "idle"
  );
  const { xeenuxContractInfo, xeeTokenInfo } = useContractsInfo();
  const [error, setError] = useState<Error | null>(null);

  // Read XEE balance
  const {
    data: xeeBalanceData,
    isLoading: isXeeBalanceLoading,
    isError: isXeeBalanceError,
  } = useScaffoldReadContract({
    contractName: xeeTokenInfo.name,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: address !== undefined,
    },
  });
  const { data: allowanceData } = useScaffoldReadContract({
    contractName: xeeTokenInfo.name,
    functionName: "allowance",
    args: [address as Address, xeenuxContractInfo?.address],
    query: {
      enabled: address !== undefined,
    },
  });
  const { writeContractAsync: writeXeeContractAsync } =
    useScaffoldWriteContract({
      contractName: xeeTokenInfo.name,
    });
  const { writeContractAsync: writeXeenuxContractAsync } =
    useScaffoldWriteContract({
      contractName: xeenuxContractInfo.name,
    });
  const approveXee = async (amount: bigint): Promise<Address> => {
    setStatus("approving");
    try {
      if (allowanceData && allowanceData >= amount) {
        setStatus("idle");
        return "0x0";
      }
      const approvalHash = await writeXeeContractAsync(
        {
          functionName: "approve",
          args: [xeenuxContractInfo.address, amount],
        },
        { showSuccessToast: false }
      );
      return approvalHash as Address;
    } catch (error) {
      setStatus("idle");
      setError(
        error instanceof Error ? error : new Error("XEE approval failed")
      );
      throw error;
    }
  };

  const swap = async (amount: bigint) => {
    try {
      if (!isConnected) {
        throw new WalletNotConnectedException();
      }

      // Verify XEE balance
      if (!xeeBalanceData || xeeBalanceData < amount) {
        throw new Error("Insufficient XEE balance");
      }

      // First approve XEE
      await approveXee(amount);

      // Then perform swap
      setStatus("swapping");
      const swapHash = await writeXeenuxContractAsync(
        {
          functionName: "swapXeenuxToUSDT",
          args: [amount],
        },
        { successToastMessage: "Swap successful" }
      );
      setStatus("idle");
      return swapHash as Address;
    } catch (error) {
      setStatus("idle");
      setError(error instanceof Error ? error : new Error("Swap failed"));
      throw error;
    }
  };

  return {
    swap,
    status,
    error,
    xeeBalanceData,
    isXeeBalanceLoading,
    isXeeBalanceError,
  };
};

export function useSwapFee() {
  const { xeenuxContractInfo } = useContractsInfo();
  return useScaffoldReadContract({
    contractName: xeenuxContractInfo.name,
    functionName: "swapFee",
  });
}
