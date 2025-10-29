import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { lineraAdapter } from '../lib/linera-adapter';
import type { LineraProvider } from '../lib/linera-adapter';

interface LineraContextType {
  provider: LineraProvider | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setAppId: (appId: string) => Promise<void>;
}

const LineraContext = createContext<LineraContextType | undefined>(undefined);

// Default Linera RPC URL - adjust this to your Linera network
const DEFAULT_LINERA_RPC_URL = 'http://localhost:8080';

export function LineraProvider({ children }: { children: ReactNode }) {
  const { primaryWallet } = useDynamicContext();
  const [provider, setProvider] = useState<LineraProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (!primaryWallet) {
      setError('Please connect your wallet first');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const lineraProvider = await lineraAdapter.connect(
        primaryWallet,
        DEFAULT_LINERA_RPC_URL
      );
      setProvider(lineraProvider);
      console.log('🎉 Connected to Linera!', lineraProvider);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMsg);
      console.error('Failed to connect to Linera:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    lineraAdapter.reset();
    setProvider(null);
    setError(null);
  };

  const setAppId = async (appId: string) => {
    if (!provider) {
      throw new Error('Not connected to Linera');
    }
    
    try {
      await lineraAdapter.setApplication(appId);
      console.log('✅ Application set:', appId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to set application';
      setError(errorMsg);
      throw err;
    }
  };

  // Auto-disconnect when Dynamic wallet disconnects
  useEffect(() => {
    if (!primaryWallet && provider) {
      disconnect();
    }
  }, [primaryWallet, provider]);

  // Subscribe to connection state changes
  useEffect(() => {
    const handleConnectionChange = () => {
      if (lineraAdapter.isChainConnected()) {
        setProvider(lineraAdapter.getProvider());
      } else {
        setProvider(null);
      }
    };

    lineraAdapter.onConnectionStateChange(handleConnectionChange);
    return () => lineraAdapter.offConnectionStateChange();
  }, []);

  const value: LineraContextType = {
    provider,
    isConnected: provider !== null,
    isConnecting,
    error,
    connect,
    disconnect,
    setAppId,
  };

  return (
    <LineraContext.Provider value={value}>
      {children}
    </LineraContext.Provider>
  );
}

export function useLinera() {
  const context = useContext(LineraContext);
  if (context === undefined) {
    throw new Error('useLinera must be used within a LineraProvider');
  }
  return context;
}

