import React, { createContext, useContext, useState, ReactNode } from 'react';
import bitcoinLogo from '../assets/bitcoinlogo.png';
import chainlinkLogo from '../assets/chainlinklogo.png';

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
}

interface MarketContextType {
    markets: Market[];
    addMarket: (market: Omit<Market, 'id'>) => void;
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

const initialMarkets: Market[] = [
    {
        id: 1,
        question: "Will Daniel get A for finals?",
        imageUrl: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
        options: [
            { name: "YES", odds: 45, color: PRIMARY_BLUE },
            { name: "NO", odds: 55, color: SECONDARY_PURPLE }
        ],
        totalPool: 1234,
        endTime: "Dec 20, 2025"
    },
    {
        id: 2,
        question: "Will it rain tomorrow?",
        imageUrl: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
        options: [
            { name: "YES", odds: 80, color: PRIMARY_BLUE },
            { name: "NO", odds: 20, color: SECONDARY_PURPLE }
        ],
        totalPool: 567,
        endTime: "Dec 16, 2025"
    },
    {
        id: 3,
        question: "Will the bus be late?",
        imageUrl: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
        options: [
            { name: "YES", odds: 20, color: PRIMARY_BLUE },
            { name: "NO", odds: 80, color: SECONDARY_PURPLE }
        ],
        totalPool: 890,
        endTime: "Dec 16, 2025"
    },
    {
        id: 4,
        question: "Will Joshua go to eat McD today?",
        imageUrl: "https://cryptologos.cc/logos/bonk-bonk-logo.png",
        options: [
            { name: "YES", odds: 60, color: PRIMARY_BLUE },
            { name: "NO", odds: 40, color: SECONDARY_PURPLE }
        ],
        totalPool: 120,
        endTime: "Dec 15, 2025"
    },
    {
        id: 5,
        question: "Alice or Bella finish her project on time?",
        imageUrl: "https://cryptologos.cc/logos/floki-inu-floki-logo.png",
        options: [
            { name: "YES", odds: 75, color: PRIMARY_BLUE },
            { name: "NO", odds: 25, color: SECONDARY_PURPLE }
        ],
        totalPool: 340,
        endTime: "Dec 18, 2025"
    },
    {
        id: 6,
        question: "Will the coffee shop run out of croissants?",
        imageUrl: "https://cryptologos.cc/logos/dogwifhat-wif-logo.png",
        options: [
            { name: "YES", odds: 30, color: PRIMARY_BLUE },
            { name: "NO", odds: 70, color: SECONDARY_PURPLE }
        ],
        totalPool: 45,
        endTime: "Dec 16, 2025"
    },
    {
        id: 7,
        question: "Will the gym be crowded at 6 PM?",
        imageUrl: "https://cryptologos.cc/logos/apecoin-ape-logo.png",
        options: [
            { name: "YES", odds: 90, color: PRIMARY_BLUE },
            { name: "NO", odds: 10, color: SECONDARY_PURPLE }
        ],
        totalPool: 210,
        endTime: "Dec 15, 2025"
    },
    {
        id: 8,
        question: "Will my favorite team win the match?",
        imageUrl: "https://cryptologos.cc/logos/mog-coin-mog-logo.png",
        options: [
            { name: "YES", odds: 50, color: PRIMARY_BLUE },
            { name: "NO", odds: 50, color: SECONDARY_PURPLE }
        ],
        totalPool: 5600,
        endTime: "Dec 17, 2025"
    },
    {
        id: 9,
        question: "Will the stock market go up today?",
        imageUrl: "https://cryptologos.cc/logos/brett-brett-logo.png",
        options: [
            { name: "YES", odds: 55, color: PRIMARY_BLUE },
            { name: "NO", odds: 45, color: SECONDARY_PURPLE }
        ],
        totalPool: 10230,
        endTime: "Dec 15, 2025"
    },
    {
        id: 10,
        question: "Will I wake up before my alarm?",
        imageUrl: "https://cryptologos.cc/logos/book-of-meme-bome-logo.png",
        options: [
            { name: "YES", odds: 10, color: PRIMARY_BLUE },
            { name: "NO", odds: 90, color: SECONDARY_PURPLE }
        ],
        totalPool: 15,
        endTime: "Dec 16, 2025"
    },
    {
        id: 11,
        question: "Will the new movie get a rating above 8.0?",
        imageUrl: "https://cryptologos.cc/logos/popcat-popcat-logo.png",
        options: [
            { name: "YES", odds: 40, color: PRIMARY_BLUE },
            { name: "NO", odds: 60, color: SECONDARY_PURPLE }
        ],
        totalPool: 890,
        endTime: "Dec 19, 2025"
    }
];

export const MarketProvider = ({ children }: { children: ReactNode }) => {
    const [markets, setMarkets] = useState<Market[]>(() => {
        const saved = localStorage.getItem('forcefi_markets');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse markets from local storage', e);
            }
        }
        return initialMarkets;
    });

    const addMarket = (newMarket: Omit<Market, 'id'>) => {
        setMarkets(prev => {
            const updated = [
                { ...newMarket, id: Math.max(...prev.map(m => m.id), 0) + 1 },
                ...prev
            ];
            localStorage.setItem('forcefi_markets', JSON.stringify(updated));
            return updated;
        });
    };

    // Also sync initial load if it was empty/default to ensure storage is populated
    React.useEffect(() => {
        localStorage.setItem('forcefi_markets', JSON.stringify(markets));
    }, [markets]);

    return (
        <MarketContext.Provider value={{ markets, addMarket }}>
            {children}
        </MarketContext.Provider>
    );
};
