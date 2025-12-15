import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { lineraAdapter } from '../lib/linera-adapter';
import { CONTRACTS_APP_ID } from '../constants';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export interface MarketOption {
    name: string;
    odds: number;
    color: string;
}

export interface Market {
    id: number;
    question: string;
    imageUrl: string;
    options: MarketOption[];
    totalPool: number;
    endTime: string;
    judge: string;
    resolved: boolean;
    winningOutcome: number;
}

interface MarketContextType {
    markets: Market[];
    addMarket: (market: Omit<Market, 'id'>) => void;
    refreshMarkets: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarkets = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarkets must be used within a MarketProvider');
    }
    return context;
};

// Unified color palette
const PRIMARY_BLUE = "#3b82f6";
const SECONDARY_PURPLE = "#a78bfa";

export const MarketProvider = ({ children }: { children: ReactNode }) => {
    const { primaryWallet } = useDynamicContext();
    const [markets, setMarkets] = useState<Market[]>([]);

    const fetchMarkets = async () => {
        try {
            if (!lineraAdapter.isApplicationSet()) {
                // If not connected yet, we might not be able to query if we need auth, 
                // but for public queries usually we need a chain. 
                // If the user is not connected, we might skip or try to connect to a default chain if possible.
                // For now, we rely on the user being connected or the adapter handling it.
                if (primaryWallet) {
                    await lineraAdapter.setApplication(CONTRACTS_APP_ID);
                } else {
                    return; // Wait for wallet connection
                }
            }

            const query = `query { markets { id title judge opponent betAmount endTime imageUrl resolved winningOutcome } }`;
            const result = await lineraAdapter.queryApplication<{ markets: any[] }>(query);

            const mappedMarkets: Market[] = result.markets.map((m: any) => ({
                id: m.id,
                question: m.title,
                imageUrl: m.imageUrl || "https://cryptologos.cc/logos/linera-logo.png", // Fallback
                options: [
                    { name: "YES", odds: 50, color: PRIMARY_BLUE }, // Odds calculation would go here
                    { name: "NO", odds: 50, color: SECONDARY_PURPLE }
                ],
                totalPool: m.betAmount,
                endTime: new Date(m.endTime / 1000).toLocaleDateString(),
                judge: m.judge,
                resolved: m.resolved,
                winningOutcome: m.winningOutcome
            }));

            // Sort by ID descending to show newest first
            setMarkets(mappedMarkets.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Failed to fetch markets:", error);
        }
    };

    useEffect(() => {
        fetchMarkets();

        // Poll every 10 seconds
        const interval = setInterval(fetchMarkets, 10000);
        return () => clearInterval(interval);
    }, [primaryWallet]);

    const addMarket = (newMarket: Omit<Market, 'id'>) => {
        // Optimistic update
        setMarkets(prev => [
            { ...newMarket, id: Math.max(...prev.map(m => m.id), 0) + 1 },
            ...prev
        ]);
        // The actual contract call happens in newEvent.tsx, which will eventually trigger a refresh
        setTimeout(fetchMarkets, 2000);
    };

    return (
        <MarketContext.Provider value={{ markets, addMarket, refreshMarkets: fetchMarkets }}>
            {children}
        </MarketContext.Provider>
    );
};
