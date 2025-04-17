import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getDashboard } from '@/api/user';
import { swapTokens } from '@/api/transactions';
import { notification } from '@/utils/scaffold-eth/notification';

interface SwapData {
  tokenInfo: {
    symbol: string;
    decimals: number;
  };
  balances: {
    usdt: number;
    xee: number;
  };
  swapInfo: {
    price: number;
    fee: number;
  };
}

export function useSwap() {
  const { token } = useAuth();
  const [data, setData] = useState<SwapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [swapStatus, setSwapStatus] = useState<'idle' | 'processing'>('idle');

  const fetchSwapData = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await getDashboard(token);
      setData({
        tokenInfo: response.data.tokenInfo,
        balances: {
          usdt: response.data.usdtBalance,
          xee: response.data.xeeBalance
        },
        swapInfo: {
          price: response.data.swapPrice,
          fee: response.data.swapFee
        }
      });
    } catch (err) {
      notification.error('Failed to fetch swap data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (amount: number, direction: 'usdt_to_xee' | 'xee_to_usdt') => {
    if (!token) return;

    try {
      setSwapStatus('processing');
      await swapTokens({ amount, direction }, token);
      notification.success('Swap completed successfully');
      await fetchSwapData();
    } catch (err) {
      notification.error('Swap failed');
      console.error(err);
      throw err;
    } finally {
      setSwapStatus('idle');
    }
  };

  return {
    data,
    isLoading,
    swapStatus,
    executeSwap,
    refreshData: fetchSwapData
  };
}