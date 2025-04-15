// contexts/ContractContext.tsx
import { createContext, useContext, useEffect } from "react";
import { Address } from "viem";
import {
  useNextPrice,
  useSwapPrice,
  useTokenInfo,
  useTokensToBeBurnt,
} from "@/hooks/use-contract";

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  tokenAddress: Address;
}

interface ContractContextType {
  tokenInfo: TokenInfo | undefined;
  swapPrice: bigint | undefined;
  tokensToBeBurnt: bigint;
  nextPrice: bigint;
  isLoading: boolean;
  error: Error | null;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  // Fetch token info
  const {
    data: tokenInfo,
    isLoading: isLoadingTokenInfo,
    error: tokenError,
    queryKey: tokenInfoQueryKey,
  } = useTokenInfo();

  const {
    data: swapPrice,
    isLoading: isLoadingSwapPrice,
    error: swapPriceError,
    queryKey: swapPriceQueryKey,
  } = useSwapPrice();

  const {
    data: tokensToBeBurnt,
    isLoading: isLoadingTokensToBeBurnt,
    error: tokensToBeBurntError,
    queryKey: tokensToBeBurntQueryKey,
  } = useTokensToBeBurnt();

  const {
    data: nextPrice,
    isLoading: isLoadingNextPrice,
    error: nextPriceError,
    queryKey: nextPriceQueryKey,
  } = useNextPrice();

  const isLoading = isLoadingTokenInfo || isLoadingTokensToBeBurnt || isLoadingSwapPrice || isLoadingNextPrice;
  const error = tokenError || tokensToBeBurntError || swapPriceError || nextPriceError;
  useEffect(() => {
    console.log({ tokenInfo, swapPrice, tokensToBeBurnt, isLoading, error });
  }, [tokenInfo, swapPrice, tokensToBeBurnt, isLoading, error]);
  const value = {
    tokenInfo,
    swapPrice,
    nextPrice,
    tokensToBeBurnt,
    isLoading,
    error,
  };

  return (
    // @ts-ignore
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContractData() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}
