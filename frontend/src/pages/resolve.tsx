import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lineraAdapter } from '../lib/linera-adapter';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { CONTRACTS_APP_ID } from '../constants';

interface Market {
    id: number;
    title: string;
    judge: string;
    opponent: string | null;
    betAmount: number;
    endTime: number;
    imageUrl: string;
    resolved: boolean;
    winningOutcome: number;
}

const ResolvePage = () => {
    const navigate = useNavigate();
    const { primaryWallet } = useDynamicContext();
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState<number | null>(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            if (!primaryWallet) return;

            try {
                if (!lineraAdapter.isApplicationSet()) {
                    await lineraAdapter.setApplication(CONTRACTS_APP_ID);
                }

                const query = `query { markets { id title judge opponent betAmount endTime imageUrl resolved winningOutcome } }`;
                const result = await lineraAdapter.queryApplication<{ markets: any[] }>(query);

                // Filter markets where the current user is the judge
                const myJudgeMarkets = result.markets.filter((m: any) =>
                    m.judge.toLowerCase() === primaryWallet.address.toLowerCase() && !m.resolved
                ).map((m: any) => ({
                    ...m,
                    // No need to remap if we use camelCase everywhere, assuming query returns camelCase
                }));

                setMarkets(myJudgeMarkets);
            } catch (error) {
                console.error("Failed to fetch markets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkets();
    }, [primaryWallet]);

    const handleResolve = async (marketId: number, outcome: number) => {
        if (resolving !== null) return;
        setResolving(marketId);

        try {
            const mutation = `mutation {
                resolve(marketId: ${marketId}, winningOutcome: ${outcome})
            }`;

            await lineraAdapter.mutate(mutation);

            // Remove from list
            setMarkets(prev => prev.filter(m => m.id !== marketId));
            alert("Market resolved successfully!");
        } catch (error: any) {
            console.error("Failed to resolve:", error);
            alert(`Failed to resolve: ${error.message}`);
        } finally {
            setResolving(null);
        }
    };

    if (!primaryWallet) {
        return (
            <div style={{ padding: '2rem', color: 'white', textAlign: 'center', background: '#000', minHeight: '100vh' }}>
                Please connect your wallet to view markets to judge.
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '2rem', color: 'white', textAlign: 'center', background: '#000', minHeight: '100vh' }}>
                Loading markets...
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            fontFamily: "'Inter', sans-serif",
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/markets')}
                    style={{
                        background: 'transparent',
                        border: '1px solid #333',
                        color: '#888',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#666';
                        e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.color = '#888';
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {markets.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888' }}>
                    No active markets found where you are the judge.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '600px' }}>
                    {markets.map(market => (
                        <ResolveCard key={market.id} market={market} onResolve={handleResolve} resolving={resolving} />
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Mock Social Context Data ---
const MOCK_CONTEXTS: Record<string, any> = {
    "Will Johnson Watch Harry Potter ?": {
        type: "twitter",
        user: "Johnson",
        handle: "@johnson_real",
        avatar: "/logo/me1.png",
        content: "Harry potter so good! Just watched the first movie again.",
        date: "2h ago",
        likes: "1.2k",
        retweets: "450"
    },
    "Will Jing Yuan eat rice today?": {
        type: "instagram",
        user: "Jing Yuan",
        handle: "jingyuan_official",
        avatar: "/logo/me2.png",
        image: "/logo/me3.png", // Food picture
        content: "Nothing beats a warm bowl of rice after a long battle. 🍚 #comfortfood",
        date: "5h ago",
        likes: "15.4k"
    },
    "Will Alice score A for Chemistry?": {
        type: "twitter",
        user: "Alice",
        handle: "@alice_chem",
        avatar: "/logo/me4.png",
        content: "Chemistry exam was tough but I think I nailed the stoichiometry questions! 🧪🤞 #studying",
        date: "10m ago",
        likes: "42",
        retweets: "5"
    },
    "Will Alice go KFC today?": {
        type: "instagram",
        user: "Alice",
        handle: "alice_eats",
        avatar: "/logo/me4.png",
        image: "/logo/me5.png", // KFC/Food picture placeholder
        content: "Craving fried chicken so bad right now... 🍗🤤",
        date: "1h ago",
        likes: "89"
    },
    "Will Adrian purpose on 1/1/2026?": {
        type: "twitter",
        user: "Adrian",
        handle: "@adrian_love",
        avatar: "/logo/me1.png",
        content: "2026 is going to be a big year. Just bought a very special ring... 💍🤫",
        date: "Just now",
        likes: "2.1k",
        retweets: "120"
    },
    // 😂 Friend-Group Chaos
    "Will Jake mute the group chat and miss important plans?": {
        type: "twitter",
        user: "Jake",
        handle: "@jake_silent",
        avatar: "/logo/me1.png",
        content: "Guys I swear I didn't see the notification... for 3 days straight. 😅",
        date: "5m ago",
        likes: "12",
        retweets: "0"
    },
    "Will Olivia accidentally send a message to the wrong chat?": {
        type: "twitter",
        user: "Olivia",
        handle: "@liv_oops",
        avatar: "/logo/me4.png",
        content: "OMG DELETE DELETE DELETE. Why is there no unsend feature for real life?? 💀",
        date: "1m ago",
        likes: "56",
        retweets: "2"
    },
    "Will Ben start drama by “just asking a question”?": {
        type: "twitter",
        user: "Ben",
        handle: "@ben_curious",
        avatar: "/logo/me1.png",
        content: "I'm just saying, it's kind of interesting how... [User has been muted]",
        date: "10m ago",
        likes: "3",
        retweets: "0"
    },
    "Will Mia screenshot something she wasn’t supposed to?": {
        type: "twitter",
        user: "Mia",
        handle: "@mia_snaps",
        avatar: "/logo/me4.png",
        content: "Wait, they can SEE when you screenshot?? Since when?? 😳",
        date: "Just now",
        likes: "102",
        retweets: "15"
    },
    // 🍻 Nights Out & Bad Decisions
    "Will Ryan lose something important on a night out?": {
        type: "twitter",
        user: "Ryan",
        handle: "@ryan_lost",
        avatar: "/logo/me1.png",
        content: "Has anyone seen my wallet? Or my keys? Or my left shoe?",
        date: "3am",
        likes: "4",
        retweets: "1"
    },
    "Will Sophie say “I’m not that drunk” and immediately prove otherwise?": {
        type: "instagram",
        user: "Sophie",
        handle: "sophie_party",
        avatar: "/logo/me4.png",
        image: "/logo/me5.png", // Blurry party pic
        content: "I am literally so sober right now. *trips over air* 🥂",
        date: "2am",
        likes: "204"
    },
    "Will Lucas order food he doesn’t even finish?": {
        type: "instagram",
        user: "Lucas",
        handle: "lucas_eats",
        avatar: "/logo/me1.png",
        image: "/logo/me3.png", // Giant food portion
        content: "My eyes were bigger than my stomach. Anyone want 3/4 of a pizza? 🍕",
        date: "1h ago",
        likes: "45"
    },
    "Will Emma swear she’s going home early and not?": {
        type: "twitter",
        user: "Emma",
        handle: "@emma_out",
        avatar: "/logo/me4.png",
        content: "One drink and I'm out. I have work tomorrow. *Posted 4am*",
        date: "4:02am",
        likes: "89",
        retweets: "12"
    },
    // 💬 Dating & Awkwardness
    "Will Noah text his ex before the end of the year?": {
        type: "twitter",
        user: "Noah",
        handle: "@noah_feels",
        avatar: "/logo/me1.png",
        content: "I just think we need closure, you know? It's mature to check in. Right?",
        date: "11:59pm",
        likes: "0",
        retweets: "0"
    },
    "Will Chloe catch feelings when she said she wouldn’t?": {
        type: "twitter",
        user: "Chloe",
        handle: "@chloe_chill",
        avatar: "/logo/me4.png",
        content: "He's just a friend! We just hung out for 12 hours straight and held hands, no big deal.",
        date: "2h ago",
        likes: "34",
        retweets: "5"
    },
    "Will Ethan say “this feels different” unironically?": {
        type: "twitter",
        user: "Ethan",
        handle: "@ethan_vibe",
        avatar: "/logo/me1.png",
        content: "I don't know man, the vibe is just... different this time. She gets me.",
        date: "1h ago",
        likes: "8",
        retweets: "1"
    },
    "Will Hannah overanalyze a text for more than an hour?": {
        type: "twitter",
        user: "Hannah",
        handle: "@hannah_think",
        avatar: "/logo/me4.png",
        content: "But why did he use *that* emoji? Does the blue heart mean friendzone?? 💙🤔",
        date: "30m ago",
        likes: "15",
        retweets: "2"
    },
    // 🕒 Reliability Bets
    "Will Alex be late to more than half of plans this month?": {
        type: "twitter",
        user: "Alex",
        handle: "@alex_omw",
        avatar: "/logo/me1.png",
        content: "On my way! (Just getting in the shower) 🚿🚗",
        date: "5m ago",
        likes: "67",
        retweets: "3"
    },
    "Will Priya cancel plans within 30 minutes of start time?": {
        type: "twitter",
        user: "Priya",
        handle: "@priya_raincheck",
        avatar: "/logo/me4.png",
        content: "So something crazy came up... raincheck? 🥺👉👈",
        date: "15m before",
        likes: "2",
        retweets: "0"
    },
    "Will Tom say “I’m on my way” while still at home?": {
        type: "twitter",
        user: "Tom",
        handle: "@tom_traffic",
        avatar: "/logo/me1.png",
        content: "Traffic is crazy right now! *Netflix intro playing in background* 🚦",
        date: "Now",
        likes: "45",
        retweets: "10"
    },
    "Will Laura forget the plan entirely?": {
        type: "twitter",
        user: "Laura",
        handle: "@laura_oops",
        avatar: "/logo/me4.png",
        content: "Wait, that was TODAY? I thought it was next Friday!! 📅😱",
        date: "1h after",
        likes: "12",
        retweets: "1"
    },
    // 🧠 Personality Bets
    "Will Daniel start a new hobby and quit within 2 weeks?": {
        type: "instagram",
        user: "Daniel",
        handle: "dan_hobbies",
        avatar: "/logo/me1.png",
        image: "/logo/me5.png", // Hobby gear
        content: "Just bought $500 worth of climbing gear. This is my new life. 🧗‍♂️",
        date: "2d ago",
        likes: "88"
    },
    "Will Isabella announce a “life reset” and change nothing?": {
        type: "twitter",
        user: "Isabella",
        handle: "@bella_reset",
        avatar: "/logo/me4.png",
        content: "Deleting all social media. Time to focus on ME. ✨ *Posted 5 mins ago*",
        date: "5m ago",
        likes: "123",
        retweets: "4"
    },
    "Will Chris give unsolicited advice?": {
        type: "twitter",
        user: "Chris",
        handle: "@chris_guru",
        avatar: "/logo/me1.png",
        content: "You know, if you just optimized your morning routine with cold plunges, you wouldn't be tired. 🧊",
        date: "1h ago",
        likes: "1",
        retweets: "0"
    },
    "Will Nina say “this is my year” before February ends?": {
        type: "twitter",
        user: "Nina",
        handle: "@nina_2026",
        avatar: "/logo/me4.png",
        content: "2026 is going to be different. I can feel it. New year new me! 🌟",
        date: "Jan 1",
        likes: "200",
        retweets: "20"
    },
    // 🤡 Pure Nonsense
    "Will Kevin turn a minor inconvenience into a full rant?": {
        type: "twitter",
        user: "Kevin",
        handle: "@kev_rants",
        avatar: "/logo/me1.png",
        content: "THE BARISTA PUT 2 PUMPS OF SYRUP INSTEAD OF 3. MY DAY IS RUINED. ☕️😡",
        date: "8am",
        likes: "5",
        retweets: "0"
    },
    "Will Zoe become obsessed with something random?": {
        type: "twitter",
        user: "Zoe",
        handle: "@zoe_obsessed",
        avatar: "/logo/me4.png",
        content: "Did you know you can farm ants? I've been watching ant videos for 6 hours. 🐜",
        date: "3h ago",
        likes: "34",
        retweets: "2"
    },
    "Will Marcus make a joke that goes on way too long?": {
        type: "twitter",
        user: "Marcus",
        handle: "@marcus_comedy",
        avatar: "/logo/me1.png",
        content: "So the horse walks into the bar... wait, let me start over. You have to understand the context...",
        date: "10m ago",
        likes: "2",
        retweets: "0"
    },
    "Will Lily cry over something objectively small?": {
        type: "twitter",
        user: "Lily",
        handle: "@lily_tears",
        avatar: "/logo/me4.png",
        content: "The puppy in that commercial looked so lonely 😭😭😭 I can't handle this.",
        date: "Just now",
        likes: "45",
        retweets: "3"
    }
};

const generateFallbackContext = (title: string) => {
    const avatars = ["/logo/me1.png", "/logo/me2.png", "/logo/me3.png", "/logo/me4.png", "/logo/me5.png"];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const user = "User" + Math.floor(Math.random() * 1000);
    const handle = "@" + user.toLowerCase();

    let content = `I'm placing my bet on "${title}"! Who else is in? 🚀`;

    // Keyword-based story generation
    const t = title.toLowerCase();
    if (t.includes("late") || t.includes("time")) {
        content = "Traffic is terrible, I swear! I'll be there in 5... maybe 10... 🚗💨";
    } else if (t.includes("cancel") || t.includes("plan")) {
        content = "Honestly, staying in bed sounds way better than going out tonight. 😴 #cancelplans";
    } else if (t.includes("drunk") || t.includes("party") || t.includes("shot")) {
        content = "I'm not even that drunk... *sends text to ex* 🍻🥴";
    } else if (t.includes("text") || t.includes("message") || t.includes("call")) {
        content = "To text or not to text? That is the question. (I'm gonna do it) 📱🫣";
    } else if (t.includes("food") || t.includes("eat") || t.includes("diet")) {
        content = "Diet starts tomorrow. Today we feast! 🍕🍔🍟";
    } else if (t.includes("gym") || t.includes("workout") || t.includes("run")) {
        content = "New year new me! *Goes to gym once and takes 50 selfies* 💪📸";
    } else if (t.includes("money") || t.includes("buy") || t.includes("spend")) {
        content = "My bank account is crying but this purchase was absolutely necessary. 💸🛍️";
    } else if (t.includes("love") || t.includes("date") || t.includes("crush")) {
        content = "Is it love or just a really good first date? Only time will tell. ❤️🌹";
    }

    return {
        type: "twitter",
        user: user,
        handle: handle,
        avatar: randomAvatar,
        content: content,
        date: "Just now",
        likes: Math.floor(Math.random() * 100).toString(),
        retweets: Math.floor(Math.random() * 20).toString()
    };
};

const SocialContextCard = ({ title }: { title: string }) => {
    // Simple fuzzy match or exact match
    let context = MOCK_CONTEXTS[title] || MOCK_CONTEXTS[Object.keys(MOCK_CONTEXTS).find(k => title.includes(k)) || ""];

    // Fallback if no match found
    if (!context) {
        context = generateFallbackContext(title);
    }

    if (context.type === "twitter") {
        return (
            <div style={{
                background: '#000',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                marginTop: '-0.5rem'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <img src={context.avatar} alt={context.user} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: 'white' }}>{context.user}</span>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{context.handle} · {context.date}</span>
                        </div>
                        <div style={{ color: '#e2e8f0', marginTop: '0.25rem', lineHeight: '1.4' }}>
                            {context.content}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginLeft: '3.25rem', color: '#666', fontSize: '0.85rem' }}>
                    <span>💬 24</span>
                    <span>🔁 {context.retweets}</span>
                    <span>❤️ {context.likes}</span>
                    <span>📊 12k</span>
                </div>
            </div>
        );
    }

    if (context.type === "instagram") {
        return (
            <div style={{
                background: '#000',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                marginTop: '-0.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <img src={context.avatar} alt={context.user} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #e1306c' }} />
                    <span style={{ fontWeight: 'bold', color: 'white' }}>{context.handle}</span>
                </div>
                <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid #222' }}>
                    <img src={context.image} alt="Post" style={{ width: '100%', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                    <span>❤️</span><span>💬</span><span>🚀</span>
                </div>
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{context.likes} likes</span>
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{context.user}</span>
                    {context.content}
                </div>
                <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    View all 128 comments
                </div>
            </div>
        );
    }

    return null;
};

const ResolveCard = ({ market, onResolve, resolving }: { market: Market, onResolve: (id: number, outcome: number) => void, resolving: number | null }) => {
    const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);

    // Format dates
    const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const expiresDate = market.endTime;

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            position: 'relative'
        }}>
            {/* Active Badge */}
            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: '#fbbf24',
                color: '#000',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                Active
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '2.5rem',
                paddingRight: '80px', // Space for badge
                lineHeight: '1.3'
            }}>
                {market.title}
            </h2>

            {/* Main Image REMOVED globally as requested */}

            {/* Social Context - NEW */}
            <SocialContextCard title={market.title} />

            {/* Bet Amount Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold',
                    color: '#e2e8f0'
                }}>
                    🔗 {market.betAmount} Linera Pool
                </div>
            </div>

            {/* Select Winner Section */}
            <div style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                background: 'rgba(0,0,0,0.2)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Select the winner
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setSelectedOutcome(0)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: selectedOutcome === 0 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                            background: selectedOutcome === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
                            <img src="/logo/me1.png" alt="Yes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>YES</span>
                    </button>
                    <button
                        onClick={() => setSelectedOutcome(1)}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: selectedOutcome === 1 ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                            background: selectedOutcome === 1 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            color: 'white'
                        }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
                            <img src="/logo/me2.png" alt="No" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>NO</span>
                    </button>
                </div>
            </div>

            {/* Resolve Button */}
            <button
                onClick={() => selectedOutcome !== null && onResolve(market.id, selectedOutcome)}
                disabled={selectedOutcome === null || resolving === market.id}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: selectedOutcome === null ? '#333' : '#fbbf24',
                    color: selectedOutcome === null ? '#666' : '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: selectedOutcome === null || resolving === market.id ? 'not-allowed' : 'pointer',
                    marginBottom: '2rem',
                    transition: 'all 0.2s'
                }}
            >
                {resolving === market.id ? 'Resolving...' : 'Resolve Market'}
            </button>

            {/* Judge Info */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>⚖️</div>
                <span style={{ color: '#94a3b8' }}>Judge:</span>
                <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{market.judge.substring(0, 10)}...</span>
            </div>

            {/* Contract Info */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Contract</span>
                    <span style={{ fontFamily: 'monospace' }}>{CONTRACTS_APP_ID.substring(0, 10)}... <span style={{ fontSize: '0.8rem' }}>🔗</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Created</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>{createdDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <span>Expires</span>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>{expiresDate}</span>
                </div>
            </div>
        </div>
    );
};

export default ResolvePage;
